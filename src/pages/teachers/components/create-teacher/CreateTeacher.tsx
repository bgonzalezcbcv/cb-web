import React, { useState } from "react";
import { Button, Card, CardContent } from "@mui/material";

import { DataStore } from "../../../../core/DataStore";
import { Teacher, VisualComponent } from "../../../../core/interfaces";
import schema from "./schema.json";
import ui from "./ui.json";

import "./CreateTeacher.scss";

import { materialCells, materialRenderers } from "@jsonforms/material-renderers";
import { JsonForms } from "@jsonforms/react";

const initialData = {};

export default function CreateTeacher(props: VisualComponent): React.ReactElement {
	const { width, height } = props;

	const dataStore = DataStore.getInstance();

	const [data, setData] = useState(initialData);

	function handleOnClick(): void {

		dataStore.addTeacher(data as Teacher);
	}

	// function transformErrors(errors: AjvError[]): AjvError[] {
	// 	return errors.map((error) => {
	// 		if (error.property === ".ci" && error.name === "pattern") error.message = "Ingrese una cedula con el formato x.xxx.xxx.y";
	//
	// 		if (error.property === ".firstName") error.message = "Ingrese nombres del profesor";
	//
	// 		if (error.property === ".lastName") error.message = "Ingrese apellidos del profesor";
	//
	// 		if (error.property === ".subjects") error.message = "Ingrese las materias que el profesor enseña";
	//
	// 		return error;
	// 	});
	// }

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
						schema={schema}
						uischema={ui}
						data={data}
						renderers={materialRenderers}
						cells={materialCells}
						onChange={({data}):void => setData(data)}
					/>

				</CardContent>

				<Button onClick={handleOnClick}>Agregar</Button>
			</Card>
		</div>
	);
}
