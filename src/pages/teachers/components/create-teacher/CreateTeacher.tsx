import React from "react";
import { AjvError, ISubmitEvent } from "@rjsf/core";
import { Card, CardContent } from "@mui/material";
import MuiForm from "@rjsf/material-ui/v5";

import { DataStore } from "../../../../core/DataStore";
import { Teacher, VisualComponent } from "../../../../core/interfaces";
import schema from "./schema.json";
import ui from "./ui.json";

import "./CreateTeacher.scss";

export default function CreateTeacher(props: VisualComponent): React.ReactElement {
	const { width, height } = props;

	const dataStore = DataStore.getInstance();

	function onSubmit(event: ISubmitEvent<unknown>): void {
		console.log(event.formData);

		dataStore.addTeacher(event.formData as Teacher);
	}

	function transformErrors(errors: AjvError[]): AjvError[] {
		return errors.map((error) => {
			if (error.property === ".ci" && error.name === "pattern") error.message = "Ingrese una cedula con el formato x.xxx.xxx.y";

			if (error.property === ".firstName") error.message = "Ingrese nombres del profesor";

			if (error.property === ".lastName") error.message = "Ingrese apellidos del profesor";

			if (error.property === ".subjects") error.message = "Ingrese las materias que el profesor enseña";

			return error;
		});
	}

	return (
		<Card
			className="create-teachers"
			sx={{
				width: width ?? "100%",
				height: height ?? "100%",
				overflowY: "auto",
			}}>
			<CardContent>
				<MuiForm
					className="create-teachers__form"
					schema={schema as Record<string, unknown>}
					uiSchema={ui}
					onSubmit={onSubmit}
					transformErrors={transformErrors}
					showErrorList={false}
				/>
			</CardContent>
		</Card>
	);
}
