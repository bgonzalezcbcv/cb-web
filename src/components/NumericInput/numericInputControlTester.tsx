import { JsonSchema, rankWith, UISchemaElement, uiTypeIs } from "@jsonforms/core";

const ranking: (uischema: UISchemaElement, schema: JsonSchema) => number = rankWith(3, uiTypeIs("integer"));

export default ranking;
