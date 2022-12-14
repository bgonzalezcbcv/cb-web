import _ from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";

import { login } from "../../core/ApiStore";
import { DataStore } from "../../core/DataStore";
import { ajv } from "../../core/AJVHelper";

import { Translator, ValidationMode } from "@jsonforms/core";
import { JsonForms } from "@jsonforms/react";
import { materialCells, materialRenderers } from "@jsonforms/material-renderers";
import { Alert, Button, Card, CardContent, Grid, Box } from "@mui/material";
import { LoadingButton } from "@mui/lab";

import schema from "./login-schema.json";
import ui from "./login-ui.json";
import logo from "../../assets/Vertical.svg";

import styles from "./Login.module.scss";

const debounceTime = 200;

function Login(): JSX.Element {
	const dataStore = DataStore.getInstance();

	const [loginInfo, setLoginInfo] = useState<{ email: string; password: string }>({ email: "", password: "" });
	const [errors, setErrors] = useState<unknown[]>([]);
	const [validationMode, setValidationMode] = useState<ValidationMode>("ValidateAndHide");
	const [errMsg, setErrMsg] = useState<string | undefined>(undefined);
	const [isLoading, setIsLoading] = useState(false);
	const [unlockLogin, setUnlockLogin] = useState(false);

	const debouncedSetLoginInfo = React.useCallback(_.debounce(setLoginInfo, debounceTime), []);
	const debouncedSetErrors = React.useCallback(_.debounce(setErrors, debounceTime), []);

	const navigate = useNavigate();

	const handleLogin = useCallback(async (): Promise<void> => {
		setIsLoading(true);

		setValidationMode("ValidateAndShow");
		if (errors.length > 0) {
			setIsLoading(false);
			return;
		}

		const { success, data, error } = await login(loginInfo.email, loginInfo.password);

		if (success && data) {
			const { id, email, token, name, surname, role } = data;

			if (dataStore.logIn(id, email, token, name, surname, role)) navigate("/");
			else setErrMsg("Error al iniciar sesión. Intentar nuevamente.");
		} else {
			setErrMsg(error);
		}

		setIsLoading(false);
	}, [errors, loginInfo]);

	const handleSubmit = useCallback((): void => {
		handleLogin();
	}, [handleLogin]);

	const handleKeyDown = useCallback(
		(event: KeyboardEvent): void => {
			if (event.key === "Enter" && errors.length === 0) {
				handleLogin();
			}
		},
		[handleLogin, errors]
	);

	useEffect(() => {
		window.addEventListener("keydown", handleKeyDown);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [handleKeyDown]);

	const translator = (id: string, defaultMessage: string): string => {
		if (id.includes("required")) return "Este campo es requerido.";
		else return defaultMessage;
	};

	return (
		<Box className={styles.loginBody} width="100%" height="100%">
			<Grid alignContent="center" justifyContent="center">
				<Card className={styles.container}>
					<CardContent className={styles.container}>
						<div className={styles.formHeader}>
							<img className={styles.loginLogo} src={logo} alt="logo" />
							<h1 className={styles.title}>Bienvenido</h1>
						</div>

						<JsonForms
							i18n={{ translate: translator as Translator }}
							ajv={ajv}
							schema={schema}
							uischema={ui}
							data={loginInfo}
							renderers={materialRenderers}
							cells={materialCells}
							onChange={({ errors, data }): void => {
								debouncedSetErrors(errors ?? []);
								debouncedSetLoginInfo(data);

								setUnlockLogin(true);
							}}
							validationMode={validationMode}
						/>

						{!isLoading && unlockLogin ? (
							<Button className={styles.loginButton} disabled={errors.length > 0} data-cy="loginButton" onClick={handleSubmit}>
								Iniciar Sesión
							</Button>
						) : (
							<LoadingButton loading className={styles.loadingButton} />
						)}

						{errMsg ? (
							<Alert severity="error" variant="outlined" data-cy="alert" onClose={(): void => setErrMsg(undefined)}>
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
