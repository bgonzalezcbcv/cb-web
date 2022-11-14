/*eslint-disable*/
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Alert, Box, Button, Card, CircularProgress, Input, Paper, Typography } from "@mui/material";
import * as APIStore from "../../core/ApiStore";
import { FetchState } from "../../core/interfaces";
import { normalizeText } from "../../core/CoreHelper";
import { Student as StudentModel } from "../../core/Models";

import "./Students.scss";

const columns: GridColDef[] = [
	{ field: "reference_number", headerName: "Nº de referencia", disableColumnMenu: false, flex: 1 },
	{ field: "ci", headerName: "CI", disableColumnMenu: false, flex: 2 },
	{ field: "name", headerName: "Nombres", disableColumnMenu: false, flex: 2 },
	{ field: "surname", headerName: "Apellidos", disableColumnMenu: false, flex: 2 },
	{
		field: "group",
		headerName: "Grupo",
		disableColumnMenu: true,
		flex: 1,
		valueGetter: (params): string => {
			const group = params.value;
			return group ? group.grade_name + " " + group.name + " " + group.year : "";
		},
	},
	{
		field: "id",
		headerName: "Ir al alumno",
		align: "center",
		sortable: false,
		disableColumnMenu: true,
		flex: 1,
		renderCell: (params) => {
			let navigate = useNavigate();

			const onClick = () => {
				const id = params.value;

				navigate(`/student/${id}/edit`);
			};
			return <Button onClick={onClick}>Ir</Button>;
		},
	},
];

interface StudentsProps {
	title?: string;
	rows?: StudentModel[];
}

export default function Students(props: StudentsProps) {
	const { title, rows } = props;
	const { id, groupId } = useParams();

	const [students, setStudents] = useState<StudentModel[]>(rows ?? []);
	const [fetchState, setFetchState] = React.useState(FetchState.initial);
	const [searchText, setSearchText] = React.useState("");

	const getStudents = useCallback(async (): Promise<void> => {
		if (rows) return;

		setFetchState(FetchState.loading);

		const response = await APIStore.fetchStudents(id, groupId);

		if (response.success && response.data) {
			setStudents(response.data);
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
			case "initial":
				const foundItems = students.filter((student) =>
					Object.values(student).some((value) => value && normalizeText(value.toString()).includes(normalizeText(searchText)))
				);

				return (
					<DataGrid //
						style={{ height: "100%", width: "100%" }}
						rows={foundItems}
						columns={columns}
						pageSize={12}
						rowsPerPageOptions={[5]}
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
				height: "90%",
				padding: "20px",
				alignSelf: "flex-start",
				marginTop: "20px",
				display: "flex",
				flexDirection: "column",
				boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
			}}>
			<Box display="flex" justifyContent="flex-start" width="100%">
				<Typography variant="h4">{title ?? "Alumnos"}</Typography>
			</Box>

			<Box className="SearchAndGroupFilter">
				<Input
					style={{ flex: 3, width: "100%" }}
					id="search"
					type="text"
					placeholder="Buscar..."
					value={searchText}
					onChange={(e: React.ChangeEvent<any>) => setSearchText(e.target.value)}
				/>
			</Box>

			<Paper style={{ height: "100%" }}>{printTable()}</Paper>
		</Card>
	);
}
