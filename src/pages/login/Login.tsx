import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";

import { login } from "../../core/ApiStore";
import { DataStore } from "../../core/DataStore";
import { JsonForms } from "@jsonforms/react";
import { materialCells, materialRenderers } from "@jsonforms/material-renderers";
import { Alert, Button, Card, CardContent, Grid, Box } from "@mui/material";
import { ValidationMode } from "@jsonforms/core";

import schema from "./login-schema.json";
import ui from "./login-ui.json";
import logo from "../../assets/Vertical.svg";

import "./Login.scss";
import { LoadingButton } from "@mui/lab";

function Login(): JSX.Element {
	const dataStore = DataStore.getInstance();

	const [loginInfo, setLoginInfo] = useState<{ email: string; password: string }>({ email: "", password: "" });
	const [errors, setErrors] = useState<unknown[]>([]);
	const [validationMode, setValidationMode] = useState<ValidationMode>("ValidateAndHide");
	const [errMsg, setErrMsg] = useState<string | undefined>(undefined);
	const [isLoading, setIsLoading] = useState(false);

	const navigate = useNavigate();

	const handleSubmit = async (): Promise<void> => {
		setIsLoading(true);

		setTimeout(() => {
			setIsLoading(false);
		}, 3000);

		setValidationMode("ValidateAndShow");
		if (errors.length > 0) {
			setIsLoading(false);
			return;
		}

		const { success, data, err } = await login(loginInfo.email, loginInfo.password);

		if (success && data) {
			const { email, token, name, role } = data;

			dataStore.logIn(email, token, name, role);

			navigate("/");
		} else {
			setErrMsg(err);
		}

		setIsLoading(false);
	};

	return (
		<Box className="loginBody" width="100%" height="100%">
			<Grid alignContent="center" justifyContent="center">
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
						{!isLoading ? (
							<Button className="loginButton" onClick={handleSubmit}>
								Iniciar Sesión
							</Button>
						) : (
							<LoadingButton loading className="loadingButton"></LoadingButton>
						)}
						{errMsg ? (
							<Alert severity="error" variant="outlined" onClose={(): void => setErrMsg(undefined)}>
								{errMsg}
							</Alert>
						) : null}
					</CardContent>
				</Card>
			</Grid>
		</Box>
	);
}

export default observer(Login);
