import React from "react";

import { Alert, Button, Dialog, DialogActions, DialogContent } from "@mui/material";

interface DeleteReportCardDialogProps {
	show: boolean;
	setOpen: (isOpen: boolean, shouldDelete: boolean) => void;
}

interface ReportDeletionSuccessDialogProps {
	success: boolean;
	show: boolean;
	setOpen: (isOpen: boolean) => void;
}

export function DeleteReportCardDialog(props: DeleteReportCardDialogProps): React.ReactElement {
	const { show, setOpen } = props;

	return (
		<Dialog open={show} onClose={(): void => setOpen(false, false)}>
			<DialogContent>
				<Alert severity="warning">¿Desea eliminar este boletin?</Alert>
			</DialogContent>
			<DialogActions sx={{ display: "flex", justifyContent: "space-around" }}>
				<Button variant="outlined" onClick={(): void => setOpen(false, true)}>
					SI
				</Button>
				<Button variant="outlined" onClick={(): void => setOpen(false, false)}>
					NO
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export function ReportDeletionSuccessDialog(params: ReportDeletionSuccessDialogProps): React.ReactElement {
	const { success, show, setOpen } = params;

	return (
		<Dialog open={show} onClose={(): void => setOpen(false)}>
			<DialogContent>
				{success ? (
					<Alert severity="success">Boletín eliminado correctamente.</Alert>
				) : (
					<Alert severity="error">No se pudo eliminar el boletín. Inténtelo de nuevo.</Alert>
				)}
			</DialogContent>
			<DialogActions sx={{ display: "flex", justifyContent: "space-around" }}>
				<Button variant="outlined" onClick={(): void => setOpen(false)}>
					Aceptar
				</Button>
			</DialogActions>
		</Dialog>
	);
}
