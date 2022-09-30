/* eslint-disable */
import React, { useState } from "react";
import { JsonForms } from "@jsonforms/react";
import { JsonSchema7 } from "@jsonforms/core";
import { materialCells, materialRenderers } from "@jsonforms/material-renderers";
import { createAjv } from "@jsonforms/core";
import { DataStore } from "../../../../core/DataStore";
import * as Models from "../../../../core/Models";
import { VisualComponent } from "../../../../core/interfaces";
import FileUploader from "../../../../components/fileUploader/FileUploader";
import { FormControl, InputLabel, MenuItem, Select, TextField, Container } from "@mui/material";
import schema from "../../schema.json";
import uiSchema from "./ui.json";

import DownloadIcon from "@mui/icons-material/Download";

import "./AdministrativeInfo.scss";

import DiscountsSection from "./DiscountsSection/DiscountsSection";
import PaymentMethodSection from "./PaymentMethodsSection/PaymentMethodSection";

export type AdministrativeInfoProps = {
	editable: boolean;
	student: Models.Student;
	onChange: (data: Models.Student) => void;
};

export default function AdministrativeInfo(props: VisualComponent & AdministrativeInfoProps): React.ReactElement {
	const dataStore = DataStore.getInstance();

	const { editable, student, height, width, onChange } = props;

	const [enrollmentCommitment, setEnrollmentCommitment] = useState<File | undefined>();
	const [agreementType, setAgreementType] = useState<string | undefined>(undefined);

	const handleDefaultsAjv = createAjv({ useDefaults: true });

	return (
		<Container className="administrative-info" sx={{ display: "flex" }}>
			<Container className="form-container">
				<JsonForms
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

				<TextField
					className="comments"
					label={"Comentarios"}
					value={student.administrative_info.comments}
					multiline
					rows={4}
					variant="standard"
					disabled={!editable}
					onChange={(event) => {
						const newStudent = { ...student, administrative_info: { ...student.administrative_info, comments: event.target.value } };
						onChange(newStudent);
					}}
				/>
			</Container>

			<Container className={"payment-details-wrapper"}>
				<DiscountsSection editable={editable} student={student} onChange={onChange} />

				<PaymentMethodSection editable={editable} student={student} onChange={onChange} />
			</Container>
		</Container>
	);
}
