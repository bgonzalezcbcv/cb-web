import { isUndefined } from "lodash";
import React, { useEffect } from "react";

import { TextField } from "@mui/material";
import useDebounce from "../../hooks/useDebounce";

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

	const [stringNumericValue, setStringNumericValue] = React.useState(!value ? "" : value.toString());
	const [numberValue, setNumberValue] = React.useState(0);
	const debounceNumberValue = useDebounce<number>(numberValue, 150);

	useEffect(() => {
		onChange(debounceNumberValue);
	}, [debounceNumberValue]);

	const handeValueChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
		let numberRegex;
		let newValue;
		if (isFloat) {
			numberRegex = /^(0|[1-9]*)(\.[0-9]{0,2})?$/;
			newValue = parseFloat(event.target.value);
		} else {
			numberRegex = /^[1-9][0-9]*$/;
			newValue = parseInt(event.target.value);
		}

		const testInt = numberRegex.test(event.target.value);

		if (event.target.value === "" || (testInt && newValue >= 0 && newValue <= Number.MAX_SAFE_INTEGER)) {
			setStringNumericValue(event.target.value);
			setNumberValue(event.target.value === "" ? 0 : newValue);
		}
	};

	const handleOnBlur = (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
		const value = event.target.value;
		const numberValue = parseFloat(value);
		const trailingZeroesRegex = /^(0|[1-9]*)(\.(00|[1-9]0))?$/;

		if (numberValue === 0) setStringNumericValue("");
		else if (trailingZeroesRegex.test(value)) {
			const result = value.replace(/.00$|0$/, "");
			setStringNumericValue(result);
		}
	};

	return (
		<TextField
			label={labelName}
			fullWidth
			disabled={!enabled}
			inputProps={{ maxLength: maxLength }}
			variant="standard"
			value={stringNumericValue}
			onChange={(event): void => handeValueChange(event)}
			onBlur={(event): void => {
				if (isFloat) handleOnBlur(event);
			}}
			error={errors !== ""}
			helperText={errors !== "" ? errors : ""}
		/>
	);
}
