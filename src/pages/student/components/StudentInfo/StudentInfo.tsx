import React from "react";

import { JsonForms } from "@jsonforms/react";
import { materialCells, materialRenderers } from "@jsonforms/material-renderers";
import { Student } from "../../../../core/Models";

import { studentAjv } from "../../StudentErrors";

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

	return (
		<div style={{ paddingTop: "30px" }}>
			<JsonForms
				ajv={studentAjv}
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
