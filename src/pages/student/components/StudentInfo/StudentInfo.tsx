/* eslint-disable */

import React, { useState } from "react";

import { JsonForms } from "@jsonforms/react";
import { JsonSchema7, Translator, ValidationMode } from "@jsonforms/core";
import { materialCells, materialRenderers } from "@jsonforms/material-renderers";
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
	const { editable, student, onChange } = props;

	const translator = (id: string, defaultMessage: string | undefined): string => {
		if (id.includes("ci.error")) return "Se deben ingresar solo los números, sin puntos ni guiones y no puede quedar vacía";
		return defaultMessage ?? "";
	};

	return (
		<JsonForms
			i18n={{ translate: translator as Translator }}
			schema={schema}
			data={student}
			renderers={materialRenderers}
			onChange={({ data, errors }): void => {
				onChange(data);
			}}
			uischema={uischema}
			readonly={!editable}
			cells={materialCells}
		/>
	);
}
