/* eslint-disable */
import * as React from "react";
import { createAjv } from "@jsonforms/core";

import { Student as StudentModel } from "../../core/Models";

import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Tabs, { tabsClasses } from "@mui/material/Tabs";
import { Button, Card, Dialog, DialogActions, DialogContent, DialogTitle, Typography, Divider } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

import TabPanel from "./components/TabPanel/TabPanel";
import EnrollmentQuestions from "./components/EnrollmentQuestions/EnrollmentQuestions";
import FamilyForm from "./components/FamilyForm/FamilyForm";
import StudentInfo from "./components/StudentInfo/StudentInfo";
import AdministrativeInfo from "./components/AdministrativeInfo/AdministrativeInfo";
import FormUploadDialog from "./components/FormUploadDialog/FormUploadDialog";
import { defaultStudent } from "./DefaultStudent";

import studentSchema from "./schema.json";

import "./Student.scss";

export default function Student(): React.ReactElement {
	const [value, setValue] = React.useState(0);
	const [student, setStudent] = React.useState<StudentModel>(defaultStudent);
	const [editMode, setEditMode] = React.useState(true);
	const [isFormUploadOpen, setIsFormUploadOpen] = React.useState(false);
	const [isCreationDialogOpen, setIsCreationDialogOpen] = React.useState(false);

	const handleChange = (event: React.SyntheticEvent, newValue: number): void => {
		setValue(newValue);
	};

	return (
		<Card
			sx={{
				width: "80%",
				height: "90%",
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
			<div>
				<Divider sx={{ marginBottom: "10px" }}></Divider>
				<Box
					display="flex"
					justifyContent="flex-end"
					alignContent="flex-end"
					alignSelf="flex-end"
					onClick={() => {
						const ajv = createAjv({ allErrors: true });

						ajv.validate(studentSchema, student);

						ajv.errors?.length! > 0 && setIsCreationDialogOpen(true);
					}}>
					<Button variant="outlined">Crear Alumno</Button>
				</Box>
			</div>

			<Dialog open={isCreationDialogOpen} onClose={(): void => setIsCreationDialogOpen(false)}>
				<DialogTitle>
					<Typography component={"span"} variant="h5" fontWeight="bold">
						Hay errores en los campos del alumno...
					</Typography>
				</DialogTitle>

				<DialogContent>
					<Typography component={"span"}>¿Está seguro de querer crear este alumno?</Typography>
				</DialogContent>

				<DialogActions sx={{ display: "flex", justifyContent: "space-around" }}>
					<Button variant="outlined" onClick={() => setIsCreationDialogOpen(false)}>
						No
					</Button>

					<Button variant="outlined">Si</Button>
				</DialogActions>
			</Dialog>
		</Card>
	);
}
