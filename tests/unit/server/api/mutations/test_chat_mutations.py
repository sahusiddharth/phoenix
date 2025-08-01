import re

from strawberry.relay import GlobalID
from vcr.request import Request

from phoenix.server.api.types.Dataset import Dataset
from phoenix.server.api.types.DatasetExample import DatasetExample
from phoenix.server.api.types.DatasetVersion import DatasetVersion
from phoenix.server.api.types.ExperimentRun import ExperimentRun
from phoenix.server.experiments.utils import is_experiment_project_name

from ....graphql import AsyncGraphQLClient
from ....vcr import CustomVCR


class TestChatCompletionMutationMixin:
    async def test_chat_completion_over_dataset(
        self,
        gql_client: AsyncGraphQLClient,
        openai_api_key: str,
        playground_dataset_with_patch_revision: None,
        custom_vcr: CustomVCR,
    ) -> None:
        dataset_id = str(GlobalID(type_name=Dataset.__name__, node_id=str(1)))
        dataset_version_id = str(GlobalID(type_name=DatasetVersion.__name__, node_id=str(1)))
        query = """
          mutation ChatCompletionOverDataset($input: ChatCompletionOverDatasetInput!) {
            chatCompletionOverDataset(input: $input) {
              datasetId
              datasetVersionId
              experimentId
              examples {
                datasetExampleId
                experimentRunId
                result {
                  __typename
                  ... on ChatCompletionMutationPayload {
                    content
                    span {
                      cumulativeTokenCountTotal
                      input {
                        value
                      }
                      output {
                        value
                      }
                      trace {
                        project {
                          name
                        }
                      }
                    }
                  }
                  ... on ChatCompletionMutationError {
                    message
                  }
                }
              }
            }
          }

          query GetExperiment($experimentId: ID!) {
            experiment: node(id: $experimentId) {
              ... on Experiment {
                projectName
              }
            }
          }
        """
        variables = {
            "input": {
                "model": {"providerKey": "OPENAI", "name": "gpt-4"},
                "datasetId": dataset_id,
                "datasetVersionId": dataset_version_id,
                "messages": [
                    {
                        "role": "USER",
                        "content": "What country is {city} in? Answer in one word, no punctuation.",
                    }
                ],
                "templateFormat": "F_STRING",
                "credentials": [{"envVarName": "OPENAI_API_KEY", "value": "sk-"}],
            }
        }
        custom_vcr.register_matcher(
            _request_bodies_contain_same_city.__name__, _request_bodies_contain_same_city
        )  # a custom request matcher is needed since the requests are concurrent
        with custom_vcr.use_cassette():
            result = await gql_client.execute(query, variables, "ChatCompletionOverDataset")
            assert not result.errors
            assert (data := result.data)
            assert (field := data["chatCompletionOverDataset"])
            assert field["datasetId"] == dataset_id
            assert field["datasetVersionId"] == dataset_version_id
            assert (examples := field["examples"])
            common_project_name = None
            for i, example in enumerate(examples, 1):
                assert example["datasetExampleId"] == str(
                    GlobalID(type_name=DatasetExample.__name__, node_id=str(i))
                )
                assert example["experimentRunId"] == str(
                    GlobalID(type_name=ExperimentRun.__name__, node_id=str(i))
                )
                assert (result := example["result"])
                if result["__typename"] == "ChatCompletionMutationError":
                    assert result["message"]
                    continue
                assert result["__typename"] == "ChatCompletionMutationPayload"
                assert result["content"]
                assert result["span"]["input"]["value"]
                assert result["span"]["output"]["value"]
                assert result["span"]["cumulativeTokenCountTotal"]
                project_name = result["span"]["trace"]["project"]["name"]
                assert is_experiment_project_name(project_name)
                if common_project_name:
                    assert project_name == common_project_name
                common_project_name = project_name

        result = await gql_client.execute(
            query, {"experimentId": field["experimentId"]}, "GetExperiment"
        )
        assert not result.errors
        assert (data := result.data)
        assert (field := data["experiment"])
        assert field["projectName"] == common_project_name


def _request_bodies_contain_same_city(request1: Request, request2: Request) -> None:
    assert _extract_city(request1.body.decode()) == _extract_city(request2.body.decode())


def _extract_city(body: str) -> str:
    if match := re.search(r"What country is (\w+) in\?", body):
        return match.group(1)
    raise ValueError(f"Could not extract city from body: {body}")
