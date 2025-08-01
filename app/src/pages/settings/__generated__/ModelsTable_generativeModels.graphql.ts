/**
 * @generated SignedSource<<ca8bb56d94981513b62a855201578fec>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
export type GenerativeModelKind = "BUILT_IN" | "CUSTOM";
export type GenerativeProviderKey = "ANTHROPIC" | "AWS" | "AZURE_OPENAI" | "DEEPSEEK" | "GOOGLE" | "OLLAMA" | "OPENAI" | "XAI";
export type TokenKind = "COMPLETION" | "PROMPT";
import { FragmentRefs } from "relay-runtime";
export type ModelsTable_generativeModels$data = {
  readonly generativeModels: ReadonlyArray<{
    readonly createdAt: string;
    readonly id: string;
    readonly kind: GenerativeModelKind;
    readonly lastUsedAt: string | null;
    readonly name: string;
    readonly namePattern: string;
    readonly provider: string | null;
    readonly providerKey: GenerativeProviderKey | null;
    readonly startTime: string | null;
    readonly tokenPrices: ReadonlyArray<{
      readonly costPerMillionTokens: number;
      readonly kind: TokenKind;
      readonly tokenType: string;
    }>;
    readonly updatedAt: string;
  }>;
  readonly " $fragmentType": "ModelsTable_generativeModels";
};
export type ModelsTable_generativeModels$key = {
  readonly " $data"?: ModelsTable_generativeModels$data;
  readonly " $fragmentSpreads": FragmentRefs<"ModelsTable_generativeModels">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "kind",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ModelsTable_generativeModels",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "GenerativeModel",
      "kind": "LinkedField",
      "name": "generativeModels",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "id",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "name",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "provider",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "namePattern",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "providerKey",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "startTime",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "createdAt",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "updatedAt",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "lastUsedAt",
          "storageKey": null
        },
        (v0/*: any*/),
        {
          "alias": null,
          "args": null,
          "concreteType": "TokenPrice",
          "kind": "LinkedField",
          "name": "tokenPrices",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "tokenType",
              "storageKey": null
            },
            (v0/*: any*/),
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "costPerMillionTokens",
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
};
})();

(node as any).hash = "72e6b970ebca0dd6ce7b1e6e8e75cbc9";

export default node;
