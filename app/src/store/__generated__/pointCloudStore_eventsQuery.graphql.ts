/**
 * @generated SignedSource<<7eede205b203c5f9c57bfc514e649373>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type DimensionType = "actual" | "feature" | "prediction" | "tag";
export type pointCloudStore_eventsQuery$variables = {
  corpusEventIds: ReadonlyArray<string>;
  primaryEventIds: ReadonlyArray<string>;
  referenceEventIds: ReadonlyArray<string>;
};
export type pointCloudStore_eventsQuery$data = {
  readonly model: {
    readonly corpusInferences: {
      readonly events: ReadonlyArray<{
        readonly dimensions: ReadonlyArray<{
          readonly dimension: {
            readonly name: string;
            readonly type: DimensionType;
          };
          readonly value: string | null;
        }>;
        readonly documentText: string | null;
        readonly eventMetadata: {
          readonly actualLabel: string | null;
          readonly actualScore: number | null;
          readonly predictionId: string | null;
          readonly predictionLabel: string | null;
          readonly predictionScore: number | null;
        };
        readonly id: string;
        readonly promptAndResponse: {
          readonly prompt: string | null;
          readonly response: string | null;
        } | null;
      }>;
    } | null;
    readonly primaryInferences: {
      readonly events: ReadonlyArray<{
        readonly dimensions: ReadonlyArray<{
          readonly dimension: {
            readonly name: string;
            readonly type: DimensionType;
          };
          readonly value: string | null;
        }>;
        readonly documentText: string | null;
        readonly eventMetadata: {
          readonly actualLabel: string | null;
          readonly actualScore: number | null;
          readonly predictionId: string | null;
          readonly predictionLabel: string | null;
          readonly predictionScore: number | null;
        };
        readonly id: string;
        readonly promptAndResponse: {
          readonly prompt: string | null;
          readonly response: string | null;
        } | null;
      }>;
    };
    readonly referenceInferences: {
      readonly events: ReadonlyArray<{
        readonly dimensions: ReadonlyArray<{
          readonly dimension: {
            readonly id: string;
            readonly name: string;
            readonly type: DimensionType;
          };
          readonly value: string | null;
        }>;
        readonly documentText: string | null;
        readonly eventMetadata: {
          readonly actualLabel: string | null;
          readonly actualScore: number | null;
          readonly predictionId: string | null;
          readonly predictionLabel: string | null;
          readonly predictionScore: number | null;
        };
        readonly id: string;
        readonly promptAndResponse: {
          readonly prompt: string | null;
          readonly response: string | null;
        } | null;
      }>;
    } | null;
  };
};
export type pointCloudStore_eventsQuery = {
  response: pointCloudStore_eventsQuery$data;
  variables: pointCloudStore_eventsQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "corpusEventIds"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "primaryEventIds"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "referenceEventIds"
},
v3 = [
  {
    "kind": "Variable",
    "name": "eventIds",
    "variableName": "primaryEventIds"
  }
],
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "type",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "value",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "concreteType": "EventMetadata",
  "kind": "LinkedField",
  "name": "eventMetadata",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "predictionId",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "predictionLabel",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "predictionScore",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "actualLabel",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "actualScore",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "concreteType": "PromptResponse",
  "kind": "LinkedField",
  "name": "promptAndResponse",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "prompt",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "response",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "documentText",
  "storageKey": null
},
v11 = [
  (v4/*: any*/),
  {
    "alias": null,
    "args": null,
    "concreteType": "DimensionWithValue",
    "kind": "LinkedField",
    "name": "dimensions",
    "plural": true,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Dimension",
        "kind": "LinkedField",
        "name": "dimension",
        "plural": false,
        "selections": [
          (v5/*: any*/),
          (v6/*: any*/)
        ],
        "storageKey": null
      },
      (v7/*: any*/)
    ],
    "storageKey": null
  },
  (v8/*: any*/),
  (v9/*: any*/),
  (v10/*: any*/)
],
v12 = {
  "alias": null,
  "args": null,
  "concreteType": "Inferences",
  "kind": "LinkedField",
  "name": "referenceInferences",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": [
        {
          "kind": "Variable",
          "name": "eventIds",
          "variableName": "referenceEventIds"
        }
      ],
      "concreteType": "Event",
      "kind": "LinkedField",
      "name": "events",
      "plural": true,
      "selections": [
        (v4/*: any*/),
        {
          "alias": null,
          "args": null,
          "concreteType": "DimensionWithValue",
          "kind": "LinkedField",
          "name": "dimensions",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "Dimension",
              "kind": "LinkedField",
              "name": "dimension",
              "plural": false,
              "selections": [
                (v4/*: any*/),
                (v5/*: any*/),
                (v6/*: any*/)
              ],
              "storageKey": null
            },
            (v7/*: any*/)
          ],
          "storageKey": null
        },
        (v8/*: any*/),
        (v9/*: any*/),
        (v10/*: any*/)
      ],
      "storageKey": null
    }
  ],
  "storageKey": null
},
v13 = [
  {
    "kind": "Variable",
    "name": "eventIds",
    "variableName": "corpusEventIds"
  }
],
v14 = [
  (v4/*: any*/),
  {
    "alias": null,
    "args": null,
    "concreteType": "DimensionWithValue",
    "kind": "LinkedField",
    "name": "dimensions",
    "plural": true,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Dimension",
        "kind": "LinkedField",
        "name": "dimension",
        "plural": false,
        "selections": [
          (v5/*: any*/),
          (v6/*: any*/),
          (v4/*: any*/)
        ],
        "storageKey": null
      },
      (v7/*: any*/)
    ],
    "storageKey": null
  },
  (v8/*: any*/),
  (v9/*: any*/),
  (v10/*: any*/)
];
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "pointCloudStore_eventsQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "InferenceModel",
        "kind": "LinkedField",
        "name": "model",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Inferences",
            "kind": "LinkedField",
            "name": "primaryInferences",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": (v3/*: any*/),
                "concreteType": "Event",
                "kind": "LinkedField",
                "name": "events",
                "plural": true,
                "selections": (v11/*: any*/),
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          (v12/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Inferences",
            "kind": "LinkedField",
            "name": "corpusInferences",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": (v13/*: any*/),
                "concreteType": "Event",
                "kind": "LinkedField",
                "name": "events",
                "plural": true,
                "selections": (v11/*: any*/),
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v2/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "pointCloudStore_eventsQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "InferenceModel",
        "kind": "LinkedField",
        "name": "model",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Inferences",
            "kind": "LinkedField",
            "name": "primaryInferences",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": (v3/*: any*/),
                "concreteType": "Event",
                "kind": "LinkedField",
                "name": "events",
                "plural": true,
                "selections": (v14/*: any*/),
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          (v12/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Inferences",
            "kind": "LinkedField",
            "name": "corpusInferences",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": (v13/*: any*/),
                "concreteType": "Event",
                "kind": "LinkedField",
                "name": "events",
                "plural": true,
                "selections": (v14/*: any*/),
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "bcac76c653bed7d4f922f175d03a3408",
    "id": null,
    "metadata": {},
    "name": "pointCloudStore_eventsQuery",
    "operationKind": "query",
    "text": "query pointCloudStore_eventsQuery(\n  $primaryEventIds: [ID!]!\n  $referenceEventIds: [ID!]!\n  $corpusEventIds: [ID!]!\n) {\n  model {\n    primaryInferences {\n      events(eventIds: $primaryEventIds) {\n        id\n        dimensions {\n          dimension {\n            name\n            type\n            id\n          }\n          value\n        }\n        eventMetadata {\n          predictionId\n          predictionLabel\n          predictionScore\n          actualLabel\n          actualScore\n        }\n        promptAndResponse {\n          prompt\n          response\n        }\n        documentText\n      }\n    }\n    referenceInferences {\n      events(eventIds: $referenceEventIds) {\n        id\n        dimensions {\n          dimension {\n            id\n            name\n            type\n          }\n          value\n        }\n        eventMetadata {\n          predictionId\n          predictionLabel\n          predictionScore\n          actualLabel\n          actualScore\n        }\n        promptAndResponse {\n          prompt\n          response\n        }\n        documentText\n      }\n    }\n    corpusInferences {\n      events(eventIds: $corpusEventIds) {\n        id\n        dimensions {\n          dimension {\n            name\n            type\n            id\n          }\n          value\n        }\n        eventMetadata {\n          predictionId\n          predictionLabel\n          predictionScore\n          actualLabel\n          actualScore\n        }\n        promptAndResponse {\n          prompt\n          response\n        }\n        documentText\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "00a957322684d9186fdf16d33a75b931";

export default node;
