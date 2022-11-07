import React, { useCallback, useEffect, useState } from "react";

import { JsonForms } from "@jsonforms/react";
import { materialCells, materialRenderers } from "@jsonforms/material-renderers";
import { Translator } from "@jsonforms/core";
import { Group, Student, StudentGroup } from "../../../../core/Models";
import NumericInputControl, { NumericInputControlTester } from "../../../../components/NumericInput/NumericInputControl";
import { Container, FormControl, InputLabel, Select, MenuItem, Box, CircularProgress, Alert, Typography } from "@mui/material";
import useFetchFromAPI, { FetchStatus } from "../../../../hooks/useFetchFromAPI";
import * as APIStore from "../../../../core/ApiStore";

import { ajv as studentAjv } from "../../../../core/AJVHelper";

import uischema from "./ui.json";
import uischemaCreate from "./uiCreate.json";
import schema from "../../schema.json";

import "./StudentInfo.scss";

export type StudentInfoProps = {
	student: Student;
	onChange: (data: Student, debounce?: boolean) => void;
	editable: boolean;
	translator?: (id: string, defaultMessage: string) => string;
	isCreating: boolean;
};

const renderers = [...materialRenderers, { tester: NumericInputControlTester, renderer: NumericInputControl }];

export default function StudentInfo(props: StudentInfoProps): React.ReactElement {
	const { editable, student, translator, onChange, isCreating } = props;
	const [groups, setGroups] = useState<Group[]>([]);
	const [filteredGroups, setFilteredGroups] = useState<Group[]>([]);

	const { refetch, fetchStatus } = useFetchFromAPI(() => APIStore.fetchGroups(), setGroups, true);

	useEffect(() => {
		const newFiltered = [] as Group[];
		const thisYear = new Date().getFullYear().toString();
		const nextYear = (new Date().getFullYear() + 1).toString();
		groups.forEach((group) => {
			if (group.year == thisYear || group.year == nextYear || group.id == student.group?.id) newFiltered.push(group);
		});
		setFilteredGroups(newFiltered);
	}, [groups]);

	function generateStudentGroup(index: number, groups: Group[]): StudentGroup {
		if (index < 0 || index >= groups.length) return {} as StudentGroup;
		return {
			id: groups[index].id,
			name: groups[index].name,
			year: groups[index].year,
			grade_name: groups[index].grade.name,
		} as StudentGroup;
	}

	function getIndexOfGroupWithId(studentGroup: StudentGroup, groups: Group[]): number | string {
		let returnIndex = "" as number | string;
		if (!studentGroup) return returnIndex;
		groups.forEach((element, index) => {
			if (element.id == studentGroup.id) {
				returnIndex = index;
				return;
			}
		});
		return returnIndex;
	}

	const printTable = useCallback((): JSX.Element | null => {
		switch (fetchStatus) {
			case FetchStatus.Fetching:
				return (
					<Box className="loading-container">
						<CircularProgress />
					</Box>
				);
			case FetchStatus.Error:
				return (
					<Box className="loading-container">
						<Alert variant="outlined" severity="error" style={{ cursor: "pointer" }} onClick={refetch}>
							<Typography>No se pudieron obtener los grupos. Haga click aquí para reintentar.</Typography>
						</Alert>
					</Box>
				);
			case FetchStatus.Initial:
				return (
					<Select
						labelId="group"
						id="group"
						label="Grupo"
						value={getIndexOfGroupWithId(student.group, filteredGroups)}
						disabled={!editable}
						onChange={(event): void => {
							const newStudent = { ...student, group: generateStudentGroup(event.target.value as number, filteredGroups) };
							onChange(newStudent, false);
						}}>
						{filteredGroups.map((value, index) => {
							return (
								<MenuItem key={index} value={index}>
									{`${value.grade.name} ${value.name} (${value.year})`}
								</MenuItem>
							);
						})}
					</Select>
				);
			default:
				return null;
		}
	}, [fetchStatus, groups, editable, student]);

	return (
		<Container style={{ paddingTop: "30px" }}>
			<JsonForms
				i18n={{ translate: translator as Translator }}
				ajv={studentAjv}
				schema={schema}
				uischema={isCreating ? uischemaCreate : uischema}
				data={student}
				renderers={renderers}
				validationMode={editable ? "ValidateAndShow" : "ValidateAndHide"}
				onChange={({ data }): void => {
					onChange(data);
				}}
				readonly={!editable}
				cells={materialCells}
			/>
			<FormControl variant="standard" sx={{ width: "100%" }}>
				<InputLabel id="group-label">Grupo</InputLabel>
				{printTable()}
			</FormControl>
		</Container>
	);
}
