import React from "react";

import { Button, Dialog, DialogActions, DialogContent, Typography, Alert } from "@mui/material";
import { DefaultApiResponse } from "../../../core/interfaces";
import { User } from "../../../core/Models";

interface CreateUserDialogProps {
	apiResponse: DefaultApiResponse<User>;
	show: (show: boolean) => void;
}

function CreateUserDialog(props: CreateUserDialogProps): React.ReactElement {
	const { apiResponse, show } = props;

	const accept = (): void => {
		show(false);
	};

	return (
		<Dialog open={true} onClose={(): void => show(false)}>
			<DialogContent>
				{apiResponse && apiResponse.success ? (
					<Typography component={"span"}>¡Usuario creado correctamente!</Typography>
				) : (
					<Alert severity="error">{apiResponse.error} Inténtelo de nuevo.</Alert>
				)}
			</DialogContent>

			<DialogActions sx={{ display: "flex", justifyContent: "space-around" }}>
				<Button variant="outlined" onClick={accept}>
					Aceptar
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default CreateUserDialog;
