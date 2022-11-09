import React, { useCallback } from "react";

import { JsonForms } from "@jsonforms/react";
import { Box, Card, CardContent, Divider, Link, Typography } from "@mui/material";
import { JsonSchema7, Translator } from "@jsonforms/core";
import { materialCells, materialRenderers } from "@jsonforms/material-renderers";
import DownloadIcon from "@mui/icons-material/Download";

import { Student } from "../../../../../core/Models";
import { ajv } from "../../../../../core/AJVHelper";
import FileUploader from "../../../../../components/fileUploader/FileUploader";
import NumericInputControl, { NumericInputControlTester } from "../../../../../components/NumericInput/NumericInputControl";

import schema from "../../../schema.json";
import uiSchema from "../ui.json";

interface EnrollmentSectionProps {
	editable: boolean;
	student: Student;
	onChange: (newStudent: Student, debounce?: boolean) => void;
	setWarnings: (message: string[]) => void;
	translator?: (id: string, defaultMessage: string) => string;
}

const renderers = [...materialRenderers, { tester: NumericInputControlTester, renderer: NumericInputControl }];

function EnrollmentSection(props: EnrollmentSectionProps): JSX.Element {
	const { editable, student, onChange, translator } = props;

	const handleSetRegistrationCommitment = useCallback(
		(newRegistrationCommitment: File): void => {
			const newStudent = { ...student, administrative_info: { ...student.administrative_info, enrollment_commitment: newRegistrationCommitment } };

			onChange(newStudent);
		},
		[student, onChange]
	);

	return (
		<Card color={"primary"} sx={{ height: "100%" }}>
			<CardContent sx={{ display: "flex", flexDirection: "column", height: "100%", gap: "6px" }}>
				<JsonForms
					i18n={{ translate: translator as Translator }}
					schema={schema.properties.administrative_info as JsonSchema7}
					uischema={uiSchema}
					data={student.administrative_info ?? ""}
					renderers={renderers}
					cells={materialCells}
					onChange={({ data }): void => {
						onChange({ ...student, administrative_info: data });
					}}
					readonly={!editable}
					ajv={ajv}
				/>

				<Divider />

				{editable ? (
					<Box>
						<FileUploader label={"Compromiso de inscripción"} width={"95%"} uploadedFile={handleSetRegistrationCommitment} />
					</Box>
				) : null}

				{student.administrative_info.enrollment_commitment_url ? (
					<Box display="flex" flexDirection="row" alignContent="center" justifyContent="space-between">
						<Typography variant="body1">Compromiso de inscripción link: </Typography>

						<Link href={student.administrative_info.enrollment_commitment_url} target="_blank">
							<DownloadIcon />
						</Link>
					</Box>
				) : null}
			</CardContent>
		</Card>
	);
}

export default EnrollmentSection;
