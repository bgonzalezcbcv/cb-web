/* eslint-disable */
import _ from "lodash";
import * as React from "react";
import { useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";

import { Alert, Card, CircularProgress } from "@mui/material";
import { StudentPageMode } from "../../core/interfaces";
import * as APIStore from "../../core/ApiStore";
import * as StudentComponents from "./components/index";
import { TabData } from "./components/StudentPageTabs/StudentPageTabs";
import { Student as StudentModel } from "../../core/Models";
import { defaultStudent } from "./DefaultStudent";

import "./Student.scss";

const { FamilyForm, StudentInfo, AdministrativeInfo, CreateStudentDialog, TabPanel, StudentPageHeader, StudentPageTabs, EnrollmentQuestions } =
	StudentComponents;

enum FetchState {
	initial = "initial",
	loading = "loading",
	failure = "failure",
}

interface StudentProps {
	mode?: StudentPageMode;
}
export default function Student(props: StudentProps): React.ReactElement {
	const { mode: modeProps } = props;
	const mode = modeProps ?? StudentPageMode.create;

	const { id } = useParams();

	const [currentTabIndex, setCurrentTabIndex] = React.useState(0);
	const [student, setStudent] = React.useState<StudentModel>(defaultStudent);
	const [isEditable, setIsEditable] = React.useState(true);
	const [fetchState, setFetchState] = React.useState(FetchState.loading);

	const getStudent = useCallback(async (): Promise<void> => {
		setFetchState(FetchState.loading);

		const response = await APIStore.fetchStudent(id as string);

		if (response.success && response.data) {
			setStudent(response.data);
			setFetchState(FetchState.initial);
		} else setFetchState(FetchState.failure);
	}, [id, setFetchState, setStudent]);

	useEffect((): void => {
		id ? getStudent() : setFetchState(FetchState.initial);
	}, [id, getStudent]);

	console.log(student);

	const tabData: TabData[] = [
		{ label: "Básica", dataCY: "basicInfoTab" },
		{ label: "Familiar", dataCY: "familyInfoTab" },
		{ label: "Complementaria", dataCY: "complementaryInfoTab" },
		{ label: "Administrativa", dataCY: "administrativeInfoTab" },
	];

	const debouncedSetStudent = React.useCallback(_.debounce(setStudent, 200), []);

	const panels = [
		<StudentInfo student={student} onChange={debouncedSetStudent} editable={isEditable} />,
		<FamilyForm student={student} onChange={debouncedSetStudent} editable={isEditable} />,
		<EnrollmentQuestions student={student} onChange={debouncedSetStudent} editable={isEditable} />,
		<AdministrativeInfo student={student} onChange={debouncedSetStudent} editable={isEditable} />,
	];

	if (fetchState === FetchState.loading) return <CircularProgress />;

	if (fetchState === FetchState.failure)
		return (
			<Alert severity="error" variant="outlined" onClick={getStudent}>
				No se pudo cargar el alumno. Clickear aquí para reintentar.
			</Alert>
		);

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
			<StudentPageHeader
				mode={mode}
				setStudent={(uploadedStudent) => {
					setStudent({ ...uploadedStudent });
				}}
				setIsEditable={setIsEditable}
				isEditable={isEditable}
				student={student}
			/>

			<StudentPageTabs tabData={tabData} onChange={setCurrentTabIndex} value={currentTabIndex} />

			{panels.map((panel, index) => (
				<TabPanel className="panel-item" value={currentTabIndex} index={index}>
					{panel}
				</TabPanel>
			))}

			{[StudentPageMode.create, StudentPageMode.edit].includes(mode) && <CreateStudentDialog student={student} mode={mode} />}
		</Card>
	);
}
