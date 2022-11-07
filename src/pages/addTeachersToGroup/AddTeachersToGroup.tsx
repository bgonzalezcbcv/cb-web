/*eslint-disable*/
import React, { useCallback, useState } from "react";

import { DataGrid, GridApi, GridCellValue, GridColDef } from "@mui/x-data-grid";
import * as APIStore from "../../core/ApiStore";
import { Alert, Box, Button, Card, CircularProgress, Input, Paper, Typography } from "@mui/material";
import useFetchFromAPI, { FetchStatus } from "../../hooks/useFetchFromAPI";
import { Group, UserInfo } from "../../core/Models";

interface TeachersProps {
	rows?: UserInfo[];
	groupName?: string; //por ahora, luego se cambia el tipo
}

export default function AddTeacher(props: TeachersProps) {
	const { rows, groupName } = props;

	const [teachers, setTeachers] = useState<UserInfo[]>(rows ?? []);
	const [searchText, setSearchText] = React.useState("");

	const { fetchStatus, refetch } = useFetchFromAPI(() => APIStore.fetchTeachers(undefined), setTeachers, !rows);

	const onClickAdd = (params: any) => {
		const api: GridApi = params.api;
		const thisRow: Record<string, GridCellValue> = {};

		api.getAllColumns()
			.filter((c: any) => c.field !== "__check__" && !!c)
			.forEach((c: any) => (thisRow[c.field] = params.getValue(params.id, c.field)));
		//endpoint
		alert("No implementado!");
	};

	const onClickRemove = (params: any) => {
		const api: GridApi = params.api;
		const thisRow: Record<string, GridCellValue> = {};

		api.getAllColumns()
			.filter((c: any) => c.field !== "__check__" && !!c)
			.forEach((c: any) => (thisRow[c.field] = params.getValue(params.id, c.field)));
		//endpoint
		alert("No implementado!");
	};

	const columns: GridColDef[] = [
		{ field: "ci", headerName: "CI", disableColumnMenu: false, flex: 2 },
		{ field: "name", headerName: "Nombre", disableColumnMenu: false, flex: 3 },
		{ field: "surname", headerName: "Apellido", disableColumnMenu: false, flex: 3 },
		{
			field: "",
			headerName: "Añadir/Quitar",
			align: "center",
			disableColumnMenu: true,
			sortable: false,
			flex: 1,
			renderCell: (params) => {
				return !((params.row.groups as Group[]) ?? []).find((group): boolean => group.name === groupName) ? (
					<Button
						variant="contained"
						color="success"
						style={{ maxWidth: "10px", maxHeight: "20px", minWidth: "10px", minHeight: "20px" }}
						onClick={() => onClickAdd(params)}>
						+
					</Button>
				) : (
					<Button
						variant="contained"
						color="error"
						style={{ maxWidth: "10px", maxHeight: "20px", minWidth: "10px", minHeight: "20px" }}
						onClick={() => onClickRemove(params)}>
						-
					</Button>
				);
			},
		},
	];

	const toNoFormatText = (str: string) => {
		return str
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "")
			.replace(/ /g, "")
			.toLowerCase();
	};

	const printTable = useCallback((): JSX.Element | null => {
		switch (fetchStatus) {
			case FetchStatus.Fetching:
				return (
					<Box style={{ padding: "20px", display: "flex", justifyContent: "center", alignItems: "center" }}>
						<CircularProgress />
					</Box>
				);
			case FetchStatus.Error:
				return (
					<Box style={{ padding: "20px", display: "flex", justifyContent: "center", alignItems: "center" }}>
						<Alert severity="error" variant="outlined" onClick={refetch}>
							Falló la carga de docentes. Clickear aquí para reintentar.
						</Alert>
					</Box>
				);
			case FetchStatus.Initial:
				const foundItems = teachers.filter((teacher) =>
					Object.values(teacher).some((value) => value && toNoFormatText(value.toString()).includes(toNoFormatText(searchText)))
				);

				return (
					<DataGrid
						style={{ height: 380, width: "100%" }}
						rows={foundItems}
						getRowId={(row) => row.id}
						columns={columns}
						pageSize={5}
						rowsPerPageOptions={[5]}
					/>
				);
			default:
				return null;
		}
	}, [fetchStatus, teachers, searchText]);

	return (
		<Card
			sx={{
				width: "90%",
				padding: "20px",
				alignSelf: "flex-start",
				marginTop: "20px",
				display: "flex",
				flexDirection: "column",
				boxShadow: "rgba(0, 0, 0, 0.25) 0px 3px 8px",
			}}>
			<Box display="flex" justifyContent="flex-start" width="100%">
				<Typography variant="h4"> Grupo:{groupName}</Typography>
				<br></br>
			</Box>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					flexDirection: "row",
					marginBottom: "20px",
					padding: "10px",
				}}>
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
