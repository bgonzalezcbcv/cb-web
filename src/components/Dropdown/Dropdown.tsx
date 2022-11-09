import React, { useId } from "react";

import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

interface DropdownProps<ValueType> {
	id?: string;
	label: string;
	options: { text: string; value: ValueType }[];
	value: ValueType;
	onChange: (newValue: ValueType) => void;
	disabled?: boolean;
}

function Dropdown(props: DropdownProps<string | number | readonly string[] | undefined>): JSX.Element {
	const { id: propsId, label, options, value, onChange, disabled } = props;

	const id = propsId ?? useId();

	return (
		<FormControl fullWidth variant="standard">
			<InputLabel id={`dropdown-label-id-${id}`}>{label}</InputLabel>
			<Select
				id={`dropdown-id-${id}`}
				labelId={`dropdown-label-id-${id}`}
				disabled={disabled ?? false}
				value={value}
				label={label}
				onChange={(event): void => onChange(event.target.value)}>
				{options.map(({ text, value }, index) => (
					<MenuItem key={`dropdown-${id}-item-${index}-${value}`} value={value}>
						{text}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);
}

export default Dropdown;
