import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Student } from "../../../../core/Models";
import * as API from "../../../../core/ApiStore";
import { ajv as studentAjv, getAjvErrors, getParsedErrors } from "../../../../core/AJVHelper";
import { StudentPageMode } from "../../../../core/interfaces";

import { Alert, AlertTitle, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, List, ListItem, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import ErrorList from "../../../../components/ErrorList/ErrorList";

import studentSchema from "../../schema.json";

interface CreateStudentDialogProps {
	student: Student;
	mode?: StudentPageMode;
	warnings?: string[];
}

function CreateStudentDialog(props: CreateStudentDialogProps): React.ReactElement {
	const { student, mode: modeProps, warnings } = props;
	const mode = modeProps ?? StudentPageMode.create;

	const [isOpen, setIsOpen] = React.useState(false);
	const [studentCreationState, setStudentCreationState] = React.useState<"idle" | "inProcess" | "success" | "fail">("idle");
	const [errors, setErrors] = useState({});
	const [newStudentId, setNewStudentId] = useState<string>();

	const navigate = useNavigate();

	const handleStudentCreation = useCallback(async (): Promise<void> => {
		setStudentCreationState("inProcess");

		const { success, data } = await API.createStudent(student);

		if (success) {
			setStudentCreationState("success");
			setNewStudentId(data?.id);
		} else {
			setStudentCreationState("fail");
			setIsOpen(true);
		}
	}, [student]);

	const dismiss = (): void => {
		setIsOpen(false);
		setStudentCreationState("idle");
	};

	const dismissCreation = (): void => {
		setIsOpen(false);
		setStudentCreationState("idle");
		mode === StudentPageMode.create ? navigate(`/student/${newStudentId}/edit`) : navigate(`/student/${student.id}/edit`);
	};

	const handleStudentEdition = async (): Promise<void> => {
		setStudentCreationState("inProcess");

		const { success } = await API.editStudent(student);

		if (success) {
			setStudentCreationState("success");
		} else {
			setStudentCreationState("fail");
			setIsOpen(true);
		}
	};

	const onCreateClickHandler = (): void => {
		studentAjv.validate(studentSchema, student);

		const errors = getAjvErrors(studentAjv);

		if (errors && errors.length > 0) {
			setIsOpen(true);
			setErrors(getParsedErrors(studentAjv));
		} else {
			if (mode === StudentPageMode.create) handleStudentCreation();
			else handleStudentEdition();
		}
	};

	return (
		<>
			<Box>
				<Divider sx={{ marginBottom: "10px" }}></Divider>

				<Box display="flex" justifyContent="flex-end" alignContent="flex-end" alignSelf="flex-end" onClick={onCreateClickHandler}>
					<Button color={"secondary"} variant="outlined" data-cy="createStudentButton">
						{mode === StudentPageMode.create && "Crear Alumno"}
						{mode === StudentPageMode.edit && "Guardar"}
					</Button>
				</Box>
			</Box>

			{isOpen ? (
				<Dialog open={isOpen} onClose={dismiss} data-cy="errorAlertDialog">
					<DialogTitle>
						<Typography component={"span"} variant="h5" fontWeight="bold">
							Hay errores en los campos del alumno...
						</Typography>
					</DialogTitle>

					<DialogContent>
						{studentCreationState === "fail" ? (
							<Alert severity="error" data-cy="errorAlertTitle">
								{mode === StudentPageMode.create && "No se pudo crear el alumno. Inténtelo de nuevo o corrija los errores."}
								{mode === StudentPageMode.edit && "No se pudo editar el alumno. Inténtelo de nuevo o corrija los errores."}
							</Alert>
						) : (
							<Typography component={"span"}>
								{mode === StudentPageMode.create && "¿Está seguro de querer crear este alumno?"}
								{mode === StudentPageMode.edit && "¿Está seguro de querer editar este alumno?"}
							</Typography>
						)}

						<Box height="400px" overflow="auto" paddingTop="12px">
							<ErrorList name="Errores" path="" value={errors} schema={studentSchema} />
							{warnings ? (
								warnings.length > 0 ? (
									<Alert variant="outlined" severity="warning">
										<AlertTitle>{warnings[0]}</AlertTitle>
										<List>
											{warnings.map((text, messageIndex) =>
												messageIndex == 0 || !text ? null : <ListItem key={messageIndex}>{text}</ListItem>
											)}
										</List>
									</Alert>
								) : null
							) : null}
						</Box>
					</DialogContent>

					<DialogActions sx={{ display: "flex", justifyContent: "space-around" }}>
						<LoadingButton color={"error"} variant="outlined" onClick={dismiss} loading={studentCreationState === "inProcess"}>
							Cancelar
						</LoadingButton>

						<LoadingButton
							color={"success"}
							variant="outlined"
							onClick={mode === StudentPageMode.create ? handleStudentCreation : handleStudentEdition}
							loading={studentCreationState === "inProcess"}
							data-cy="confirmCreateStudent">
							{studentCreationState === "fail" ? "Reintentar" : "Aceptar"}
						</LoadingButton>
					</DialogActions>
				</Dialog>
			) : null}

			{studentCreationState === "success" ? (
				<Dialog open={studentCreationState === "success"} onClose={dismissCreation}>
					<DialogTitle data-cy="successAlertTitle">
						{mode === StudentPageMode.create ? "¡Estudiante creado correctamente!" : "¡Estudiante editado correctamente!"}
					</DialogTitle>

					<DialogActions>
						<Button variant="outlined" onClick={dismissCreation}>
							Aceptar
						</Button>
					</DialogActions>
				</Dialog>
			) : null}
		</>
	);
}

export default CreateStudentDialog;
