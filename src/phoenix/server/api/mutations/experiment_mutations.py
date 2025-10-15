import asyncio
from typing import List, Union

import strawberry
from sqlalchemy import delete, update
from strawberry import UNSET
from strawberry.relay import GlobalID
from strawberry.types import Info

from phoenix.db import models
from phoenix.db.helpers import (
    get_eval_trace_ids_for_experiments,
    get_project_names_for_experiments,
)
from phoenix.server.api.auth import IsLocked, IsNotReadOnly, IsNotViewer
from phoenix.server.api.context import Context
from phoenix.server.api.exceptions import CustomGraphQLError
from phoenix.server.api.input_types.DeleteExperimentsInput import DeleteExperimentsInput
from phoenix.server.api.input_types.PatchExperimentInput import PatchExperimentsInput
from phoenix.server.api.types.Experiment import Experiment, to_gql_experiment
from phoenix.server.api.types.node import from_global_id_with_expected_type
from phoenix.server.api.utils import delete_projects, delete_traces
from phoenix.server.dml_event import ExperimentDeleteEvent


@strawberry.type
class ExperimentMutationPayload:
    experiments: Union[List[Experiment], Experiment]


@strawberry.type
class ExperimentMutationMixin:
    @strawberry.mutation(permission_classes=[IsNotReadOnly, IsNotViewer])  # type: ignore
    async def delete_experiments(
        self,
        info: Info[Context, None],
        input: DeleteExperimentsInput,
    ) -> ExperimentMutationPayload:
        experiment_ids = [
            from_global_id_with_expected_type(experiment_id, Experiment.__name__)
            for experiment_id in input.experiment_ids
        ]
        project_names_stmt = get_project_names_for_experiments(*experiment_ids)
        eval_trace_ids_stmt = get_eval_trace_ids_for_experiments(*experiment_ids)
        async with info.context.db() as session:
            project_names = await session.scalars(project_names_stmt)
            eval_trace_ids = await session.scalars(eval_trace_ids_stmt)
            savepoint = await session.begin_nested()
            experiments = {
                experiment.id: experiment
                async for experiment in (
                    await session.stream_scalars(
                        delete(models.Experiment)
                        .where(models.Experiment.id.in_(experiment_ids))
                        .returning(models.Experiment)
                    )
                )
            }
            if unknown_experiment_ids := set(experiment_ids) - set(experiments.keys()):
                await savepoint.rollback()
                raise CustomGraphQLError(
                    "Failed to delete experiment(s), "
                    "probably due to invalid input experiment ID(s): "
                    + str(
                        [
                            str(GlobalID(Experiment.__name__, str(experiment_id)))
                            for experiment_id in unknown_experiment_ids
                        ]
                    )
                )
        await asyncio.gather(
            delete_projects(info.context.db, *project_names),
            delete_traces(info.context.db, *eval_trace_ids),
            return_exceptions=True,
        )
        info.context.event_queue.put(ExperimentDeleteEvent(tuple(experiments.keys())))
        return ExperimentMutationPayload(
            experiments=[
                to_gql_experiment(experiments[experiment_id]) for experiment_id in experiment_ids
            ]
        )

    @strawberry.mutation(permission_classes=[IsNotReadOnly, IsNotViewer, IsLocked])  # type: ignore
    async def patch_experiments(
        self,
        info: Info[Context, None],
        input: PatchExperimentsInput,
    ) -> ExperimentMutationPayload:
        experiment_id = from_global_id_with_expected_type(
            global_id=input.experiment_id, expected_type_name=Experiment.__name__
        )
        patch = {
            column.key: patch_value
            for column, patch_value, column_is_nullable in (
                (models.Experiment.name, input.name, False),
                (models.Experiment.description, input.description, True),
                (models.Experiment.metadata_, input.metadata, False),
            )
            if patch_value is not UNSET and (patch_value is not None or column_is_nullable)
        }
        async with info.context.db() as session:
            experiment = await session.scalar(
                update(models.Experiment)
                .where(models.Experiment.id == experiment_id)
                .returning(models.Experiment)
                .values(**patch)
            )
            assert experiment is not None
        # info.context.event_queue.put(DatasetInsertEvent((dataset.id,)))
        return ExperimentMutationPayload(experiments=to_gql_experiment(experiment))
