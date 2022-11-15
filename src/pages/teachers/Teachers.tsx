import _ from "lodash";
import React, { useState } from "react";
import { useParams } from "react-router-dom";

import { Alert, Box, Button, Card, Chip, CircularProgress, Link, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";

import {DataStore} from "../../core/DataStore";
import {UserRole} from "../../core/interfaces";
import { Group, UserInfo } from "../../core/Models";
import { fetchTeachers } from "../../core/ApiStore";
import useFetchFromAPI, { FetchStatus } from "../../hooks/useFetchFromAPI";
import SearchFilter from "../../components/SearchFilter/SearchFilter";

interface TeachersProps {
	editable: boolean;
	canAdd?: boolean;
	canDelete?: boolean;
	teachers?: UserInfo[];
}

function Teachers(props: TeachersProps): JSX.Element {
	const dataStore = DataStore.getInstance();
	const user = dataStore.loggedUser;

	const { teachers: teachersProps, editable, canAdd, canDelete } = props;
	const { id } = useParams();

	const [teachers, setTeachers] = useState(teachersProps);
	const [filteredTeachers, setFilteredTeachers] = useState(teachers);

	const { fetchStatus, refetch } = useFetchFromAPI<UserInfo[]>(
		() => fetchTeachers(id ? Number(id) : undefined),
		(fetchedTeachers) => {
			setTeachers(fetchedTeachers);
			setFilteredTeachers(fetchedTeachers);
		}
	);

	if (fetchStatus === FetchStatus.Fetching) return <CircularProgress />;

	if (fetchStatus === FetchStatus.Error || !teachers || !filteredTeachers)
		return (
			<Alert variant="outlined" severity="error" style={{ cursor: "pointer" }} onClick={refetch}>
				<Typography>No se pudieron obtener los docentes. Haga click aquí para reintentar.</Typography>
			</Alert>
		);

	return (
		<Card
			sx={{
				width: "90%",
				height: "75vh",
				minHeight: "fit-content",
				padding: "20px",
				alignSelf: "flex-start",
				marginTop: "20px",
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
				alignItems: "flex-start",
				boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
				overflow: "auto",
			}}>
			<Box display="flex" flexDirection="column" width="100%" maxWidth="100%" height="fit-content" maxHeight="100%">
				<Box alignSelf="flex-start">
					<Typography variant="h4">Docentes</Typography>
				</Box>

				<Box display="flex">
					<Box justifySelf="flex-start" width="50%">
						<SearchFilter
							items={teachers}
							setItems={setFilteredTeachers}
							filterFunction={(teachers: UserInfo[], filter): UserInfo[] =>
								teachers.filter((teacher) =>
									Object.values(teacher).some((value) => {
										if (_.isString(value)) return value.toUpperCase().includes(filter.toUpperCase());

										if (_.isArray(value) && value.length != 0 && value[0].name) {
											return value.map((item) => item.name.toUpperCase()).includes(filter.toUpperCase());
										}
									})
								)
							}
						/>
					</Box>

					<Box display="flex" justifyContent="flex-end" width="100%">
						{editable && (
							<>
								{(canDelete ?? false) && (
									<Button>
										<DeleteOutlineIcon />
									</Button>
								)}

								{(canAdd ?? false) && (
									<Button>
										<AddIcon />
									</Button>
								)}
							</>
						)}
					</Box>
				</Box>

				<Box height="650px" width="100%" paddingTop="12px">
					<DataGrid
						columns={[
							{ field: "name", headerName: "Nombres", flex: 2 },
							{ field: "surname", headerName: "Apellidos", flex: 2 },
							{
								field: "groups",
								headerName: "Grupos",
								flex: 1,
								renderCell: (cell) => (
									<Box>
										{cell.value?.map((group: Group, index: number) => (
											<Box key={`${group}-${index}`} display="inline-block" paddingLeft="6px">
												<Chip label={group.name} variant="outlined" />
											</Box>
										))}
									</Box>
								),
							},
							{
								field: "profile",
								headerName: "Perfil",
								flex: 1,
								renderCell: (cell) => (
									<Box display="flex" width="100%" justifyContent="center">
										<Link href={cell.value}>
											<AccountCircleIcon />
										</Link>
									</Box>
								),
							},
						]}
						rows={filteredTeachers.map((teacher) => ({
							...teacher,
							groups: teacher.groups ?? [],
							profile: (user?.role === UserRole.Administrador || user?.role === UserRole.Administrativo) ? `/user/${teacher.id}/edit` : `/user/${teacher.id}`,
						}))}
						checkboxSelection={editable}
						pageSize={10}
						rowsPerPageOptions={[10]}
					/>
				</Box>
			</Box>
		</Card>
	);
}

export default Teachers;
