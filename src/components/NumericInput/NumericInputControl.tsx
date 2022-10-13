import React from "react";
import { withJsonFormsArrayControlProps } from "@jsonforms/react";
import { NumericInput } from "./NumericInput";
import { ArrayControlProps, isIntegerControl, isNumberControl, JsonSchema, or, RankedTester, rankWith } from "@jsonforms/core";

const NumericInputControl: React.FunctionComponent<ArrayControlProps> = (props: ArrayControlProps) => {
	const schema = props.schema;
	const label = `${props.label}`;
	console.log(schema, props.label, props.schema);

	return <NumericInput labelName={label} isFloat={false} />;
};

export const NumericInputControlTester: RankedTester = rankWith(3, or(isIntegerControl, isNumberControl));

export default withJsonFormsArrayControlProps(NumericInputControl);
