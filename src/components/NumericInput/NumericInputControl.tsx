import React from "react";
import { withJsonFormsArrayControlProps } from "@jsonforms/react";
import { NumericInput } from "./NumericInput";
import { ArrayControlProps, isIntegerControl, isNumberControl, or, RankedTester, rankWith } from "@jsonforms/core";

const NumericInputControl: React.FunctionComponent<ArrayControlProps> = (props: ArrayControlProps) => {
	const splitScope = props.uischema.scope.split("/");
	const scope = splitScope[splitScope.length - 1];
	const schema = props.rootSchema.properties ? props.rootSchema.properties[scope] : { type: "integer" };

	const label = `${props.label}`;

	return <NumericInput labelName={label} isFloat={schema["type"] === "number"} />;
};

export const NumericInputControlTester: RankedTester = rankWith(3, or(isIntegerControl, isNumberControl));

export default withJsonFormsArrayControlProps(NumericInputControl);
