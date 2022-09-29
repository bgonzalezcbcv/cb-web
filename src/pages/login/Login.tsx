import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";

import { login } from "../../core/ApiStore";
import { DataStore } from "../../core/DataStore";
import { JsonForms } from "@jsonforms/react";
import { materialCells, materialRenderers } from "@jsonforms/material-renderers";
import { Alert, Box, Button, Card, CardContent, Grid } from "@mui/material";
import { ValidationMode } from "@jsonforms/core";

import schema from "./login-schema.json";
import ui from "./login-ui.json";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import logo from "../../assets/Vertical.svg";

import "./Login.scss";

function Login(): JSX.Element {
	const dataStore = DataStore.getInstance();

	const [loginInfo, setLoginInfo] = useState<{ email: string; password: string }>({ email: "", password: "" });
	const [errors, setErrors] = useState<unknown[]>([]);
	const [validationMode, setValidationMode] = useState<ValidationMode>("ValidateAndHide");
	const [errorAlert, setErrorAlert] = useState<string | undefined>(undefined);

	const [errMsg, setErrMsg] = useState("");

	const navigate = useNavigate();

	const handleSubmit = async () => {
		setValidationMode("ValidateAndShow");
		if (errors.length > 0) return;

		const { success, data, err } = await login(loginInfo.email, loginInfo.password);

		if (success) {
			const { email, token, displayName, role } = data!;

			dataStore.logIn(email, token, displayName, role);

			navigate("/");
		} else {
			setErrMsg(err);
		}
	};

	return (
		<>
			<Box className="loginBody" width="100%" height="100%">
				<Grid alignContent="center" justifyContent="center">
					<Grid>
						<Card className="contenedor">
							<CardContent className="contenedor">
								<div className="formHeader">
									<img className="loginLogo" src={logo} alt="logo" />
									<h1 className="title">Bienvenido</h1>
								</div>
								<JsonForms
									schema={schema}
									uischema={ui}
									data={loginInfo}
									renderers={materialRenderers}
									cells={materialCells}
									onChange={({ errors, data }): void => {
										setErrors(errors ?? []);
										setLoginInfo(data);
									}}
									validationMode={validationMode}
								/>
								<Button className="loginButton" onClick={handleSubmit}>
									Iniciar Sesión
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
			</Box>
		</>
	);
}

export default observer(Login);
