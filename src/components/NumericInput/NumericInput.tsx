import { isUndefined } from "lodash";
import React from "react";

import { TextField } from "@mui/material";

export type NumericInputProps = {
	value: number;
	onChange: (ev: number) => void;
	labelName: string;
	isFloat: boolean;
	errors: string;
	enabled: boolean;
	maxLength?: number;
};

export function NumericInput(props: NumericInputProps): React.ReactElement {
	const { value, onChange, labelName, isFloat, errors, enabled, maxLength } = props;

	const [numberValue, setNumberValue] = React.useState(value === 0 || isUndefined(value) ? "" : value.toString());

	const handeValueChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
		let numberRegex;
		let value;
		if (isFloat) {
			numberRegex = /^(0|[1-9]*)(\.[0-9]{0,2})?$/;
			value = parseFloat(event.target.value);
		} else {
			numberRegex = /^[1-9][0-9]*$/;
			value = parseInt(event.target.value);
		}

		const testInt = numberRegex.test(event.target.value);

		if (event.target.value === "" || (testInt && value >= 0)) {
			setNumberValue(event.target.value);
			onChange(event.target.value === "" ? 0 : value);
		}
	};

	const handleOnBlur = (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
		const value = event.target.value;
		const numberValue = parseFloat(value);
		const trailingZeroesRegex = /^(0|[1-9]*)(\.(00|[1-9]0))?$/;

		if (numberValue === 0) setNumberValue("");
		else if (trailingZeroesRegex.test(value)) {
			const result = value.replace(/.00$|0$/, "");
			setNumberValue(result);
		}
	};

	return (
		<TextField
			label={labelName}
			fullWidth
			disabled={!enabled}
			inputProps={{ maxLength: maxLength }}
			variant="standard"
			value={numberValue}
			onChange={(event) => handeValueChange(event)}
			onBlur={(event) => {
				if (isFloat) handleOnBlur(event);
			}}
			error={errors !== ""}
			helperText={errors !== "" ? errors : ""}
		/>
	);
}
