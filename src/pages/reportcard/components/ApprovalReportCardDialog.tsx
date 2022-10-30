import React from "react";

import { Alert, Button, Dialog, DialogActions, DialogContent } from "@mui/material";

interface ApprovalReportCardDialogProps {
	show: boolean;
	setOpen: (isOpen: boolean, approved: boolean) => void;
}

interface ReportApprovalSuccessDialogProps {
	show: boolean;
	setOpen: (isOpen: boolean) => void;
}

export function ApprovalReportCardDialog(props: ApprovalReportCardDialogProps): React.ReactElement {
	const { show, setOpen } = props;

	return (
		<Dialog open={show} onClose={(): void => setOpen(false, false)}>
			<DialogContent>
				<Alert severity="warning">¿Desea aprobar este boletin?</Alert>
			</DialogContent>
			<DialogActions sx={{ display: "flex", justifyContent: "space-around" }}>
				<Button variant="outlined" color="success" onClick={(): void => setOpen(false, true)}>
					Aprobar
				</Button>
				<Button variant="outlined" color="error" onClick={(): void => setOpen(false, false)}>
					Desaprobar
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export function ReportApprovalSuccessDialog(params: ReportApprovalSuccessDialogProps): React.ReactElement {
	const { show, setOpen } = params;

	return (
		<Dialog open={show} onClose={(): void => setOpen(false)}>
			<DialogContent>
				<Alert severity="success">Información enviada correctamente.</Alert>
			</DialogContent>
			<DialogActions sx={{ display: "flex", justifyContent: "space-around" }}>
				<Button variant="outlined" onClick={(): void => setOpen(false)}>
					Aceptar
				</Button>
			</DialogActions>
		</Dialog>
	);
}
