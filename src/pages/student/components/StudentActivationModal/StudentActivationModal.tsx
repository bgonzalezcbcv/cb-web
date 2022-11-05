import * as React from "react";

import { calculateReferenceNumber } from "../../../../core/CoreHelper";
import { Student } from "../../../../core/Models";
import { Alert, AlertTitle, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { activateStudent } from "../../../../core/ApiStore";

export default function StudentActivationModal(props: {
	open: boolean;
	onClose: () => void;
	onAccept: (updatedStudent: Student) => void;
	studentProp: Student;
}): React.ReactElement {
	const [referenceNumber, setReferenceNumber] = useState("");
	const [calculatedReferenceNumber, setCalculatedReferenceNumber] = useState("");
	const [tuitionNumber, setTuitionNumber] = useState("");
	const [showAlert, setShowAlert] = useState(false);
	const [showFailureMessage, setShowFailureMessage] = useState(false);

	const handleActivation = async () => {
		const student = await activateStudent(props.studentProp.id);

		student.success && student.data && props.onAccept(student.data);

		setShowFailureMessage(true);
	};

	useEffect(() => {
		if (tuitionNumber.length === 4) {
			const calculatedNumber = calculateReferenceNumber(tuitionNumber);

			setCalculatedReferenceNumber(calculatedNumber);
			setReferenceNumber(calculatedNumber);
		}
	}, [tuitionNumber]);

	useEffect(() => {
		setShowAlert(referenceNumber !== calculatedReferenceNumber);
	}, [referenceNumber]);

	return (
		<Dialog open={props.open} onClose={props.onClose}>
			<DialogTitle>Activar alumno</DialogTitle>

			<DialogContent>
				<Box sx={{ display: "flex", flexDirection: "column", maxHeight: "300px", width: "500px" }}>
					<TextField
						type="number"
						id="tuition-number"
						label="Número de matricula"
						variant="standard"
						sx={{ marginBottom: "10px" }}
						inputProps={{ inputMode: "numeric", pattern: "[0-9]^4" }}
						onChange={(e) => setTuitionNumber(e.target.value)}
					/>

					<TextField
						type="number"
						value={referenceNumber}
						id="reference-number"
						label="Número de de referencia"
						variant="standard"
						inputProps={{ inputMode: "numeric", pattern: "[0-9]^5" }}
						onChange={(e) => setReferenceNumber(e.target.value)}
					/>

					{showAlert ? (
						<Alert
							severity="warning"
							sx={{ marginTop: "10px" }}
							action={
								<Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
									<Button color="inherit" size="small" onClick={() => setShowAlert(false)}>
										Se lo que hago
									</Button>
									<Button color="inherit" size="small" onClick={() => setReferenceNumber(calculatedReferenceNumber)}>
										Deshacer
									</Button>
								</Box>
							}>
							<AlertTitle>Cuidado</AlertTitle>
							Has cambiado el número de referencia
						</Alert>
					) : (
						""
					)}

					{showFailureMessage ? (
						<Alert
							severity="error"
							sx={{ marginTop: "10px" }}
							action={
								<Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
									<Button color="inherit" size="small" onClick={() => setShowFailureMessage(false)}>
										Volver a intentar
									</Button>
								</Box>
							}>
							<AlertTitle>Error</AlertTitle>
							Algo salió mal
						</Alert>
					) : (
						""
					)}
				</Box>
			</DialogContent>

			<DialogActions>
				<Button onClick={props.onClose}>Cancel</Button>
				<Button disabled={showAlert || showFailureMessage} onClick={handleActivation}>
					Activar
				</Button>
			</DialogActions>
		</Dialog>
	);
}
