import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import "dayjs/locale/es";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers";
import { TextField } from "@mui/material";

import { stringToDateString } from "../../core/CoreHelper";
import useDebounce from "../../hooks/useDebounce";

dayjs.locale("es");

export function dateToString(date: Date): string {
	try {
		const year = new Intl.DateTimeFormat("en", { year: "numeric" }).format(date);
		const month = new Intl.DateTimeFormat("en", { month: "2-digit" }).format(date);
		const day = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(date);
		return `${day}-${month}-${year}`;
	} catch {
		return "";
	}
}

export type DatePickerProps = {
	editable: boolean;
	date: string | undefined;
	onChange: (date: string, errorMessage: string) => void;
	label: string;
	required?: boolean;
	width?: string;
};

export default function DatePickerToString(props: DatePickerProps): React.ReactElement {
	const { editable, date, onChange, label, required, width } = props;

	const [pickerDate, setPickerDate] = useState<string | null | undefined>(stringToDateString(date));
	const [errorMessage, setErrorMessage] = useState<string>("");

	const debouncePickerDate = useDebounce<string | null | undefined>(pickerDate, 50);
	const debounceErrorMessage = useDebounce<string>(errorMessage, 50);

	const validDateError = "Debe ser una fecha válida.";

	function assignDate(newValue: string | null | undefined, errorMessage: string): void {
		let stringDate = "";
		if (newValue) {
			const date = new Date(newValue);
			stringDate = dateToString(date);
		}
		onChange(stringDate, errorMessage);
	}

	useEffect(() => {
		setPickerDate(stringToDateString(date));
	}, [date]);

	useEffect(() => {
		assignDate(debouncePickerDate, debounceErrorMessage);
	}, [debouncePickerDate, debounceErrorMessage]);

	return (
		<LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={"es"}>
			<DatePicker
				readOnly={!editable}
				label={label}
				value={pickerDate}
				onAccept={(newValue): void => {
					setPickerDate(newValue);
					setErrorMessage("");
				}}
				onChange={(newValue): void => {
					setPickerDate(newValue);
					let error = errorMessage;
					if (!newValue && required) {
						error = validDateError;
					}
					if (errorMessage == "") {
						setErrorMessage(error);
					} else {
						setErrorMessage(error);
					}
				}}
				onError={(reason, newValue): void => {
					setPickerDate(newValue);
					let error = newValue;
					switch (reason) {
						case "invalidDate":
							error = validDateError;
							break;
						case null:
							if (!newValue && required) {
								error = validDateError;
							} else {
								error = "";
							}
							break;
						default:
							error = reason;
							break;
					}
					setErrorMessage(error);
				}}
				renderInput={(params): React.ReactElement => (
					<TextField
						{...params}
						variant="standard"
						helperText={errorMessage}
						required={required}
						error={errorMessage != ""}
						disabled={!editable}
						sx={{ display: "flex", width: width ? width : "100%" }}
					/>
				)}
			/>
		</LocalizationProvider>
	);
}
