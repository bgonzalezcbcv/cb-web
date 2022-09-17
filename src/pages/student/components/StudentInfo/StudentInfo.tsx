/* eslint-disable */

import React, { useState } from "react";

import { JsonForms } from "@jsonforms/react";
import { JsonSchema7, Translator, ValidationMode } from "@jsonforms/core";
import { materialRenderers } from "@jsonforms/material-renderers";
import { Student } from "../../../../core/Models";

import { Button } from "@mui/material";

import "./StudentInfo.scss";

import uischema from "./ui.json";
import schema from "../../schema.json";

export type StudentInfoProps = {
	student: Student;
	onChange: (data: Student) => void;
	editable: boolean;
};

export default function StudentInfo(props: StudentInfoProps): React.ReactElement {
	const { editable, student } = props;

	const style = {
		margin: "20px",
	};

	const translator = (id: string, defaultMessage: string | undefined): string => {
		if (id.includes("ci.error")) return "Se deben ingresar solo los números, sin puntos ni guiones y no puede quedar vacía";
		return defaultMessage ?? "";
	};

	const [data, setData] = useState(student);
	const [aux, setAux] = useState(student);
	const [errors, setErrors] = useState<unknown[]>([]);
	const [validationMode, setValidationMode] = useState<ValidationMode>("ValidateAndHide");

	function saveOnClick(): void {
		setValidationMode("ValidateAndShow");

		if (errors.length > 0) return;

		//editable = !editable;
		setAux(data);
	}

	function cancelOnClick(): void {
		//editable = !editable;
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
			{!editable ? (
				<div className="ButtonContainer">
					<Button style={style} className="Button" variant="contained" onClick={saveOnClick}>
						Guardar
					</Button>
					<Button style={style} className="Button" variant="outlined" onClick={cancelOnClick}>
						Cancelar
					</Button>
				</div>
			) : null}
		</div>
	);
}
