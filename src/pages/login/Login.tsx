import React, { useEffect, useState } from "react";
import { AjvError } from "@rjsf/core";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";

import { VisualComponent } from "../../core/interfaces";
import { DataStore } from "../../core/DataStore";
import { useIsMounted } from "../../hooks/useIsMounted";
import MuiForm from "@rjsf/material-ui/v5";
import { Alert, Button, Card, CardContent, Grid } from "@mui/material";

import schema from "./login-schema.json";
import ui from "./login-ui.json";

function Login(props: VisualComponent): JSX.Element {
	const { width, height } = props;

	const [errorAlert, setErrorAlert] = useState<string | undefined>(undefined);

	const [isMounted] = useIsMounted();

	const dataStore = DataStore.getInstance();

	const navigate = useNavigate();

	useEffect(() => {
		dataStore.loggedUser && navigate("/");
	}, [dataStore.loggedUser, navigate]);

	function onSubmit(): void {
		if (!dataStore.logIn()) {
			setErrorAlert("Hubo un error al iniciar sesión. Intente de nuevo.");
			setTimeout(() => setErrorAlert(undefined), 2000);
		}
	}

	function transformErrors(errors: AjvError[]): AjvError[] {
		return errors.map((error) => {
			if (error.property === ".email") {
				error.message = "Ingrese un email correcto";
			}

			return error;
		});
	}

	if (!isMounted) return <></>;

	return (
		<Grid container alignContent="center" justifyContent="center" height="100%" style={{ background: "#8ea8d9" }}>
			<Grid item height="fitcontent">
				<Card
					className="create-teachers"
					sx={{
						width: width ?? "100%",
						height: height ?? "100%",
						overflowY: "auto",
					}}>
					<CardContent>
						<h1>Iniciar Sesión</h1>

						<MuiForm
							className="create-teachers__form"
							schema={schema as Record<string, unknown>}
							uiSchema={ui}
							onSubmit={onSubmit}
							onError={(error): void => console.log(error)}
							transformErrors={transformErrors}
							showErrorList={false}>
							<Button id="login-submit" variant="contained" type="submit">
								Iniciar Sesión!
							</Button>
						</MuiForm>

						{errorAlert ? (
							<Alert severity="error" onClose={(): void => setErrorAlert(undefined)}>
								{errorAlert}
							</Alert>
						) : null}
					</CardContent>
				</Card>
			</Grid>
		</Grid>
	);
}

export default observer(Login);
