import React, { useEffect, useRef, useState } from "react";

import { Student, StudentCreationForm } from "../../../../core/Models";
import { parseFormToStudent } from "../../../../core/Parsers";
import { processXLSXtoJSON } from "../../../../core/CoreHelper";
import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import BLAlert from "../../../../components/BLAlert";
import usePreventDragEventsDefaults from "../../../../hooks/usePreventDragEventsDefaults";

import "./CreateStudent.scss";

const acceptedExtensions = [".xlsx", ".csv", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"];

interface CreateStudentProps {
	studentProp: Student;
	onUpload: (newStudent: Student) => void;
}

function CreateStudent(props: CreateStudentProps): JSX.Element {
	const { studentProp, onUpload } = props;

	const [readyToNavigate, setReadyToNavigate] = useState(false);
	const [fileOver, setFileOver] = useState(false);
	const [fileName, setFileName] = useState("");
	const [student, setStudent] = useState<Student>(studentProp);
	const [error, setError] = useState<string | null>(null);
	const [loadingFile, setLoadingFile] = useState(false);

	const fileInputRef = useRef(null);

	usePreventDragEventsDefaults();

	useEffect(() => setReadyToNavigate(fileName !== ""), [fileName]);

	useEffect(() => {
		if (error) window.setTimeout(() => setError(null), 3000);
	}, [error]);

	async function processFile(file: File | undefined): Promise<void> {
		if (!file) {
			setError("Error al cargar el archivo.");
			return;
		}

		if (acceptedExtensions.includes(file.type)) {
			const processedForm = await processXLSXtoJSON<StudentCreationForm>(file);

			const parsedForm = parseFormToStudent(processedForm[0], student);

			if (!parsedForm) {
				setError("El formato del excel subido no es correcto");
			} else {
				setStudent(parsedForm);
				setFileName(file.name);
			}
		} else setError("Extensión del archivo subido no es soportada");
	}

	async function handleOnClickUpload(event: React.ChangeEvent<HTMLInputElement>): Promise<void> {
		event.preventDefault();

		setLoadingFile(true);

		const file = event.target.files?.[0];

		await processFile(file);

		setLoadingFile(false);
	}

	async function handleOnDropUpload(event: React.DragEvent<HTMLDivElement>): Promise<void> {
		event.preventDefault();
		event.stopPropagation();

		setLoadingFile(true);

		const file = event?.dataTransfer.files?.[0];

		await processFile(file);

		setLoadingFile(false);

		setFileOver(false);
	}

	function handleCreate(): void {
		student && onUpload(student);
	}

	return (
		<Grid className="create-student" container alignContent="center" justifyContent="center" width="500px" height="200px">
			<Box sx={{ display: "flex", textAlign: "center" }} flexDirection="column" justifyContent="space-evenly" width="100%" height="100%">
				<Card
					id="file-drop-zone"
					onDrop={handleOnDropUpload}
					onClick={(): void => {
						// eslint-disable-next-line @typescript-eslint/ban-ts-comment
						// @ts-ignore
						fileInputRef.current.click();
					}}
					onDragEnter={(): void => setFileOver(true)}
					onDragExit={(): void => setFileOver(false)}
					style={{ width: "100%" }} //
				>
					<CardContent className={`file-drop-zone ${fileOver ? "file-drop-zone--file-over" : ""}`}>
						<input
							id="file-input"
							type="file"
							ref={fileInputRef}
							onChange={handleOnClickUpload}
							style={{ display: "none" }}
							accept={acceptedExtensions.join(",")}
						/>

						<Typography component={"span"}>
							{!fileOver ? "Arrastre el archivo Excel del alumno aquí o haga click." : "Suelte el archivo."}
						</Typography>
					</CardContent>
				</Card>

				<Typography component={"span"} id="uploaded-file-name">
					{fileName !== "" ? `Archivo subido: ${fileName}` : ""}
				</Typography>

				<LoadingButton id="create-student-button" variant="outlined" loading={loadingFile} disabled={!readyToNavigate} onClick={handleCreate}>
					Crear Alumno
				</LoadingButton>
			</Box>

			<BLAlert id="create-student-alert-error" error={error} />
		</Grid>
	);
}

export default CreateStudent;
