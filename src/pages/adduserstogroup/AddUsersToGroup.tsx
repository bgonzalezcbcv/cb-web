/*eslint-disable*/
import React, { useCallback, useState } from "react";

import {DataGrid, GridColDef, GridRenderCellParams} from "@mui/x-data-grid";
import * as APIStore from "../../core/ApiStore";
import { Alert, Box, Button, Card, CircularProgress, Input, Paper, Typography } from "@mui/material";
import useFetchFromAPI, { FetchStatus } from "../../hooks/useFetchFromAPI";
import { Group, UserInfo } from "../../core/Models";
import { UserRole } from "../../core/interfaces";
import { useParams } from "react-router-dom";

export default function AddUsersToGroup() {
	const { role, id } = useParams();

	const groupId = id;

	const userRoleName = role === "teacher" ? "docentes" : role === "principal" ? "directores" : "adscriptos";

	const [users, setUsers] = useState<UserInfo[]>([]);
	const [searchText, setSearchText] = React.useState("");

	const fetchFunction = role === "teacher" ? () => APIStore.fetchTeachers() : role === "principal" ? () => APIStore.fetchPrincipals() : () => APIStore.fetchSupportTeachers();

	const { fetchStatus, refetch } = useFetchFromAPI(fetchFunction, setUsers);

	const onClickAdd = async (params: GridRenderCellParams) => {
		if (!groupId) return;

		const userId = params.row.id;

		const userRole = role === "teacher" ? UserRole.Docente : role === "principal" ? UserRole.Director : UserRole.Adscripto;

		await APIStore.addUserToGroup(userId, groupId, userRole);
		refetch();
	};

	const onClickRemove = async (params: GridRenderCellParams) => {
		if (!groupId) return;

		const userId = params.row.id;

		const userRole = role === "teacher" ? UserRole.Docente : role === "principal" ? UserRole.Director : UserRole.Adscripto;

		await APIStore.removeUserFromGroup(userId, groupId, userRole);
		refetch();
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
			renderCell: (params: GridRenderCellParams) => {
				const isInGroup = (params.row.groups as Group[]).find((group) => Number(group.id) === Number(groupId));

				return isInGroup ? (
					<Button
						variant="contained"
						color="error"
						style={{ maxWidth: "10px", maxHeight: "20px", minWidth: "10px", minHeight: "20px" }}
						onClick={() => onClickRemove(params)}>
						-
					</Button>
				) : (
					<Button
						variant="contained"
						color="success"
						style={{ maxWidth: "10px", maxHeight: "20px", minWidth: "10px", minHeight: "20px" }}
						onClick={() => onClickAdd(params)}>
						+
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
							{`Falló la carga de ${userRoleName}. Clickear aquí para reintentar.`}
						</Alert>
					</Box>
				);
			case FetchStatus.Initial:
				const foundItems = users.filter((user) =>
					Object.values(user).some((value) => value && toNoFormatText(value.toString()).includes(toNoFormatText(searchText)))
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
	}, [fetchStatus, users, searchText]);

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
				<Typography variant="h4">{`Agregar ${userRoleName}`}</Typography>
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
