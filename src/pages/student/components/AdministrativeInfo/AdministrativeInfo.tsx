/* eslint-disable */
import React, { useCallback, useState, useEffect } from "react";
import _ from "lodash";
import { JsonForms } from "@jsonforms/react";
import { JsonSchema7 } from "@jsonforms/core";
import { materialCells, materialRenderers } from "@jsonforms/material-renderers";
import { createAjv } from "@jsonforms/core";
import schema from "./schema.json";
import uiSchema from "./ui.json";
import { DataStore } from "../../../../core/DataStore";
import * as Models from "../../../../core/Models";
import { VisualComponent } from "../../../../core/interfaces";
import FileUploader from "../../../../components/fileUploader/FileUploader";
import { Card, CardContent, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";

import DownloadIcon from "@mui/icons-material/Download";

import "./AdministrativeInfo.scss";

import DiscountSection from "./DiscountsSection/DiscountSection";
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
		<div>
			<Card
				className="administrative-info"
				sx={{
					width: width ?? "100%",
					height: height ?? "100%",
				}}>
				<CardContent className="form-container">
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

					<FormControl variant="standard" sx={{ width: "100%" }}>
						<InputLabel id="agreement-type-label">Convenio</InputLabel>

						<Select
							labelId="agreement-type"
							id="agreement-type"
							label="Convenio"
							value={agreementType}
							onChange={(event) => setAgreementType(event.target.value)}>
							{dataStore.agreementTypes &&
								dataStore.agreementTypes?.map((value, index) => {
									return (
										<MenuItem key={index} value={value}>
											{value}
										</MenuItem>
									);
								})}
						</Select>
					</FormControl>

					{editable ? (
						<FileUploader label={"Compromiso de inscripción"} width={"100%"} uploadedFile={(file) => setEnrollmentCommitment(file)} />
					) : (
						<div className="document-download-container">
							<div className="document-download">Compromiso de inscripción</div>
							{/*TODO: Add handle to download file*/}
							<DownloadIcon />
						</div>
					)}

					<TextField
						sx={{ width: "100%", marginTop: 1 }}
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
				</CardContent>

				<div className={"payment-details-wrapper"}>
					<DiscountSection editable={editable} student={student} onChange={onChange}></DiscountSection>

					<PaymentMethodSection editable={editable} student={student} onChange={onChange}></PaymentMethodSection>
				</div>
			</Card>
		</div>
	);
}
