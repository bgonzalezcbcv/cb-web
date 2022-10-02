/* eslint-disable */
import * as React from "react";

import Box from "@mui/material/Box";
import { Button, Typography } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";

import EditIcon from "@mui/icons-material/Edit";
import EditOffIcon from "@mui/icons-material/EditOff";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

import FormUploadDialog from "../FormUploadDialog/FormUploadDialog";

import "./Student.scss";
import { Student } from "../../../../core/Models";

interface StudentPageHeaderProps {
	mode: "CREATE" | "VIEW";
	setStudent: (student: Student) => void;
	setIsEditable: (editing: boolean) => void;
	isEditable: boolean;
	student: Student;
}
export default function StudentPageHeader(props: StudentPageHeaderProps): React.ReactElement {
	const { mode, setStudent, setIsEditable, isEditable, student } = props;

	const [isFormUploadOpen, setIsFormUploadOpen] = React.useState(false);

	return (
		<>
			<Box
				sx={{
					borderBottom: 1,
					borderColor: "Boxider",
					display: "flex",
					flexDirection: "row",
					justifyContent: "space-between",
					paddingBottom: "10px",
				}}>
				<Box style={{ display: "flex", flexDirection: "row", alignSelf: "center", justifySelf: "center" }}>
					<PersonAddIcon />
					<Typography component={"span"} sx={{ alignSelf: "center", paddingLeft: "10px" }}>
						Nuevo alumno
					</Typography>
				</Box>
				<Box>
					<Button color={"secondary"} title="Subir formulario de inscripción" onClick={(): void => setIsFormUploadOpen(true)}>
						<UploadFileIcon />
					</Button>

					<Button color={"secondary"} startIcon={isEditable ? <EditOffIcon /> : <EditIcon />} onClick={(): void => setIsEditable(!isEditable)}>
						{"Editar"}{" "}
					</Button>
					{mode !== "CREATE" ? (
						<Button color={"secondary"} startIcon={<DeleteIcon />}>
							Bajar
						</Button>
					) : (
						""
					)}
				</Box>
			</Box>

			<FormUploadDialog
				open={isFormUploadOpen}
				onClose={(): void => setIsFormUploadOpen(false)}
				studentProp={student}
				onUpload={(newStudent: Student): void => {
					setStudent(newStudent);
					setIsFormUploadOpen(false);
				}}
			/>
		</>
	);
}
