import React from "react";
import Form from "@rjsf/material-ui/v5";
import { AjvError, ISubmitEvent } from "@rjsf/core";

import { VisualComponent } from "../../../../interfaces";
import schema from "./schema.json";
import ui from "./ui.json";

import "./CreateTeacher.scss";
import { Card, CardContent } from "@mui/material";

interface CreateTeacherProps extends VisualComponent {}

export default function CreateTeacher(props: CreateTeacherProps) {
	const { width, height } = props;

	function onSubmit(event: ISubmitEvent<any>) {
		console.log(event.formData);
	}

	function transformErrors(errors: AjvError[]) {
		return errors.map((error) => {
			if (error.property === ".ci" && error.name === "pattern")
				error.message = "Ingrese una cedula con el formato x.xxx.xxx.y";

			if (error.property === ".firstName")
				error.message = "Ingrese nombres del profesor";

			if (error.property === ".lastName")
				error.message = "Ingrese apellidos del profesor";

			if (error.property === ".subjects")
				error.message = "Ingrese las materias que el profesor enseña";

			return error;
		});
	}

	return (
		<Card
			className="create-teachers"
			sx={{ width: width ?? "100%", height: height ?? "100%" }}>
			<CardContent>
				<Form
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
