/* eslint-disable */
import * as React from "react";

import { Card } from "@mui/material";
import * as StudentComponents from "./components/index";
import { Student as StudentModel } from "../../core/Models";
import { defaultStudent } from "./DefaultStudent";

import "./Student.scss";

const { FamilyForm, StudentInfo, AdministrativeInfo, CreateStudentDialog, TabPanel, StudentPageHeader, StudentPageTabs, EnrollmentQuestions } =
	StudentComponents;

interface StudentProps {
	mode: "CREATE" | "VIEW";
}
export default function Student(props: StudentProps): React.ReactElement {
	const { mode } = props;

	const [currentTabIndex, setCurrentTabIndex] = React.useState(0);
	const [student, setStudent] = React.useState<StudentModel>(defaultStudent);
	const [isEditable, setIsEditable] = React.useState(false);

	const tabLabels = ["Básica", "Familiar", "Complementaria", "Administrativa"];

	const panels = [
		<StudentInfo student={student} onChange={setStudent} editable={isEditable} />,
		<FamilyForm student={student} onChange={setStudent} editable={isEditable} />,
		<EnrollmentQuestions student={student} onChange={setStudent} editable={isEditable} />,
		<AdministrativeInfo student={student} onChange={setStudent} editable={isEditable} />,
	];

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
			<StudentPageHeader mode={mode} setStudent={setStudent} setIsEditable={setIsEditable} isEditable={isEditable} student={student} />

			<StudentPageTabs tabLabels={tabLabels} onChange={setCurrentTabIndex} value={currentTabIndex} />

			{panels.map((panel, index) => (
				<TabPanel className="panel-item" value={currentTabIndex} index={index}>
					{panel}
				</TabPanel>
			))}

			<CreateStudentDialog student={student} />
		</Card>
	);
}
