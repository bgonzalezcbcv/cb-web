/*eslint-disable*/
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataGrid, GridApi, GridCellValue, GridColDef } from "@mui/x-data-grid";
import ReactLoading from "react-loading";

import * as APIStore from "../../../../core/ApiStore";
import { emptyStudents, defaultStudents } from "../../DefaultStudent";
import { Student as StudentModel } from "../../../../core/Models";
import _ from "lodash";
import { Alert, Autocomplete, Box, Button, Input, Paper, TextField } from "@mui/material";

import "./StudentsList.scss";

enum FetchState {
	initial = "initial",
	loading = "loading",
	failure = "failure",
}

const Example = ({ type, color }: { type: any; color: string }) => <ReactLoading type={type} color={color} height={"80px"} width={"80px"} />;

const columns: GridColDef[] = [
	{ field: "id", headerName: "ID", disableColumnMenu: true, flex: 1 },
	{ field: "ci", headerName: "CI", disableColumnMenu: true, flex: 2 },
	{ field: "name", headerName: "Nombres", disableColumnMenu: true, flex: 2 },
	{ field: "surname", headerName: "Apellidos", disableColumnMenu: true, flex: 2 },
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
				e.stopPropagation(); // don't select this row after clicking

				const api: GridApi = params.api;
				const thisRow: Record<string, GridCellValue> = {};

				api.getAllColumns()
					.filter((c: any) => c.field !== "__check__" && !!c)
					.forEach((c: any) => (thisRow[c.field] = params.getValue(params.id, c.field)));
				navigate("/student/" + thisRow.id);
				//return alert(thisRow.ci);
				//return (handleOnClick(thisRow.id));
			};
			return <Button onClick={onClick}>Ir</Button>;
		},
	},
];

const FilterComponent = ({ filterText, onFilter }: { filterText: string; onFilter: any }) => (
	<>
		<Input style={{ flex: 3, marginRight: "10%" }} id="search" type="text" placeholder="Buscar..." value={filterText} onChange={onFilter} />
	</>
);

export default function StudentsList() {
	const [loading, setIsLoading] = useState(false);
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

	const [filterText, setFilterText] = React.useState("");
	const filteredItems = students.filter(
		(item) =>
			(item.name + item.surname + item.ci)
				.normalize("NFD")
				.replace(/[\u0300-\u036f]/g, "")
				.replace(/\s+/g, "")
				.toLowerCase()
				.indexOf(
					filterText
						.normalize("NFD")
						.replace(/[\u0300-\u036f]/g, "")
						.replace(/\s+/g, "")
						.toLowerCase()
				) !== -1
	);

	return (
		<Box style={{ height: 465, width: "90%" }}>
			<Paper className="SearchAndGroupFilter">
				<FilterComponent onFilter={(e: React.ChangeEvent<any>) => setFilterText(e.target.value)} filterText={filterText} />
				<Autocomplete
					style={{ width: 200, flex: 1 }}
					options={grupos}
					renderInput={(params) => <TextField {...params} label="Filtrar por grupo" variant="outlined" />}
				/>
			</Paper>
			<Paper>
				{(() => {
					switch (fetchState) {
						case "loading":
							return (
								<div style={{ padding: "20px", display: "flex", justifyContent: "center", alignItems: "center" }}>
									<Example type={"spin"} color={"rgb(165 165 165)"} />
								</div>
							);
						case "failure":
							return (
								<div style={{ padding: "20px", display: "flex", justifyContent: "center", alignItems: "center" }}>
									<Alert severity="error" variant="outlined">
										Falló la carga de alumnos.
									</Alert>
								</div>
							);
						case "initial":
							return filteredItems.length != 0 ? (
								<DataGrid style={{ height: 380, width: "100%" }} rows={filteredItems} columns={columns} pageSize={5} rowsPerPageOptions={[5]} />
							) : (
								<h4 style={{ display: "flex", height: 80, justifyContent: "center", alignItems: "center", color: "rgb(165 165 165)" }}>
									No hay alumnos para mostrar
								</h4>
							);
					}
				})()}
			</Paper>
		</Box>
	);
}
