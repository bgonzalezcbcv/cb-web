import React, { useState } from "react";
import { Button, Card, CardContent } from "@mui/material";

import { JsonForms } from "@jsonforms/react";
import { JsonSchema7, ValidationMode } from "@jsonforms/core";
import { materialCells, materialRenderers } from "@jsonforms/material-renderers";
import { DataStore } from "../../../../core/DataStore";
import { Teacher, VisualComponent } from "../../../../core/interfaces";

import schema from "./schema.json";
import ui from "./ui.json";

import "./CreateTeacher.scss";

const initialData = {};

export default function CreateTeacher(props: VisualComponent): React.ReactElement {
	const { width, height } = props;

	const dataStore = DataStore.getInstance();

	const [data, setData] = useState(initialData);
	const [errors, setErrors] = useState<unknown[]>([]);
	const [validationMode, setValidationMode] = useState<ValidationMode>("ValidateAndHide");

	function handleOnSubmit(): void {
		setValidationMode("ValidateAndShow");

		if (errors.length > 0) return;

		dataStore.addTeacher(data as Teacher);
	}

	return (
		<div>
			<Card
				className="create-teachers"
				sx={{
					width: width ?? "100%",
					height: height ?? "100%",
					overflowY: "auto",
				}}>
				<CardContent>
					<JsonForms
						schema={schema as JsonSchema7}
						uischema={ui}
						data={data}
						renderers={materialRenderers}
						cells={materialCells}
						onChange={({ errors, data }): void => {
							setErrors(errors ?? []);
							setData(data);
						}}
						validationMode={validationMode}
					/>
				</CardContent>

				<Button onClick={handleOnSubmit}>Agregar</Button>
			</Card>
		</div>
	);
}
