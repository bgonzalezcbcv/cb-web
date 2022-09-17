/* eslint-disable */
import * as React from "react";

import { Student as StudentModel } from "../../core/Models";

import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Tabs, { tabsClasses } from "@mui/material/Tabs";
import { Button, Card, Dialog, DialogContent, DialogTitle, Typography } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

import { TabPanel } from "./components/TabPanel";
import CreateStudent from "./components/CreateStudent/CreateStudent";
import AdministrativeInfo from "./components/AdministrativeInfo/AdministrativeInfo";

import { defaultStudent } from "./DefaultStudent";
import StudentInfo from "./components/StudentInfo/StudentInfo";
import FamilyForm from "./components/FamilyInfo/FamilyForm";
import { EnrollmentQuestions } from "./components/EnrollmentQuestions/EnrollmentQuestions";

const familyMemberPrueba = {
	role: "string;",
	full_name: "string;",
	birthdate: "string;",
	birthplace: "string;",
	nationality: "string;",
	first_language: "string;",
	ci: "string;",
	marital_status: "string;",
	cellphone: "string;",
	email: "string;",
	address: "string;",
	neighbourhood: "string;",
	education_level: "string;",
	occupation: "string;",
	workplace: "string;",
	workplace_address: "string;",
	workplace_neighbourhood: "string;",
	workplace_phone: "string;",
};

const studentPrueba = {
	id: "string;",
	ci: "string;",
	name: "string;",
	surname: "string;",
	schedule_start: "string;",
	schedule_end: "string;",
	tuition: "string;",
	reference_number: 0,
	birthplace: "string;",
	birthdate: "string;",
	nationality: "string;",
	first_language: "string;",
	office: "string;",
	status: "string;",
	address: "string;",
	neighborhood: "string;",
	medical_assurance: "string;",
	emergency: "string;",
	phone_number: "string;",
	vaccine_expiration: "string;",
	inscription_date: "string;",
	starting_date: "string;",
	contact: "string;",
	contact_phone: "string;",
	email: "string;",
	family: [familyMemberPrueba],
	question_categories: [
		{
			category: "string;",
			questions: [
				{
					id: "string;",
					question: "string;",
					answer: "string;",
				},
			],
		},
	],
};

export default function Student(): React.ReactElement {
	const [value, setValue] = React.useState(0);
	const [student, setStudent] = React.useState<StudentModel>(defaultStudent);
	const [editMode, setEditMode] = React.useState(true);
	const [isFormUploadOpen, setIsFormUploadOpen] = React.useState(false);

	const handleChange = (event: React.SyntheticEvent, newValue: number): void => {
		setValue(newValue);
	};

	return (
		<Card sx={{ width: "80%", height: "90%", padding: "10px" }}>
			<Box
				sx={{ borderBottom: 1, borderColor: "divider", display: "flex", flexDirection: "row", justifyContent: "space-between", paddingBottom: "10px" }}>
				<div style={{ display: "flex", flexDirection: "row", alignSelf: "center", justifySelf: "center" }}>
					<PersonAddIcon></PersonAddIcon>
					<Typography sx={{ alignSelf: "center", paddingLeft: "10px" }}>Nuevo alumno</Typography>
				</div>
				<div>
					<Button title="Subir formulario de inscripción" onClick={(): void => setIsFormUploadOpen(true)}>
						<UploadFileIcon />
					</Button>
					{!editMode ? <Button startIcon={<DeleteIcon />}>Deshacer cambios</Button> : ""}
					<Button startIcon={editMode ? <EditIcon /> : <SendIcon />} onClick={(): void => setEditMode(!editMode)}>
						{editMode ? "Editar" : "Enviar"}{" "}
					</Button>
					<Button startIcon={<DeleteIcon />}>Bajar</Button>
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
					<Tab label="Informacion basica" />
					<Tab label="Informacion familiar" />
					<Tab label="Informacion complementaria" />
					<Tab label="Informacion Administrativa" />
					<Tab label="Trayectoria" />
				</Tabs>
			</Box>
			<TabPanel value={value} index={0}>
				<StudentInfo student={student} onChange={setStudent} editable={editMode}></StudentInfo>
			</TabPanel>
			<TabPanel value={value} index={1}>
				<FamilyForm student={student} onChange={setStudent} editable={editMode}></FamilyForm>
			</TabPanel>
			<TabPanel value={value} index={2}>
				<EnrollmentQuestions student={student} onChange={setStudent} editable={editMode} />
			</TabPanel>
			<TabPanel value={value} index={3}>
				<AdministrativeInfo student={student} onChange={setStudent} editable={editMode}></AdministrativeInfo>
			</TabPanel>
			<TabPanel value={value} index={3}>
				{/*<FamilyForm student={} onChange={() => {}}></FamilyForm>*/}
			</TabPanel>

			<Dialog open={isFormUploadOpen} onClose={(): void => setIsFormUploadOpen(false)}>
				<DialogTitle>Subir formulario de inscripción</DialogTitle>

				<DialogContent>
					<CreateStudent
						studentProp={student}
						onUpload={(newStudent): void => {
							setStudent(newStudent);
							setIsFormUploadOpen(false);
						}}
					/>
				</DialogContent>
			</Dialog>
		</Card>
	);
}
