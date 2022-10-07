import React from "react";

import { JsonForms } from "@jsonforms/react";
import { materialCells, materialRenderers } from "@jsonforms/material-renderers";
import {Translator} from "@jsonforms/core";
import { Student } from "../../../../core/Models";

import { ajv as studentAjv } from "../../../../core/AJVHelper";

import uischema from "./ui.json";
import schema from "../../schema.json";

import "./StudentInfo.scss";

export type StudentInfoProps = {
	student: Student;
	onChange: (data: Student) => void;
	editable: boolean;
};

export default function StudentInfo(props: StudentInfoProps): React.ReactElement {
	const { editable, student, onChange } = props;

	const translator = (id: string, defaultMessage: string): string => {
		if (id.includes("required")) return "Campo requerido";
		else return defaultMessage;
	};

	return (
		<div style={{ paddingTop: "30px" }}>
			<JsonForms
				i18n={{ translate: translator as Translator }}
				ajv={studentAjv}
				schema={schema}
				uischema={uischema}
				data={student}
				renderers={materialRenderers}
				onChange={({ data }): void => {
					onChange(data);
				}}
				readonly={!editable}
				cells={materialCells}
			/>
		</div>
	);
}
