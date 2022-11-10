/* eslint-disable */
import * as React from "react";

import { Student } from "../../../../core/Models";
import { StudentPageMode } from "../../../../core/interfaces";

import { Box, Button, Chip, Typography } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import EditIcon from "@mui/icons-material/Edit";
import EditOffIcon from "@mui/icons-material/EditOff";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";

import FormUploadDialog from "../FormUploadDialog/FormUploadDialog";

import "./Student.scss";

interface StudentPageHeaderProps {
	mode: StudentPageMode;
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
					{mode === StudentPageMode.create && <PersonAddIcon />}
					<Typography component={"span"} sx={{ alignSelf: "center", paddingLeft: "10px" }}>
						{[StudentPageMode.view, StudentPageMode.edit].includes(mode) ? `${student.name} ${student.surname}` : "Nuevo alumno"}
					</Typography>
					{student.group ? (
						<Chip
							sx={{ alignSelf: "center", marginLeft: "10px" }}
							label={`${student.group.grade_name} ${student.group.name} (${student.group.year})`}
							variant="outlined"
						/>
					) : (
						""
					)}
					{student.status === "pending" ? (
						<Chip
							sx={{ alignSelf: "center", marginLeft: "10px" }}
							icon={<PriorityHighIcon color="warning" />}
							label="Alumno pendiente"
							variant="outlined"
						/>
					) : (
						""
					)}
				</Box>
				<Box>
					{mode === StudentPageMode.create ? (
						<Button
							color={"secondary"}
							startIcon={<UploadFileIcon />}
							title="Subir formulario de inscripción"
							onClick={(): void => setIsFormUploadOpen(true)}>
							{"Subir formulario"}
						</Button>
					) : null}

					{[StudentPageMode.edit].includes(mode) ? (
						<Button
							data-cy={"studentEditInfoButton"}
							color={"secondary"}
							startIcon={isEditable ? <EditOffIcon /> : <EditIcon />}
							onClick={(): void => setIsEditable(!isEditable)}>
							{"Editar"}
						</Button>
					) : null}

					{mode === StudentPageMode.edit ? (
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
