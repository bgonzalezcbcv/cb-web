/*eslint-disable*/
import _ from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { DataGrid, GridApi, GridCellValue, GridColDef } from "@mui/x-data-grid";
import { Alert, Box, Button, Card, CircularProgress, Input, Paper, TextField, Typography } from "@mui/material";
import * as APIStore from "../../../core/ApiStore";
import { FetchState } from "../../../core/interfaces";
import { normalizeText, apiDateToDisplayDate } from "../../../core/CoreHelper";
import { InactiveStudentInfo as StudentModel } from "../../../core/Models";
import { emptyStudents } from "../../student/DefaultStudent";

import "../Students.scss";
const columns: GridColDef[] = [
	{ field: "id", headerName: "ID", disableColumnMenu: true, flex: 1, hide: true },
	{ field: "ci", headerName: "CI", disableColumnMenu: false, flex: 1 },
	{ field: "name", headerName: "Nombres", disableColumnMenu: false, flex: 2 },
	{ field: "surname", headerName: "Apellidos", disableColumnMenu: false, flex: 2 },
	{
		field: "date",
		headerName: "Fecha de baja",
		disableColumnMenu: false,
		flex: 1,
		valueGetter: (params) =>
			params.row.last_motive_inactivate
				? params.row.last_motive_inactivate.last_day
					? apiDateToDisplayDate(params.row.last_motive_inactivate.last_day)
					: ""
				: "",
	},
	{
		field: "motive",
		headerName: "Motivo",
		disableColumnMenu: false,
		flex: 2,
		valueGetter: (params) => (params.row.last_motive_inactivate ? params.row.last_motive_inactivate.motive : ""),
	},
	{
		field: "description",
		headerName: "Descripción",
		disableColumnMenu: false,
		flex: 2,
		valueGetter: (params) => (params.row.last_motive_inactivate ? params.row.last_motive_inactivate.description : ""),
	},
	{
		field: "",
		headerName: "Ir al alumno",
		align: "center",
		sortable: false,
		disableColumnMenu: true,
		flex: 1,
		renderCell: (params) => {
			const navigate = useNavigate();

			const onClick = (e: any) => {
				e.stopPropagation();

				const api: GridApi = params.api;
				const thisRow: Record<string, GridCellValue> = {};

				api.getAllColumns()
					.filter((c: any) => c.field !== "__check__" && !!c)
					.forEach((c: any) => (thisRow[c.field] = params.getValue(params.id, c.field)));
				navigate("/student/" + thisRow.id);
			};
			return <Button onClick={onClick}>Ir</Button>; //Link component
		},
	},
];

export default function InactiveStudents() {
	const [students, setStudents] = useState<StudentModel[]>([]);
	const [fetchState, setFetchState] = React.useState(FetchState.initial);
	const [searchText, setSearchText] = React.useState("");

	const getStudents = useCallback(async (): Promise<void> => {
		setFetchState(FetchState.loading);

		const response = await APIStore.fetchInactiveStudents();

		if (response.success && response.data) {
			setStudents(response.data);
			setFetchState(FetchState.initial);
		} else setFetchState(FetchState.failure);
	}, [setFetchState, setStudents]);

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
			case "initial":
				const foundItems = students.filter(
					(student) =>
						Object.values(student).some((value) => value && normalizeText(value.toString()).includes(normalizeText(searchText))) ||
						Object.values(student.last_motive_inactivate).some(
							(value) => value && normalizeText(value.toString()).includes(normalizeText(searchText))
						)
				);

				return (
					<DataGrid //
						style={{ height: 380, width: "100%" }}
						rows={foundItems}
						columns={columns}
						pageSize={5}
						rowsPerPageOptions={[5]}
						initialState={{
							sorting: {
								sortModel: [{ field: "date", sort: "asc" }],
							},
						}}
					/>
				);
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
				<Typography variant="h4">Alumnos Inactivos</Typography>
			</Box>

			<Box className="SearchAndGroupFilter">
				<Input
					style={{ flex: 3, marginRight: "10%" }}
					id="search"
					type="text"
					placeholder="Buscar..."
					value={searchText}
					onChange={(e: React.ChangeEvent<any>) => setSearchText(e.target.value)}
				/>
			</Box>

			<Paper>{printTable()}</Paper>
		</Card>
	);
}
