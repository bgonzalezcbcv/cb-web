import React from "react";

import { Alert, Button, Dialog, DialogActions, DialogContent } from "@mui/material";

interface ChangePasswordDialogProps {
	success: boolean;
	show: boolean;
	setOpen: () => void;
}

export function ChangePasswordDialog(params: ChangePasswordDialogProps): React.ReactElement {
	const { success, show, setOpen } = params;

	return (
		<Dialog open={show} onClose={(): void => setOpen()}>
			<DialogContent>
				{success ? (
					<Alert severity="success">Contraseña cambiada correctamente.</Alert>
				) : (
					<Alert severity="error">No se ha podido cambiar la contraseña. Inténtelo de nuevo.</Alert>
				)}
			</DialogContent>
			<DialogActions sx={{ display: "flex", justifyContent: "space-around" }}>
				<Button variant="outlined" onClick={(): void => setOpen()}>
					Aceptar
				</Button>
			</DialogActions>
		</Dialog>
	);
}
