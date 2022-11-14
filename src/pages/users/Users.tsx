/*eslint-disable*/
import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Alert, Box, Button, Card, CircularProgress, Link, Paper, Typography } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

import * as APIStore from "../../core/ApiStore";
import { UserRole } from "../../core/interfaces";
import { UserInfo } from "../../core/Models";
import useFetchFromAPI, { FetchStatus } from "../../hooks/useFetchFromAPI";
import useIsAuthenticated from "../../hooks/useIsAuthenticated";

export default function Users() {
	const [users, setUsers] = useState<UserInfo[]>([]);

	useIsAuthenticated([UserRole.Administrador]);

	const { fetchStatus, refetch } = useFetchFromAPI(() => APIStore.fetchUsers(), setUsers);

	const navigate = useNavigate();

	function navigateToUser(id: number): () => void {
		return () => navigate(`/user/${id}/edit`);
	}

	const columns: GridColDef[] = [
		{ field: "name", headerName: "Nombres", disableColumnMenu: false, flex: 2 },
		{ field: "surname", headerName: "Apellidos", disableColumnMenu: false, flex: 2 },
		{ field: "email", headerName: "Email", disableColumnMenu: false, flex: 2, renderCell: ({ value }) => <Link href={`mailto:${value}`}>{value}</Link> },
		{
			field: "id",
			headerName: "Ir al usuario",
			align: "center",
			sortable: false,
			disableColumnMenu: true,
			flex: 1,
			renderCell: ({ value }) => {
				return (
					<Button onClick={navigateToUser(value)}>
						<PersonIcon />
					</Button>
				);
			},
		},
	];

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
						<Alert severity="error" variant="outlined" onClick={refetch} style={{ cursor: "pointer" }}>
							Falló la carga de usuarios. Haga click para reintentar.
						</Alert>
					</Box>
				);
			case FetchStatus.Initial:
				return (
					<DataGrid //
						rows={users}
						columns={columns}
						pageSize={12}
						rowsPerPageOptions={[10]}
					/>
				);
			default:
				return null;
		}
	}, [fetchStatus, users, columns]);

	return (
		<Card
			sx={{
				width: "90%",
				padding: "20px",
				height: "90%",
				alignSelf: "flex-start",
				marginTop: "20px",
				display: "flex",
				flexDirection: "column",
				boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
				gap: "20px",
			}}>
			<Box display="flex" justifyContent="flex-start" width="100%">
				<Typography variant="h4">Usuarios</Typography>
			</Box>

			<Paper style={{ height: "100%" }}>
				<Box display="flex" justifyContent="center" alignItems="center" width="100%" height="100%">
					{printTable()}
				</Box>
			</Paper>
		</Card>
	);
}
