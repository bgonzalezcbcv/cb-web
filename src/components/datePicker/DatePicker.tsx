import React, { useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/es";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers";
import { TextField } from "@mui/material";

dayjs.locale("es");

function dateToString(date: Date): string {
	try {
		const year = new Intl.DateTimeFormat("en", { year: "numeric" }).format(date);
		const month = new Intl.DateTimeFormat("en", { month: "2-digit" }).format(date);
		const day = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(date);
		return `${day}-${month}-${year}`;
	} catch {
		return "";
	}
}

function stringToDateString(stringDate: string | undefined): string | undefined | null {
	if (!stringDate || !/^(\d{2}-){2}\d{4}$/gm.test(stringDate)) return null;
	const aux = stringDate.split("-");
	return new Date(parseInt(aux[2]), parseInt(aux[1]) - 1, parseInt(aux[0])).toString();
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

	const validDateError = "Debe ser una fecha válida.";

	function AssignDate(newValue: string | null | undefined, errorMessage: string): void {
		let stringDate = "";
		if (newValue) {
			const date = new Date(newValue);
			stringDate = dateToString(date);
		}
		setErrorMessage(errorMessage);
		onChange(stringDate, errorMessage);
	}

	return (
		<LocalizationProvider dateAdapter={AdapterDayjs}>
			<DatePicker
				readOnly={!editable}
				label={label}
				value={pickerDate}
				onAccept={(newValue): void => {
					setPickerDate(newValue);
					AssignDate(newValue, "");
				}}
				onChange={(newValue): void => {
					setPickerDate(newValue);
					let error = errorMessage;
					if (!newValue && required) {
						error = validDateError;
					}
					if (errorMessage == "") {
						AssignDate(newValue, error);
					} else {
						AssignDate(null, error);
					}
				}}
				onError={(reason, newValue): void => {
					setPickerDate(newValue);
					let dateToSet = newValue;
					let error = newValue;
					switch (reason) {
						case "invalidDate":
							error = validDateError;
							dateToSet = null;
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
							dateToSet = null;
							break;
					}
					AssignDate(dateToSet, error);
				}}
				renderInput={(params): React.ReactElement => (
					<TextField
						{...params}
						variant="standard"
						helperText={errorMessage}
						required={required}
						error={errorMessage != ""}
						sx={{ display: "flex", width: width ? width : "100%" }}
					/>
				)}
			/>
		</LocalizationProvider>
	);
}