/* eslint-disable */
import _ from "lodash";
import * as React from "react";
import { useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";

import { Alert, Card, CircularProgress, Typography } from "@mui/material";
import { StudentPageMode, UserRole } from "../../core/interfaces";
import * as APIStore from "../../core/ApiStore";
import { restrictEditionTo } from "../../core/userRoleHelper";
import { Student as StudentModel } from "../../core/Models";
import * as StudentComponents from "./components/index";
import { TabData } from "./components/StudentPageTabs/StudentPageTabs";
import Restrict from "../../components/Restrict/Restrict";
import ReportCardList from "../reportcard/ReportCardList";
import { defaultStudent, emptyStudent } from "./DefaultStudent";

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
	const [isEditable, setIsEditable] = React.useState(mode === StudentPageMode.create);
	const [fetchState, setFetchState] = React.useState(FetchState.loading);
	const [warnings, setWarnings] = React.useState<string[][]>([[], [], [], []]);

	useEffect(() => {
		if (mode === StudentPageMode.create) setStudent(defaultStudent);
	}, [mode]);

	const getStudent = useCallback(async (): Promise<void> => {
		setFetchState(FetchState.loading);

		const response = await APIStore.fetchStudent(id as string);

		if (response.success && response.data) {
			setStudent(_.merge(emptyStudent, response.data));
			setFetchState(FetchState.initial);
		} else setFetchState(FetchState.failure);
	}, [id, setFetchState, setStudent]);

	useEffect((): void => {
		id ? getStudent() : setFetchState(FetchState.initial);
	}, [id, getStudent]);

	const debouncedSetStudent = React.useCallback(
		(student: StudentModel, debounce = true) => (debounce ? _.debounce(setStudent, 200)(student) : setStudent(student)),
		[]
	);

	const translator = (id: string, defaultMessage: string): string => {
		if ((id.includes("date") || id.includes("expiration")) && id.includes("required")) return "Debe ser una fecha válida.";
		if (id.includes("required")) return "Este campo es requerido.";
		else return defaultMessage;
	};

	const createTabs = ["Básica", "Familiar", "Complementaria", "Administrativa"];
	const viewTabs = ["Básica", "Familiar", "Complementaria", "Administrativa", "Boletines"];
	const editableTabs = ["Básica", "Familiar", "Complementaria", "Administrativa", "Boletines"];

	const tabsData: TabData[] = [
		{
			label: "Básica",
			dataCY: "basicInfoTab",
			panel: <StudentInfo student={student} onChange={debouncedSetStudent} editable={isEditable} translator={translator} />,
		},
		{
			label: "Familiar",
			dataCY: "familyInfoTab",
			panel: (
				<FamilyForm //
					student={student}
					onChange={debouncedSetStudent}
					editable={restrictEditionTo(
						[UserRole.Adscripto, UserRole.Director, UserRole.Recepcion, UserRole.Administrativo, UserRole.Administrador],
						isEditable
					)}
					translator={translator}
				/>
			),
		},
		{
			label: "Complementaria",
			dataCY: "complementaryInfoTab",
			panel: (
				<Restrict
					to={[UserRole.Director, UserRole.Docente, UserRole.Adscripto, UserRole.Administrador]}
					fallback={
						<Alert severity="info" variant="outlined">
							<Typography variant="body1">No tiene permisos para ver esta información.</Typography>
						</Alert>
					}>
					<EnrollmentQuestions
						student={student}
						onChange={debouncedSetStudent}
						editable={restrictEditionTo([UserRole.Director, UserRole.Administrativo], isEditable)}
					/>
				</Restrict>
			),
		},
		{
			label: "Administrativa",
			dataCY: "administrativeInfoTab",
			panel: (
				<Restrict
					to={[UserRole.Administrador, UserRole.Administrativo]}
					fallback={
						<Alert severity="info" variant="outlined">
							<Typography variant="body1">No tiene permisos para ver esta información.</Typography>
						</Alert>
					}>
					<AdministrativeInfo
						student={student}
						onChange={debouncedSetStudent}
						editable={isEditable}
						translator={translator}
						setWarnings={(warning: string[]): void => {
							const newWarnings = warnings.slice();
							newWarnings[3] = warning;
							setWarnings(newWarnings);
						}}
					/>
				</Restrict>
			),
		},
		{
			label: "Boletines",
			dataCY: "reportCardListTab",
			panel: (
				<Restrict
					to={[UserRole.Docente, UserRole.Adscripto, UserRole.Director, UserRole.Administrador]}
					fallback={
						<Alert severity="info" variant="outlined">
							<Typography variant="body1">No tiene permisos para ver esta información.</Typography>
						</Alert>
					}>
					<ReportCardList //
						student={student}
						editable={isEditable}
						canAdd={isEditable}
						canDelete={restrictEditionTo([UserRole.Director, UserRole.Administrador], isEditable)}
						canApprove={restrictEditionTo([UserRole.Director, UserRole.Administrador], isEditable)}
					/>
				</Restrict>
			),
		},
	].filter(({ label, panel }) => {
		switch (mode) {
			case StudentPageMode.create:
				return createTabs.includes(label);

			case StudentPageMode.view:
				return viewTabs.includes(label);

			case StudentPageMode.edit:
				return editableTabs.includes(label);
			default:
				return false;
		}
	});

	if (fetchState === FetchState.loading) return <CircularProgress />;

	if (fetchState === FetchState.failure)
		return (
			<Alert severity="error" variant="outlined" onClick={getStudent} style={{ cursor: "pointer" }}>
				<Typography>No se pudo cargar el alumno. Clickear aquí para reintentar.</Typography>
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

			<StudentPageTabs
				tabData={tabsData}
				onChange={(newValue: number) => {
					const newWarnings = warnings.slice();
					newWarnings[currentTabIndex] = [];
					setWarnings(newWarnings);
					setCurrentTabIndex(newValue);
				}}
				value={currentTabIndex}
			/>

			{tabsData.map(({ panel }, index) => (
				<TabPanel key={`student-tab-panel-${index}`} className="panel-item" value={currentTabIndex} index={index}>
					{panel}
				</TabPanel>
			))}

			{[StudentPageMode.create, StudentPageMode.edit].includes(mode) && (
				<CreateStudentDialog student={student} mode={mode} warnings={warnings[currentTabIndex]} />
			)}
		</Card>
	);
}
