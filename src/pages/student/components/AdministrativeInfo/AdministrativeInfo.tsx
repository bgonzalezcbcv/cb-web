/* eslint-disable */
import _ from "lodash";
import React, { useState } from "react";

import { JsonForms } from "@jsonforms/react";
import { JsonSchema7, Translator } from "@jsonforms/core";
import { materialCells, materialRenderers } from "@jsonforms/material-renderers";
import { createAjv } from "@jsonforms/core";
import { FormControl, InputLabel, MenuItem, Select, TextField, Container, Card, CardContent } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { DataStore } from "../../../../core/DataStore";
import * as Models from "../../../../core/Models";
import { VisualComponent } from "../../../../core/interfaces";
import FileUploader from "../../../../components/fileUploader/FileUploader";
import DiscountsSection from "./DiscountsSection/DiscountsSection";
import PaymentMethodSection from "./PaymentMethodsSection/PaymentMethodSection";
import DatePickerToString from "../../../../components/datePicker/DatePicker";
import NumericInputControl, { NumericInputControlTester } from "../../../../components/NumericInput/NumericInputControl";

import schema from "../../schema.json";
import uiSchema from "./ui.json";

import "./AdministrativeInfo.scss";

export type AdministrativeInfoProps = {
	editable: boolean;
	student: Models.Student;
	onChange: (data: Models.Student, debounce?: boolean) => void;
	translator?: (id: string, defaultMessage: string) => string;
	setWarnings: (message: string[]) => void;
};

const renderers = [...materialRenderers, { tester: NumericInputControlTester, renderer: NumericInputControl }];

export default function AdministrativeInfo(props: VisualComponent & AdministrativeInfoProps): React.ReactElement {
	const dataStore = DataStore.getInstance();

	const { editable, student, translator, onChange, setWarnings } = props;

	const [enrollmentCommitment, setEnrollmentCommitment] = useState<File | undefined>();
	const [agreementType, setAgreementType] = useState<string | undefined>(undefined);
	const [warnings, setWarningMessages] = useState<string[]>(["", ""]);

	const handleDefaultsAjv = createAjv({ useDefaults: true });

	function GenerateWarnings(warnings: string[]): string[] {
		if (!warnings[0] && !warnings[1]) return [];
		return [
			"Información Administrativa \n",
			warnings[0] ? "Fecha de inscripción: " + warnings[0] : "",
			warnings[1] ? "Fecha de comienzo: " + warnings[1] : "",
		];
	}

	function SetWarningMessage(index: number, message: string): void {
		const newWarnings = warnings.slice();
		newWarnings[index] = message;
		setWarningMessages(newWarnings);
		setWarnings(GenerateWarnings(newWarnings));
	}

	return (
		<Container className="administrative-info" sx={{ display: "flex" }}>
			<Container className="payment-details-wrapper" sx={{ display: "flex" }}>
				<Card className="form-container" color={"primary"} sx={{ overflow: "auto" }}>
					<CardContent>
						<DatePickerToString
							editable={editable}
							date={student.administrative_info.enrollment_date}
							onChange={(date: string, errorMessage: string) => {
								const newStudent = { ...student, administrative_info: { ...student.administrative_info, enrollment_date: date } };
								console.log("Changed!");
								onChange(newStudent);
								SetWarningMessage(0, errorMessage);
							}}
							label="Fecha de inscripción"
						/>
						<DatePickerToString
							editable={editable}
							date={student.administrative_info.starting_date}
							onChange={(date: string, errorMessage: string) => {
								const newStudent = { ...student, administrative_info: { ...student.administrative_info, starting_date: date } };
								onChange(newStudent);
								SetWarningMessage(1, errorMessage);
							}}
							label="Fecha de comienzo"
						/>
						<JsonForms
							i18n={{ translate: translator as Translator }}
							schema={schema as JsonSchema7}
							uischema={uiSchema}
							data={student}
							renderers={renderers}
							cells={materialCells}
							onChange={({ data }): void => {
								onChange(data, false);
							}}
							readonly={!editable}
							ajv={handleDefaultsAjv}
						/>
						{student.administrative_info.scholarship_type == Models.ScholarshipType.Agreement ||
						student.administrative_info.scholarship_type == Models.ScholarshipType.Bidding.valueOf() ? (
							<FormControl variant="standard" sx={{ width: "100%" }}>
								<InputLabel id="agreement-type-label">Convenio</InputLabel>

								<Select
									labelId="agreement-type"
									id="agreement-type"
									label="Convenio"
									value={agreementType}
									disabled={!editable}
									onChange={(event) => setAgreementType(event.target.value)}>
									{dataStore.agreementTypes &&
										dataStore.agreementTypes.map((value, index) => {
											return (
												<MenuItem key={index} value={value}>
													{value}
												</MenuItem>
											);
										})}
								</Select>
							</FormControl>
						) : null}

						{editable ? (
							<div className="file-uploader-container">
								<FileUploader label={"Compromiso de inscripción"} width={"100%"} uploadedFile={(file) => setEnrollmentCommitment(file)} />
							</div>
						) : (
							<div className="document-download-container">
								<div className="document-download">Compromiso de inscripción</div>
								{/*TODO: Add handle to download file*/}
								<DownloadIcon />
							</div>
						)}
					</CardContent>
				</Card>

				<Container className={"payment-details-wrapper"} style={{ paddingRight: "0px" }}>
					<PaymentMethodSection editable={editable} student={student} onChange={onChange} />
				</Container>
			</Container>
			<Container className={"payment-details-wrapper"} sx={{ display: "flex" }}>
				<Card sx={{ display: "flex", width: "100%" }}>
					<CardContent sx={{ display: "flex", width: "100%" }}>
						<TextField
							className="comments"
							label={"Comentarios"}
							value={student.administrative_info.comments}
							multiline
							rows={3}
							variant="standard"
							disabled={!editable}
							onChange={(event) => {
								const newStudent = { ...student, administrative_info: { ...student.administrative_info, comments: event.target.value } };
								onChange(newStudent);
							}}
						/>
					</CardContent>
				</Card>
			</Container>
			<Container className={"payment-details-wrapper"} sx={{ display: "flex" }}>
				<DiscountsSection editable={editable} student={student} onChange={onChange} />
			</Container>
		</Container>
	);
}
