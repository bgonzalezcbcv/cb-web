import React, { useState } from "react";

import { JsonForms } from "@jsonforms/react";
import { Translator, ValidationMode } from "@jsonforms/core";
import { materialRenderers } from "@jsonforms/material-renderers";
import { Student } from "../../core/Models";
import { defaultStudent } from "../student/DefaultStudent";

import { Button } from "@mui/material";

import "./StudentInfo.scss";

import schema from "./schema.json";
import uischema from "./ui.json";

export type StudentInfoProps = {
	student: Student;
	onChange: (data: Student) => void;
	editable: boolean;
};

export default function StudentInfo(props: StudentInfoProps): React.ReactElement {
	const { editable } = props;

	const style = {
		margin: "20px",
	};

	const translator = (id: string, defaultMessage: string | undefined): string => {
		if (id.includes("ci.error")) return "Se deben ingresar solo los números, sin puntos ni guiones y no puede quedar vacía";
		return defaultMessage ?? "";
	};

	const [data, setData] = useState(defaultStudent);
	const [aux, setAux] = useState(defaultStudent);
	const [errors, setErrors] = useState<unknown[]>([]);
	const [validationMode, setValidationMode] = useState<ValidationMode>("ValidateAndHide");

	function saveOnClick(): void {
		setValidationMode("ValidateAndShow");

		if (errors.length > 0) return;

		setAux(data);
	}

	function cancelOnClick(): void {
		setData(aux);
	}
	return (
		<div>
			<div className="ImageSim"></div>
			<JsonForms
				i18n={{ translate: translator as Translator }}
				schema={schema}
				data={data}
				renderers={materialRenderers}
				onChange={({ data, errors }): void => {
					setErrors(errors ?? []);
					setData(data);
				}}
				uischema={uischema}
				readonly={editable}
				validationMode={validationMode}
			/>
			{editable ? (
				<div className="ButtonContainer">
					<Button id="saveButton" style={style} className="Button" variant="contained" onClick={saveOnClick}>
						Guardar
					</Button>
					<Button id="cancelButton" style={style} className="Button" variant="outlined" onClick={cancelOnClick}>
						Cancelar
					</Button>
				</div>
			) : null}
		</div>
	);
}
