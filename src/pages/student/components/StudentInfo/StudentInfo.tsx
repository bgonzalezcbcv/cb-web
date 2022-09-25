import React from "react";

import { JsonForms } from "@jsonforms/react";
import { Translator } from "@jsonforms/core";
import { materialCells, materialRenderers } from "@jsonforms/material-renderers";
import { Student } from "../../../../core/Models";

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
		if (id.includes("ci.error")) return "Ingresar solo números o letras, sin puntos ni guiones y no puede quedar vacía";
		return defaultMessage ?? "";
	};

	return (
		<div style={{ paddingTop: "30px" }}>
			<JsonForms
				i18n={{ translate: translator as Translator }}
				schema={schema}
				data={student}
				renderers={materialRenderers}
				onChange={({ data }): void => {
					onChange(data);
				}}
				uischema={uischema}
				readonly={!editable}
				cells={materialCells}
			/>
		</div>
	);
}
