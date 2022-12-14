import React from "react";

import { ControlProps, isIntegerControl, isNumberControl, or, RankedTester, rankWith } from "@jsonforms/core";
import { withJsonFormsControlProps } from "@jsonforms/react";
import { NumericInput } from "./NumericInput";

const NumericInputControl: React.FunctionComponent<ControlProps> = (props: ControlProps) => {
	const splitScope = props.uischema.scope.split("/");
	const scope = splitScope[splitScope.length - 1];
	const schema = props.rootSchema.properties ? props.rootSchema.properties[scope] : { type: "integer" };

	return (
		<NumericInput
			value={props.data}
			onChange={(ev: number): void => props.handleChange(props.path, ev)}
			labelName={props.label}
			isFloat={schema.type === ""}
			enabled={props.enabled}
			errors={props.errors}
		/>
	);
};

export const NumericInputControlTester: RankedTester = rankWith(3, or(isIntegerControl, isNumberControl));

export default withJsonFormsControlProps(NumericInputControl);
