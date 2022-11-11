import React, { useState } from "react";

import { JsonForms } from "@jsonforms/react";
import { JsonSchema7, Translator } from "@jsonforms/core";
import { materialCells, materialRenderers } from "@jsonforms/material-renderers";
import Modal from "../../../../components/modal/Modal";
import { Container, Radio, RadioGroup, FormControlLabel, Alert, Typography } from "@mui/material";
import FileUploader from "../../../../components/fileUploader/FileUploader";
import { FinalReportCardRequest, IntermediateReportCardRequest, Student } from "../../../../core/Models";
import { createFinalReportCard, createIntermediateReportCard } from "../../../../core/ApiStore";

import schema from "./schema.json";
import uiSchema from "./ui.json";
import { groupString } from "../../../../core/CoreHelper";

export type CreateReportCardModalProps = {
	show: boolean;
	onClose: () => void;
	student: Student;
};

export default function CreateReportCardModal(props: CreateReportCardModalProps): React.ReactElement {
	const { show, onClose, student } = props;
	const [isFinalReport, setIsFinalReport] = useState<boolean>(false);
	const [startPeriod, setStartPeriod] = useState<string>();
	const [endPeriod, setEndPeriod] = useState<string>();
	const [file, setFile] = useState<File | undefined>();
	const [hasErrors, setHasErrors] = useState<boolean>(false);
	const [hasDateErrors, setHasDateErrors] = useState<boolean>(false);
	const [hasFileErrors, setHasFileErrors] = useState<boolean>(true);
	const [showingResponse, setShowingResponse] = useState<boolean>(false);
	const [response, setResponse] = useState<string>("");
	const [acceptEnabled, setAcceptEnabled] = useState<boolean>(true);

	const translator = (id: string, defaultMessage: string): string => {
		if (id.includes("period") && id.includes("error")) {
			return "Debe ser una fecha válida.";
		}
		if (id.includes("year") && id.includes("error")) {
			return "Debe ser un número de cuatro dígitos.";
		}
		if (id.includes("approbed") && id.includes("error")) {
			return "Este campo es requerido.";
		}
		if (id.includes("required")) return "Este campo es requerido.";
		else return defaultMessage;
	};

	function setReportFile(file: File): void {
		setFile(file);
		setHasFileErrors(false);
		if (!file) setHasFileErrors(true);
	}

	function stringToDateString(stringDate: string | undefined): Date | null {
		if (!stringDate || !/^(\d{2}-)\d{4}$/gm.test(stringDate)) return null;
		const aux = stringDate.split("-");
		return new Date(parseInt(aux[1]), parseInt(aux[0]) - 1);
	}

	async function createReportCard(): Promise<void> {
		if (file === undefined) return;
		if (student.group === null || student.group === undefined) return;
		setShowingResponse(true);
		setResponse("Procesando...");
		setAcceptEnabled(false);
		let response;
		if (isFinalReport) {
			const finalReportCard = {
				group_id: student.group.id,
				student_id: student.id,
				report_card: file,
			} as FinalReportCardRequest;
			setHasErrors(false);
			response = await createFinalReportCard(finalReportCard, student.id);
		} else {
			const intermediateReportCard = {
				group_id: student.group.id,
				starting_month: `01-${startPeriod}`,
				ending_month: `01-${endPeriod}`,
				report_card: file,
			} as IntermediateReportCardRequest;
			setHasErrors(false);
			response = await createIntermediateReportCard(intermediateReportCard, student.id);
		}
		setAcceptEnabled(true);
		if (response.success) {
			setResponse("Boletín creado correctamente");
		} else {
			setHasErrors(true);
			setResponse(response.error);
		}
	}

	function getAcceptButtonText(): string {
		if (showingResponse) {
			if (hasErrors) {
				return "Intentar de nuevo";
			} else {
				return "Agregar otro";
			}
		} else {
			return "Aceptar";
		}
	}

	return (
		<Modal
			show={show}
			title={`Agregar un nuevo boletín para el grupo ${student.group ? groupString(student.group) : ""}`}
			onClose={onClose}
			onAccept={(): void => {
				if (showingResponse) {
					setShowingResponse(false);
					if (!hasErrors) {
						setStartPeriod("");
						setEndPeriod("");
						setFile(undefined);
						setHasFileErrors(true);
					}
					setHasErrors(false);
				} else {
					createReportCard();
				}
			}}
			cancelText={showingResponse ? "Cerrar" : "Cancelar"}
			acceptText={getAcceptButtonText()}
			acceptEnabled={(showingResponse && acceptEnabled) || (!showingResponse && !hasFileErrors && (isFinalReport || (!hasErrors && !hasDateErrors)))}>
			<Container>
				{showingResponse && !hasErrors ? <Typography>{response}</Typography> : null}

				{showingResponse && hasErrors ? <Alert severity="error">{response}</Alert> : null}
				{showingResponse ? null : (
					<RadioGroup
						value={isFinalReport}
						row
						onChange={(event): void => {
							setIsFinalReport(event.target.value == "true");
						}}
						defaultValue={isFinalReport}>
						<FormControlLabel value={true} control={<Radio />} label="Boletín final" />
						<FormControlLabel value={false} control={<Radio />} label="Boletín intermedio" />
					</RadioGroup>
				)}
				{isFinalReport || showingResponse ? null : (
					<JsonForms
						i18n={{ translate: translator as Translator }}
						schema={schema as JsonSchema7}
						uischema={uiSchema}
						data={{ start_period: startPeriod, end_period: endPeriod }}
						renderers={materialRenderers}
						cells={materialCells}
						onChange={({ data, errors }): void => {
							setStartPeriod(data.start_period);
							setEndPeriod(data.end_period);
							setHasErrors(!isFinalReport && errors?.length != 0);

							const startDate = stringToDateString(data.start_period);
							const endDate = stringToDateString(data.end_period);
							if (!startDate || !endDate) return;

							setHasDateErrors(data.start_period && data.end_period && startDate > endDate);
						}}
					/>
				)}
				{showingResponse ? null : (
					<Container style={{ paddingLeft: "0px", paddingRight: "0px", marginTop: "3%" }}>
						<FileUploader label={"Boletin"} width={"100%"} uploadedFile={setReportFile} />
					</Container>
				)}
				{!showingResponse && hasDateErrors && !isFinalReport ? (
					<Alert severity="error" className="alert">
						La fecha de fin debe ser posterior a la fecha de comienzo
					</Alert>
				) : null}
			</Container>
		</Modal>
	);
}
