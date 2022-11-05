import _ from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { DataGrid, GridApi, GridCellValue, GridColDef } from "@mui/x-data-grid";
import { Alert, Box, Button, Card, CircularProgress, Input, Paper, Typography } from "@mui/material";
import * as APIStore from "../../core/ApiStore";
import { FetchState } from "../../core/interfaces";
import { normalizeText } from "../../core/CoreHelper";
import { Student as StudentModel } from "../../core/Models";
import { emptyStudents } from "../student/DefaultStudent";

import "./Students.scss";
const columns: GridColDef[] = [
	{ field: "id", headerName: "ID", disableColumnMenu: false, flex: 1 },
	{ field: "ci", headerName: "CI", disableColumnMenu: false, flex: 2 },
	{ field: "name", headerName: "Nombres", disableColumnMenu: false, flex: 2 },
	{ field: "surname", headerName: "Apellidos", disableColumnMenu: false, flex: 2 },
	{
		field: "",
		headerName: "Ir al alumno",
		align: "center",
		sortable: false,
		disableColumnMenu: true,
		flex: 1,
		renderCell: (params): JSX.Element => {
			const navigate = useNavigate();
			const onClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
				e.stopPropagation();

				const api: GridApi = params.api;
				const thisRow: Record<string, GridCellValue> = {};

				api.getAllColumns()
					.filter((c: GridColDef) => c.field !== "__check__" && !!c)
					.forEach((c: GridColDef) => (thisRow[c.field] = params.getValue(params.id, c.field)));
				navigate("/student/" + thisRow.id);
			};
			return <Button onClick={onClick}>Ir</Button>; //Link component
		},
	},
];

interface StudentsProps {
	rows?: StudentModel[];
}

export default function Students(props: StudentsProps): JSX.Element {
	const { rows } = props;

	const [students, setStudents] = useState<StudentModel[]>(rows ?? []);
	const [fetchState, setFetchState] = React.useState(FetchState.initial);
	const [searchText, setSearchText] = React.useState("");

	const getStudents = useCallback(async (): Promise<void> => {
		if (rows) return;

		setFetchState(FetchState.loading);

		const response = await APIStore.fetchPendingStudents();
		if (response.success && response.data) {
			setStudents(_.merge(emptyStudents, response.data));
			setFetchState(FetchState.initial);
		} else setFetchState(FetchState.failure);
	}, [rows, setFetchState, setStudents]);

	useEffect((): void => {
		getStudents();
	}, []);

	const printTable = useCallback((): JSX.Element | null => {
		switch (fetchState) {
			case "loading":
				return (
					<Box style={{ padding: "20px", display: "flex", justifyContent: "center", alignItems: "center" }}>
						<CircularProgress />
					</Box>
				);
			case "failure":
				return (
					<Box style={{ padding: "20px", display: "flex", justifyContent: "center", alignItems: "center" }}>
						<Alert severity="error" variant="outlined">
							Falló la carga de alumnos.
						</Alert>
					</Box>
				);
			case "initial": {
				const foundItems = students.filter((student: StudentModel) =>
					Object.values(student).some((value) => value && normalizeText(value.toString()).includes(normalizeText(searchText)))
				);

				return <DataGrid style={{ height: 380, width: "100%" }} rows={foundItems} columns={columns} pageSize={5} rowsPerPageOptions={[5]} />;
			}
			default:
				return null;
		}
	}, [fetchState, students, searchText]);

	return (
		<Card
			sx={{
				width: "90%",
				padding: "20px",
				alignSelf: "flex-start",
				marginTop: "20px",
				display: "flex",
				flexDirection: "column",
				boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
			}}>
			<Box display="flex" justifyContent="flex-start" width="100%">
				<Typography variant="h4">Alumnos</Typography>
			</Box>

			<Box className="SearchAndGroupFilter">
				<Input
					style={{ flex: 3, marginRight: "10%" }}
					id="search"
					type="text"
					placeholder="Buscar..."
					value={searchText}
					onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setSearchText(e.target.value)}
				/>
			</Box>

			<Paper>{printTable()}</Paper>
		</Card>
	);
}
