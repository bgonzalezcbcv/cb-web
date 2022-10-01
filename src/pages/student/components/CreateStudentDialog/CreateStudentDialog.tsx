import React, { useCallback, useState } from "react";

import { Student } from "../../../../core/Models";
import * as API from "../../../../core/ApiStore";
import { ajv as studentAjv, getAjvErrors } from "../../../../core/AJVHelper";
import { getParsedErrors } from "../../../../core/AJVHelper";

import { Button, Box, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Typography, Alert } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import ErrorList from "../../../../components/ErrorList/ErrorList";

import studentSchema from "../../schema.json";

interface CreateStudentDialogProps {
	student: Student;
}

function CreateStudentDialog(props: CreateStudentDialogProps): React.ReactElement {
	const { student } = props;

	const [isOpen, setIsOpen] = React.useState(false);
	const [studentCreationState, setStudentCreationState] = React.useState<"idle" | "inProcess" | "success" | "fail">("idle");
	const [errors, setErrors] = useState({});

	const handleStudentCreation = useCallback(async (): Promise<void> => {
		setStudentCreationState("inProcess");

		const successfulCreation = await API.createStudent(student);

		if (successfulCreation) {
			setStudentCreationState("success");
		} else {
			setStudentCreationState("fail");
			setIsOpen(true);
		}
	}, [student]);

	const dismiss = (): void => {
		setIsOpen(false);
		setStudentCreationState("idle");
	};

	const onCreateClickHandler = (): void => {
		studentAjv.validate(studentSchema, student);

		const errors = getAjvErrors(studentAjv);

		if (errors && errors.length > 0) {
			setIsOpen(true);
			setErrors(getParsedErrors(studentAjv));
		} else {
			handleStudentCreation();
		}
	};

	return (
		<>
			<Box>
				<Divider sx={{ marginBottom: "10px" }}></Divider>

				<Box display="flex" justifyContent="flex-end" alignContent="flex-end" alignSelf="flex-end" onClick={onCreateClickHandler}>
					<Button variant="outlined">Crear Alumno</Button>
				</Box>
			</Box>

			{isOpen ? (
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

						<Box height="400px" overflow="auto" paddingTop="12px">
							<ErrorList name="Errores" path="" value={errors} schema={studentSchema} />
						</Box>
					</DialogContent>

					<DialogActions sx={{ display: "flex", justifyContent: "space-around" }}>
						<LoadingButton variant="outlined" onClick={dismiss} loading={studentCreationState === "inProcess"}>
							Cancelar
						</LoadingButton>

						<LoadingButton variant="outlined" onClick={handleStudentCreation} loading={studentCreationState === "inProcess"}>
							{studentCreationState === "fail" ? "Reintentar" : "Aceptar"}
						</LoadingButton>
					</DialogActions>
				</Dialog>
			) : null}

			{studentCreationState === "success" ? (
				<Dialog open={studentCreationState === "success"} onClose={dismiss}>
					<DialogTitle>¡Estudiante creado correctamente!</DialogTitle>

					<DialogActions>
						<Button variant="outlined" onClick={dismiss}>
							Aceptar
						</Button>
					</DialogActions>
				</Dialog>
			) : null}
		</>
	);
}

export default CreateStudentDialog;
