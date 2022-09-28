/* eslint-disable */
import * as React from "react";

import { Student as StudentModel } from "../../core/Models";

import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Tabs, { tabsClasses } from "@mui/material/Tabs";
import { Button, Card, Typography } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";

import EditIcon from "@mui/icons-material/Edit";
import EditOffIcon from "@mui/icons-material/EditOff";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

import TabPanel from "./components/TabPanel/TabPanel";
import EnrollmentQuestions from "./components/EnrollmentQuestions/EnrollmentQuestions";
import FamilyForm from "./components/FamilyForm/FamilyForm";
import StudentInfo from "./components/StudentInfo/StudentInfo";
import AdministrativeInfo from "./components/AdministrativeInfo/AdministrativeInfo";
import FormUploadDialog from "./components/FormUploadDialog/FormUploadDialog";
import CreateStudentDialog from "./components/CreateStudentDialog/CreateStudentDialog";
import { defaultStudent } from "./DefaultStudent";

import "./Student.scss";

interface StudentProps {
	mode: "CREATE" | "VIEW";
}
export default function Student(props: StudentProps): React.ReactElement {
	const { mode } = props;

	const [value, setValue] = React.useState(0);
	const [student, setStudent] = React.useState<StudentModel>(defaultStudent);
	const [editMode, setEditMode] = React.useState(false);
	const [isFormUploadOpen, setIsFormUploadOpen] = React.useState(false);

	const handleChange = (event: React.SyntheticEvent, newValue: number): void => {
		setValue(newValue);
	};

	return (
		<Card
			sx={{
				width: "80%",
				height: "80vh",
				padding: "10px",
				alignSelf: "flex-start",
				marginTop: "20px",
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
				boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
			}}>
			<Box
				sx={{
					borderBottom: 1,
					borderColor: "divider",
					display: "flex",
					flexDirection: "row",
					justifyContent: "space-between",
					paddingBottom: "10px",
				}}>
				<div style={{ display: "flex", flexDirection: "row", alignSelf: "center", justifySelf: "center" }}>
					<PersonAddIcon></PersonAddIcon>
					<Typography component={"span"} sx={{ alignSelf: "center", paddingLeft: "10px" }}>
						Nuevo alumno
					</Typography>
				</div>
				<div>
					<Button title="Subir formulario de inscripción" onClick={(): void => setIsFormUploadOpen(true)}>
						<UploadFileIcon />
					</Button>
					{/*{!editMode ? <Button startIcon={<DeleteIcon />}>Deshacer cambios</Button> : ""}*/}
					<Button data-cy="studentEditInfoButton" startIcon={editMode ? <EditOffIcon /> : <EditIcon />} onClick={(): void => setEditMode(!editMode)}>
						{"Editar"}{" "}
					</Button>
					{mode !== "CREATE" ? <Button startIcon={<DeleteIcon />}>Bajar</Button> : ""}
				</div>
			</Box>

			<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
				<Tabs
					value={value}
					onChange={handleChange}
					variant="scrollable"
					scrollButtons
					sx={{
						[`& .${tabsClasses.scrollButtons}`]: {
							"&.Mui-disabled": { opacity: 0.3 },
						},
					}}>
					<Tab label="Informacion basica" data-cy="basicInfoTab" />
					<Tab label="Informacion familiar" data-cy="familyInfoTab" />
					<Tab label="Informacion complementaria" data-cy="complementaryInfoTab" />
					<Tab label="Informacion Administrativa" data-cy="administrativeInfoTab" />
					<Tab label="Trayectoria" data-cy="trajectoryTab" />
				</Tabs>
			</Box>

			<TabPanel className="panel-item" value={value} index={0}>
				<StudentInfo student={student} onChange={setStudent} editable={editMode} />
			</TabPanel>

			<TabPanel className="panel-item" value={value} index={1}>
				<FamilyForm student={student} onChange={setStudent} editable={editMode} />
			</TabPanel>

			<TabPanel className="panel-item" value={value} index={2}>
				<EnrollmentQuestions student={student} onChange={setStudent} editable={editMode} />
			</TabPanel>

			<TabPanel className="panel-item" value={value} index={3}>
				<AdministrativeInfo student={student} onChange={setStudent} editable={editMode} />
			</TabPanel>

			<TabPanel className="panel-item" value={value} index={4}></TabPanel>

			<FormUploadDialog
				open={isFormUploadOpen}
				onClose={(): void => setIsFormUploadOpen(false)}
				studentProp={student}
				onUpload={(newStudent): void => {
					setStudent(newStudent);
					setIsFormUploadOpen(false);
				}}
			/>

			<CreateStudentDialog student={student} />
		</Card>
	);
}
