import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";

import { JsonForms } from "@jsonforms/react";
import { materialCells, materialRenderers } from "@jsonforms/material-renderers";
import { Alert, Button, Card, CardContent, Grid } from "@mui/material";
import { VisualComponent } from "../../core/interfaces";
import { DataStore } from "../../core/DataStore";
import { useIsMounted } from "../../hooks/useIsMounted";

import schema from "./login-schema.json";
import ui from "./login-ui.json";

function Login(props: VisualComponent): JSX.Element {
	const { width, height } = props;

	const [data, setData] = useState({});

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

						<JsonForms
							schema={schema}
							uischema={ui}
							data={data}
							renderers={materialRenderers}
							cells={materialCells}
							onChange={({ data }): void => setData(data)}
						/>
						<Button variant="contained" onClick={onSubmit}>
							Iniciar Sesión!
						</Button>
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
