from abc import ABC
from collections.abc import Awaitable, Callable, Iterable, Iterator, Mapping, Sequence
from enum import Enum, auto
from typing import Any, Optional

from openinference.semconv.trace import OpenInferenceSpanKindValues, SpanAttributes
from sqlalchemy import Insert
from sqlalchemy.dialects.postgresql import insert as insert_postgresql
from sqlalchemy.dialects.sqlite import insert as insert_sqlite
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.sql.elements import KeyedColumnElement
from typing_extensions import TypeAlias, assert_never

from phoenix.db import models
from phoenix.db.helpers import SupportedSQLDialect
from phoenix.db.models import Base
from phoenix.trace.attributes import get_attribute_value


class DataManipulationEvent(ABC):
    """
    Execution of DML (Data Manipulation Language) statements.
    """


DataManipulation: TypeAlias = Callable[[AsyncSession], Awaitable[Optional[DataManipulationEvent]]]


class OnConflict(Enum):
    DO_NOTHING = auto()
    DO_UPDATE = auto()


def insert_on_conflict(
    *records: Mapping[str, Any],
    table: type[Base],
    dialect: SupportedSQLDialect,
    unique_by: Sequence[str],
    on_conflict: OnConflict = OnConflict.DO_UPDATE,
    set_: Optional[Mapping[str, Any]] = None,
    constraint_name: Optional[str] = None,
) -> Insert:
    """
    Dialect specific insertion statement using ON CONFLICT DO syntax.
    """
    if on_conflict is OnConflict.DO_UPDATE:
        # postegresql rejects duplicate updates for the same record
        seen = set()
        unique_records = []
        for v in reversed(records):
            if (k := tuple(v.get(name) for name in unique_by)) in seen:
                continue
            unique_records.append(v)
            seen.add(k)
        records = tuple(reversed(unique_records))
    constraint = constraint_name or "_".join(("uq", table.__tablename__, *unique_by))
    if dialect is SupportedSQLDialect.POSTGRESQL:
        stmt_postgresql = insert_postgresql(table).values(records)
        if on_conflict is OnConflict.DO_NOTHING:
            return stmt_postgresql.on_conflict_do_nothing(constraint=constraint)
        if on_conflict is OnConflict.DO_UPDATE:
            return stmt_postgresql.on_conflict_do_update(
                constraint=constraint,
                set_=set_ if set_ else dict(_clean(stmt_postgresql.excluded.items())),
            )
        assert_never(on_conflict)
    if dialect is SupportedSQLDialect.SQLITE:
        stmt_sqlite = insert_sqlite(table).values(records)
        if on_conflict is OnConflict.DO_NOTHING:
            return stmt_sqlite.on_conflict_do_nothing(unique_by)
        if on_conflict is OnConflict.DO_UPDATE:
            return stmt_sqlite.on_conflict_do_update(
                unique_by,
                set_=set_ if set_ else dict(_clean(stmt_sqlite.excluded.items())),
            )
        assert_never(on_conflict)
    assert_never(dialect)


def _clean(
    kv: Iterable[tuple[str, KeyedColumnElement[Any]]],
) -> Iterator[tuple[str, KeyedColumnElement[Any]]]:
    for k, v in kv:
        if v.primary_key or k == "created_at":
            continue
        if k == "metadata_":
            yield "metadata", v
        else:
            yield k, v


def as_kv(obj: models.Base) -> Iterator[tuple[str, Any]]:
    for k, c in obj.__table__.c.items():
        if k in ["created_at", "updated_at"]:
            continue
        k = "metadata_" if k == "metadata" else k
        v = getattr(obj, k, None)
        if c.primary_key and v is None:
            # postgresql disallows None for primary key
            continue
        yield k, v


def should_calculate_span_cost(
    attributes: Optional[Mapping[str, Any]],
) -> bool:
    return bool(
        (span_kind := get_attribute_value(attributes, SpanAttributes.OPENINFERENCE_SPAN_KIND))
        and isinstance(span_kind, str)
        and span_kind == OpenInferenceSpanKindValues.LLM.value
        and (llm_name := get_attribute_value(attributes, SpanAttributes.LLM_MODEL_NAME))
        and isinstance(llm_name, str)
        and llm_name.strip()
    )
