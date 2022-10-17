import React, { useCallback, useState } from "react";
import { ErrorObject } from "ajv";

import { JsonForms } from "@jsonforms/react";
import { materialCells, materialRenderers } from "@jsonforms/material-renderers";
import { Translator, ValidationMode } from "@jsonforms/core";
import * as API from "../../core/ApiStore";
import * as Models from "../../core/Models";
import { CreationState } from "../../core/interfaces";
import { ajv as userAjv } from "../../core/AJVHelper";
import { Button, Card, CardContent } from "@mui/material";

import NumericInputControl, { NumericInputControlTester } from "../../components/NumericInput/NumericInputControl";
import CreateUserDialog from "./components/CreateUserDialog";

import schema from "./schema.json";
import ui from "./ui.json";

const renderers = [...materialRenderers, { tester: NumericInputControlTester, renderer: NumericInputControl }];

export default function CreateUser(): React.ReactElement {
	const [data, setData] = useState({});
	const [errors, setErrors] = useState<ErrorObject[]>([]);
	const [validationMode, setValidationMode] = useState<ValidationMode>("ValidateAndHide");
	const [userCreationState, setUserCreationState] = React.useState<CreationState>(CreationState.idle);
	const [showDialog, setShowDialog] = React.useState(false);

	const handleUserCreation = useCallback(async (): Promise<void> => {
		setValidationMode("ValidateAndShow");
		if (errors.length > 0) return;

		setUserCreationState(CreationState.inProcess);

		const successfulCreation = await API.createUser(data as Models.User);

		successfulCreation ? setUserCreationState(CreationState.success) : setUserCreationState(CreationState.fail);
		setShowDialog(true);
	}, [data, errors]);

	const translator = (id: string, defaultMessage: string): string => {
		if (id.includes("required")) return "Campo requerido";
		else return defaultMessage;
	};

	return (
		<Card
			sx={{
				width: "30%",
				padding: "10px",
				marginTop: "20px",
				display: "flex",
				flexDirection: "column",
				boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
			}}>
			<CardContent>
				<h1>Crear usuario</h1>

				<JsonForms
					i18n={{ translate: translator as Translator }}
					ajv={userAjv}
					schema={schema}
					uischema={ui}
					data={data}
					renderers={renderers}
					cells={materialCells}
					onChange={({ errors, data }): void => {
						errors && setErrors(errors);
						setData(data);
					}}
					validationMode={validationMode}
				/>

				<Button id="createButton" variant="contained" onClick={handleUserCreation} sx={{ marginTop: 10 }}>
					Crear
				</Button>
			</CardContent>

			{showDialog && <CreateUserDialog success={userCreationState === "success"} show={(value): void => setShowDialog(value)} />}
		</Card>
	);
}
