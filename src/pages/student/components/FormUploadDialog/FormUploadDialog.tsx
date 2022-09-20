import * as React from "react";

import { Student } from "../../../../core/Models";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import UploadStudentForm from "../UploadStudentForm/UploadStudentForm";

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
				<UploadStudentForm studentProp={props.studentProp} onUpload={props.onUpload} />
			</DialogContent>
		</Dialog>
	);
}
