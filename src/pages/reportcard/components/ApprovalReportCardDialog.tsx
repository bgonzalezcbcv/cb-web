import React from "react";

import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface ApprovalReportCardDialogProps {
	show: boolean;
	setOpen: (isOpen: boolean, approved: boolean | null) => void;
}

interface ReportApprovalSuccessDialogProps {
	show: boolean;
	setOpen: (isOpen: boolean) => void;
}

export function ApprovalReportCardDialog(props: ApprovalReportCardDialogProps): React.ReactElement {
	const { show, setOpen } = props;

	return (
		<Dialog open={show} onClose={(): void => setOpen(false, null)}>
			<DialogTitle
				sx={{
					display: "flex",
					flexDirection: "column-reverse",
					alignItems: "flex-end",
				}}>
				<IconButton
					aria-label="close"
					onClick={(): void => setOpen(false, null)}
					sx={{
						color: (theme) => theme.palette.grey[500],
					}}>
					<CloseIcon />
				</IconButton>
			</DialogTitle>
			<DialogContent>
				<Alert severity="info">¿Desea aprobar este boletin?</Alert>
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
