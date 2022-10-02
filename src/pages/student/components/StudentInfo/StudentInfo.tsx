import React from "react";

import { JsonForms } from "@jsonforms/react";
import { materialCells, materialRenderers } from "@jsonforms/material-renderers";
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

	return (
		<div style={{ paddingTop: "30px" }}>
			<JsonForms
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
