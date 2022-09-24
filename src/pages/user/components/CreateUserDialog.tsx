import React from "react";

import {  Button, Dialog, DialogActions, DialogContent, Typography, Alert } from "@mui/material";

interface CreateUserDialogProps {
    success: boolean;
    show: (show: boolean) => void;
}

function CreateUserDialog(props: CreateUserDialogProps): React.ReactElement {
    const {success, show} = props;

    const accept = (): void => {
        show(false);
    }

    return (
        <Dialog open={true} onClose={(): void => show(false)}>
            <DialogContent>
                {success ? (
                    <Typography component={"span"}>¡Usuario creado correctamente!</Typography>
                ) : (
                    <Alert severity="error">No se pudo crear el usuario. Inténtelo de nuevo.</Alert>
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
