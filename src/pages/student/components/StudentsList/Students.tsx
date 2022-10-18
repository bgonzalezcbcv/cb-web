/*eslint-disable*/
import _ from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataGrid, GridApi, GridCellValue, GridColDef } from "@mui/x-data-grid";

import * as APIStore from "../../../../core/ApiStore";
import { emptyStudents, defaultStudents } from "../../DefaultStudent";
import { Student as StudentModel } from "../../../../core/Models";
import { Alert, Autocomplete, Box, Button, Card, CircularProgress, Input, Paper, TextField, Typography } from "@mui/material";

import "./StudentsList.scss";

enum FetchState {
	initial = "initial",
	loading = "loading",
	failure = "failure",
}

const columns: GridColDef[] = [
	{ field: "id", headerName: "ID", disableColumnMenu: false, flex: 1 },
	{ field: "ci", headerName: "CI", disableColumnMenu: false, flex: 2 },
	{ field: "name", headerName: "Nombres", disableColumnMenu: false, flex: 2 },
	{ field: "surname", headerName: "Apellidos", disableColumnMenu: false, flex: 2 },
	//{ field: "", headerName: "Grupo", disableColumnMenu: true, flex: 1 }, TODO change here when implemented
	//{ field: "", headerName: "Sub Grupo", disableColumnMenu: true, flex: 1 }, TODO change here when implemented
	{
		field: "",
		headerName: "Ir al alumno",
		align: "center",
		sortable: false,
		disableColumnMenu: true,
		flex: 1,
		renderCell: (params) => {
			let navigate = useNavigate();

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

const SearchComponent = ({ searchText, onSearch }: { searchText: string; onSearch: any }) => (
	<>
		<Input style={{ flex: 3, marginRight: "10%" }} id="search" type="text" placeholder="Buscar..." value={searchText} onChange={onSearch} />
	</>
);

export default function StudentsList() {
	const [students, setStudents] = useState<StudentModel[]>(defaultStudents);
	const [fetchState, setFetchState] = React.useState(FetchState.loading);

	const grupos = ["Todos", "3A", "3B", "3C", "3D"];

	const getStudents = useCallback(async (): Promise<void> => {
		setFetchState(FetchState.loading);

		const response = await APIStore.fetchStudents();

		if (response.success && response.data) {
			setStudents(_.merge(emptyStudents, response.data));
			setFetchState(FetchState.initial);
		} else setFetchState(FetchState.failure);
	}, [setFetchState, setStudents]);

	useEffect((): void => {
		getStudents();
	}, []);

	const [searchText, setSearchText] = React.useState("");
	const foundItems = students.filter(
		(item) =>
			(item.name + item.surname + item.ci)
				.normalize("NFD")
				.replace(/[\u0300-\u036f]/g, "")
				.replace(/\s+/g, "")
				.toLowerCase()
				.indexOf(
					searchText
						.normalize("NFD")
						.replace(/[\u0300-\u036f]/g, "")
						.replace(/\s+/g, "")
						.toLowerCase()
				) !== -1
	);

	return (
		<Card
			sx={{
				width: "90%",
				padding: "20px",
				alignSelf: "flex-start",
				marginTop: "20px",
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
				boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
			}}>
			<Box display="flex" justifyContent="flex-start" width="100%">
				<Typography variant="h4">Alumnos</Typography>
			</Box>
			<Box className="SearchAndGroupFilter">
				<SearchComponent onSearch={(e: React.ChangeEvent<any>) => setSearchText(e.target.value)} searchText={searchText} />
				<Autocomplete
					style={{ width: 200, flex: 1 }}
					options={grupos}
					renderInput={(params) => <TextField {...params} label="Filtrar por grupo" variant="outlined" />}
				/>
			</Box>
			<Paper>
				{(() => {
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
							return (
								<DataGrid style={{ height: 380, width: "100%" }} rows={foundItems} columns={columns} pageSize={5} rowsPerPageOptions={[5]} />
							);
					}
				})()}
			</Paper>
		</Card>
	);
}
