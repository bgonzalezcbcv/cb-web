import * as React from "react";

import { Student } from "../../../../core/Models";
import { DefaultApiResponse, StudentPageMode } from "../../../../core/interfaces";

import { Box, Button, Chip, Typography } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import EditIcon from "@mui/icons-material/Edit";
import EditOffIcon from "@mui/icons-material/EditOff";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import AddTaskIcon from "@mui/icons-material/AddTask";

import FormUploadDialog from "../FormUploadDialog/FormUploadDialog";
import Modal from "../../../../components/modal/Modal";
import DeactivateStudent, { DeactivationInfo } from "../DeactivateStudent/DeactivateStudent";
import StudentActivationModal from "../StudentActivationModal/StudentActivationModal";

import "./Student.scss";
import { useCallback } from "react";
import * as API from "../../../../core/ApiStore";
import DeactivateStudentDialog from "./DeactivateStudent/DeactivateStudentDialog";

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
	const [isDeactivateStudentModalVisible, setIsDeactivateStudentModalVisible] = React.useState(false);
	const [deactivationInfo, setDeactivationInfo] = React.useState<DeactivationInfo>({} as DeactivationInfo);
	const [hasErrors, setHasErrors] = React.useState(true);
	const [studentDeactivationState, setStudentDeactivationState] = React.useState<DefaultApiResponse<Student>>();
	const [showDialog, setShowDialog] = React.useState(false);

	const handleDeactivateStudent = useCallback(async (): Promise<Student | void> => {
		if (hasErrors) return;

		setStudentDeactivationState({} as DefaultApiResponse<Student>);

		const deactivationResponse = await API.deactivateStudent(student, deactivationInfo.reason, deactivationInfo.lastDay, deactivationInfo.description);

		setStudentDeactivationState(deactivationResponse);
		setShowDialog(true);

		if (deactivationResponse.success) {
			setDeactivationInfo({} as DeactivationInfo);
			setIsDeactivateStudentModalVisible(false);
			deactivationResponse.data && setStudent(deactivationResponse.data);
		}
	}, [deactivationInfo, hasErrors, student]);
	const [showActivationModal, setShowActivationModal] = React.useState(false);

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
					{
						//TODO: add this to the condition: && student.status === "pending"

						[StudentPageMode.edit].includes(mode) && student.status !== "active" ? (
							<Button
								data-cy={"studentActivateButton"}
								color={"secondary"}
								startIcon={<AddTaskIcon />}
								onClick={(): void => setShowActivationModal(true)}>
								{"Activar"}
							</Button>
						) : null
					}
					{mode === StudentPageMode.edit && student.status !== "inactive" ? (
						<Button color={"secondary"} startIcon={<DeleteIcon />} onClick={(): void => setIsDeactivateStudentModalVisible(true)}>
							Dar de baja
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

			<StudentActivationModal
				open={showActivationModal}
				onClose={() => {
					setShowActivationModal(false);
				}}
				onAccept={(newStudent: Student): void => {
					setStudent(newStudent);
					setIsFormUploadOpen(false);
				}}
				studentProp={student}
			/>

			<Modal
				show={isDeactivateStudentModalVisible}
				title={"Dar de baja estudiante"}
				acceptText={"Dar de baja"}
				onClose={(): void => setIsDeactivateStudentModalVisible(false)}
				onAccept={handleDeactivateStudent}
				acceptEnabled={!hasErrors}>
				<DeactivateStudent
					deactivationInfo={(value: DeactivationInfo): void => setDeactivationInfo(value)}
					onError={(value): void => setHasErrors(value)}
				/>
			</Modal>

			{showDialog && studentDeactivationState && (
				<DeactivateStudentDialog apiResponse={studentDeactivationState} show={(value): void => setShowDialog(value)} />
			)}
		</>
	);
}
