import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { VisualComponent } from "../../core/interfaces";
import { DataStore } from "../../core/DataStore";
import { Alert, Button, Card, CardContent, Grid } from "@mui/material";

import schema from "./login-schema.json";
import ui from "./login-ui.json";
import { materialCells, materialRenderers } from "@jsonforms/material-renderers";
import { JsonForms } from "@jsonforms/react";

function Login(props: VisualComponent): JSX.Element {
	const { width, height } = props;

	const [data, setData] = useState({});

	const [errorAlert, setErrorAlert] = useState<string | undefined>(undefined);

	const dataStore = DataStore.getInstance();

	const navigate = useNavigate();

	function onSubmit(): void {
		if (dataStore.logIn()) navigate("/");
	}

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
							onChange={({data}):void => setData(data)}
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

export default Login;
