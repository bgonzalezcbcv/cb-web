import * as React from "react";
import { createAjv } from "@jsonforms/core";

import { Student } from "../../../../core/Models";
import * as API from "../../../../core/ApiStore";

import { Button, Box, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Typography, Alert } from "@mui/material";

import studentSchema from "../../schema.json";

interface CreateStudentDialogProps {
	student: Student;
}

function CreateStudentDialog(props: CreateStudentDialogProps): React.ReactElement {
	const { student } = props;

	const [isOpen, setIsOpen] = React.useState(false);
	const [studentCreationState, setStudentCreationState] = React.useState<"idle" | "inProcess" | "success" | "fail">("idle");

	const handleStudentCreation = async (): Promise<void> => {
		setStudentCreationState("inProcess");

		const successfulCreation = await API.createStudent(student);

		successfulCreation ? setStudentCreationState("success") : setStudentCreationState("fail");
	};

	const dismiss = (): void => {
		setIsOpen(false);
		setStudentCreationState("idle");
	};

	return (
		<>
			<div>
				<Divider sx={{ marginBottom: "10px" }}></Divider>

				<Box
					display="flex"
					justifyContent="flex-end"
					alignContent="flex-end"
					alignSelf="flex-end"
					onClick={(): void => {
						const ajv = createAjv({ allErrors: true });

						ajv.validate(studentSchema, student);

						ajv.errors && setIsOpen(ajv.errors.length > 0);
					}}>
					<Button variant="outlined">Crear Alumno</Button>
				</Box>
			</div>

			<Dialog open={isOpen} onClose={dismiss}>
				<DialogTitle>
					<Typography component={"span"} variant="h5" fontWeight="bold">
						Hay errores en los campos del alumno...
					</Typography>
				</DialogTitle>

				<DialogContent>
					{studentCreationState === "fail" ? (
						<Alert severity="error">No se pudo crear el alumno. Inténtelo de nuevo o corrija los errores.</Alert>
					) : (
						<Typography component={"span"}>¿Está seguro de querer crear este alumno?</Typography>
					)}
				</DialogContent>

				<DialogActions sx={{ display: "flex", justifyContent: "space-around" }}>
					<Button variant="outlined" onClick={dismiss}>
						Cancelar
					</Button>

					<Button variant="outlined" onClick={handleStudentCreation}>
						{studentCreationState === "fail" ? "Reintentar" : "Aceptar"}
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}

export default CreateStudentDialog;
