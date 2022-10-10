/* eslint-disable */
import React, { useState } from "react";
import { JsonForms } from "@jsonforms/react";
import { JsonSchema7, Translator } from "@jsonforms/core";
import { materialCells, materialRenderers } from "@jsonforms/material-renderers";
import { createAjv } from "@jsonforms/core";
import { DataStore } from "../../../../core/DataStore";
import * as Models from "../../../../core/Models";
import { VisualComponent } from "../../../../core/interfaces";
import FileUploader from "../../../../components/fileUploader/FileUploader";
import { FormControl, InputLabel, MenuItem, Select, TextField, Container, Card, CardContent } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

import schema from "../../schema.json";
import uiSchema from "./ui.json";

import "./AdministrativeInfo.scss";

import DiscountsSection from "./DiscountsSection/DiscountsSection";
import PaymentMethodSection from "./PaymentMethodsSection/PaymentMethodSection";

export type AdministrativeInfoProps = {
	editable: boolean;
	student: Models.Student;
	onChange: (data: Models.Student) => void;
	translator?: (id: string, defaultMessage: string) => string;
};

export default function AdministrativeInfo(props: VisualComponent & AdministrativeInfoProps): React.ReactElement {
	const dataStore = DataStore.getInstance();

	const { editable, student, translator, onChange } = props;

	const [enrollmentCommitment, setEnrollmentCommitment] = useState<File | undefined>();
	const [agreementType, setAgreementType] = useState<string | undefined>(undefined);

	const handleDefaultsAjv = createAjv({ useDefaults: true });

	return (
		<Container className="administrative-info" sx={{ display: "flex" }}>
			<Container className="payment-details-wrapper" sx={{ display: "flex" }}>
				<Card className="form-container" color={"primary"} sx={{ overflow: "auto" }}>
					<CardContent>
						<JsonForms
							i18n={{ translate: translator as Translator }}
							schema={schema as JsonSchema7}
							uischema={uiSchema}
							data={student}
							renderers={materialRenderers}
							cells={materialCells}
							onChange={({ data }): void => {
								onChange(data);
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
