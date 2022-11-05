import * as React from "react";

import { calculateReferenceNumber } from "../../../../core/CoreHelper";
import { Student } from "../../../../core/Models";
import { Alert, AlertTitle, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";

export default function StudentActivationModal(props: {
	open: boolean;
	onClose: () => void;
	onAccept: (tuitionNumber: number) => void;
	studentProp: Student;
}): React.ReactElement {
	const [referenceNumber, setReferenceNumber] = useState("");
	const [calculatedReferenceNumber, setCalculatedReferenceNumber] = useState("");
	const [tuitionNumber, setTuitionNumber] = useState("");
	const [showAlert, setShowAlert] = useState(false);

	const handleActivation = () => {
		// Llamar api call y mostrar success o error
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
						id="tuition-number"
						label="Número de matricula"
						variant="standard"
						sx={{ marginBottom: "10px" }}
						onChange={(e) => setTuitionNumber(e.target.value)}
					/>

					<Typography variant="body1">El numero de referencia asignado será:</Typography>

					<TextField
						value={referenceNumber}
						id="reference-number"
						label="Número de de referencia"
						variant="standard"
						onChange={(e) => setReferenceNumber(e.target.value)}
					/>

					{showAlert ? (
						<Alert
							severity="warning"
							action={
								<Button color="inherit" size="small" onClick={() => setShowAlert(false)}>
									Se lo que hago
								</Button>
							}>
							<AlertTitle>Warning</AlertTitle>
							Has cambiado el número de referencia
						</Alert>
					) : (
						""
					)}
				</Box>
			</DialogContent>

			<DialogActions>
				<Button onClick={props.onClose}>Cancel</Button>
				<Button disabled={showAlert} onClick={handleActivation}>
					Activar
				</Button>
			</DialogActions>
		</Dialog>
	);
}
