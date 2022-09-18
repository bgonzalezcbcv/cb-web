import * as React from "react";

import { Student } from "../../../../core/Models";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import CreateStudent from "../CreateStudent/CreateStudent";

export default function FormUploadDialog(props: {
	open: boolean;
	onClose: () => void;
	studentProp: Student;
	onUpload: (newStudent: Student) => void;
}): React.ReactElement {
	return (
		<Dialog open={props.open} onClose={props.onClose}>
			<DialogTitle>Subir formulario de inscripción</DialogTitle>

			<DialogContent>
				<CreateStudent studentProp={props.studentProp} onUpload={props.onUpload} />
			</DialogContent>
		</Dialog>
	);
}
