import React from "react";
import { AjvError, ISubmitEvent } from "@rjsf/core";
import { useNavigate } from "react-router-dom";

import { VisualComponent } from "../../core/interfaces";
import { DataStore } from "../../core/DataStore";
import MuiForm from "@rjsf/material-ui/v5";
import { Button, Card, CardContent, Grid } from "@mui/material";

import schema from "./login-schema.json";
import ui from "./login-ui.json";

function Login(props: VisualComponent): JSX.Element {
	const { width, height } = props;

	const dataStore = DataStore.getInstance();

	const navigate = useNavigate();

	function onSubmit(event: ISubmitEvent<unknown>): void {
		console.log(event);

		if (dataStore.logIn()) navigate("/");
	}

	function transformErrors(errors: AjvError[]): AjvError[] {
		return errors.map((error) => {
			if (error.property === ".email") {
				console.log(error);
				error.message = "Ingrese un email correcto";
			}

			return error;
		});
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
						<h1>Login</h1>

						<MuiForm
							className="create-teachers__form"
							schema={schema as Record<string, unknown>}
							uiSchema={ui}
							onSubmit={onSubmit}
							onError={(error): void => console.log(error)}
							transformErrors={transformErrors}
							showErrorList={false}>
							<Button variant="contained" type="submit">
								Log in!
							</Button>
						</MuiForm>
					</CardContent>
				</Card>
			</Grid>
		</Grid>
	);
}

export default Login;
