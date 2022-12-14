import React, { useCallback, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { JsonForms } from "@jsonforms/react";
import { Translator } from "@jsonforms/core";
import { materialCells, materialRenderers } from "@jsonforms/material-renderers";
import {
	Alert,
	Box,
	Button,
	Card,
	CircularProgress,
	FormControl,
	FormHelperText,
	IconButton,
	InputLabel,
	MenuItem,
	Paper,
	Select,
	Typography,
} from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import VisibilityIcon from "@mui/icons-material/Visibility";

import { Grade, Group } from "../../core/Models";
import * as APIStore from "../../core/ApiStore";
import { restrictEditionTo } from "../../core/userRoleHelper";
import { UserRole } from "../../core/interfaces";
import useFetchFromAPI, { FetchStatus } from "../../hooks/useFetchFromAPI";
import Restrict from "../../components/Restrict/Restrict";
import Modal from "../../components/modal/Modal";
import UserList from "./components/UserList";
import AddUser from "./components/AddUser";
import NumericInputControl, { NumericInputControlTester } from "../../components/NumericInput/NumericInputControl";

import schema from "./schema.json";
import uischema from "./ui.json";

import "./Groups.scss";

type GroupData = {
	gradeId: string;
	name: string;
	year: string;
};

interface GroupsProps {
	rows?: Group[];
}

const renderers = [...materialRenderers, { tester: NumericInputControlTester, renderer: NumericInputControl }];

export default function Groups(props: GroupsProps): React.ReactElement {
	const columns: GridColDef[] = [
		{
			field: "grade",
			headerName: "Clase",
			disableColumnMenu: false,
			width: 110,
			align: "center",
			valueGetter: (params): string => {
				const grade = params.value;
				return grade ? grade.name : "";
			},
		},
		{ field: "name", headerName: "Subgrupo", disableColumnMenu: false, width: 110, align: "center" },
		{ field: "year", headerName: "Año", disableColumnMenu: false, width: 110, align: "center" },
		{
			field: "teachers",
			headerName: "Docentes",
			flex: 1,
			align: "center",
			sortable: false,
			disableColumnMenu: true,
			renderCell: (params): React.ReactNode => {
				if (params.value === undefined || params.value?.length === 0) {
					return (
						<Box className="teachers-wrapper">
							<Typography fontSize={12}>Sin docentes asignados</Typography>
						</Box>
					);
				}

				return <UserList users={params.value} />;
			},
		},
		{
			field: "addTeachers",
			headerName: "Agregar docentes",
			sortable: false,
			disableColumnMenu: true,
			hide: !restrictEditionTo([UserRole.Administrador, UserRole.Director], true),
			width: 150,
			align: "center",
			renderCell: (params: GridRenderCellParams): React.ReactNode => {
				return <AddUser params={params} role={"teacher"} />;
			},
		},
		{
			field: "principals",
			headerName: "Directores",
			sortable: false,
			disableColumnMenu: true,
			flex: 1,
			renderCell: (params): React.ReactNode => {
				if (params.value === undefined || params.value?.length === 0) {
					return (
						<Box className="teachers-wrapper">
							<Typography fontSize={12}>Sin directores asignados</Typography>
						</Box>
					);
				}

				return <UserList users={params.value} />;
			},
		},
		{
			field: "addPrincipals",
			headerName: "Agregar directores",
			sortable: false,
			disableColumnMenu: true,
			width: 150,
			hide: !restrictEditionTo([UserRole.Administrador], true),
			align: "center",
			renderCell: (params): React.ReactNode => {
				return <AddUser params={params} role={"principal"} />;
			},
		},
		{
			field: "support_teachers",
			headerName: "Adscriptos",
			sortable: false,
			disableColumnMenu: true,
			flex: 1,
			renderCell: (params): React.ReactNode => {
				if (params.value === undefined || params.value?.length === 0) {
					return (
						<Box className="teachers-wrapper">
							<Typography fontSize={12}>Sin adscriptos asignados</Typography>
						</Box>
					);
				}

				return <UserList users={params.value} />;
			},
		},
		{
			field: "addSupportTeachers",
			headerName: "Agregar adscriptos",
			sortable: false,
			disableColumnMenu: true,
			width: 150,
			hide: !restrictEditionTo([UserRole.Administrador, UserRole.Director], true),
			align: "center",
			renderCell: (params): React.ReactNode => {
				return <AddUser params={params} role={"support_teacher"} />;
			},
		},
		{
			field: "id",
			headerName: "Ver estudiantes",
			align: "center",
			sortable: false,
			width: 120,
			disableColumnMenu: true,
			renderCell: (params): React.ReactNode => {
				const navigate = useNavigate();
				const id: string = params.value;

				const onClick = (): void => {
					navigate(`/students/${id}`);
				};
				return (
					<IconButton onClick={onClick}>
						<VisibilityIcon />
					</IconButton>
				);
			},
		},
	];

	const { rows } = props;
	const { id } = useParams();

	const [groups, setGroups] = useState<Group[]>(rows ?? []);
	const [createGroupModalOpen, setCreateGroupModalOpen] = React.useState(false);
	const [groupData, setGroupData] = React.useState<GroupData>({ name: "A" } as GroupData);
	const [hasFormErrors, setHasFormErrors] = useState<boolean>(false);
	const [grades, setGrades] = useState<Grade[] | undefined>(undefined);

	const { refetch, fetchStatus } = useFetchFromAPI(() => APIStore.fetchGroups(id), setGroups, !rows);

	const translator = (id: string, defaultMessage: string): string => {
		if (id.includes("required")) return "Este campo es requerido.";
		if (id.includes("[A-Z]")) return "Debe ser una letra mayúscula.";
		else return defaultMessage;
	};

	const handleCreateGroupModalOpen = useCallback(async () => {
		const gradesResponse = await APIStore.fetchGrades();

		if (gradesResponse.success && gradesResponse.data) {
			setGrades(gradesResponse.data);
		}

		setCreateGroupModalOpen(true);
	}, []);

	const handleCreateGroupModalAccept = useCallback(async () => {
		const request = {
			gradeId: groupData.gradeId,
			groupName: groupData.name,
			groupYear: groupData.year,
		};

		const response = await APIStore.createGroup(request);

		await refetch();

		response && setCreateGroupModalOpen(false);
		setGroupData({} as GroupData);
	}, [groupData, grades]);

	const handleCreateGroupModalClose = useCallback(() => {
		setCreateGroupModalOpen(false);
		setGroupData({ name: "A" } as GroupData);
	}, []);

	function setData(data: GroupData, hasErrors: boolean): void {
		setGroupData(data);
		setHasFormErrors(hasErrors);
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
					<DataGrid //
						style={{ width: "100%" }}
						rows={groups}
						columns={columns}
						pageSize={10}
						rowsPerPageOptions={[5]}
						rowHeight={100}
					/>
				);
			default:
				return null;
		}
	}, [fetchStatus, groups]);

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
			<Box display="flex" justifyContent="space-between" width="100%" marginBottom="30px">
				<Typography variant="h4">Grupos</Typography>
				<Restrict to={[UserRole.Administrador]}>
					<Button variant={"outlined"} onClick={handleCreateGroupModalOpen}>
						Crear grupo
					</Button>
				</Restrict>
			</Box>

			<Paper sx={{ height: "75vh" }}>{printTable()}</Paper>

			<Modal
				show={createGroupModalOpen}
				title={"Crear grupo"}
				onClose={handleCreateGroupModalClose}
				onAccept={handleCreateGroupModalAccept}
				acceptEnabled={!hasFormErrors}>
				<Box display="flex" flexDirection="row">
					<FormControl variant="standard" sx={{ marginRight: 9 }} error={groupData.gradeId === undefined}>
						<InputLabel id="grade">Clase</InputLabel>

						<Select
							labelId="grade"
							variant="standard"
							label="Clase"
							value={groupData.gradeId}
							style={{ width: 150 }}
							onChange={(e): void => {
								const { value } = e.target;
								const newGrade = { ...groupData, gradeId: value };
								setData(newGrade, false);
							}}>
							{grades &&
								grades?.map((grade) => {
									return (
										<MenuItem key={grade.id} value={grade.id}>
											{grade.name}
										</MenuItem>
									);
								})}
						</Select>
						{groupData.gradeId === undefined && <FormHelperText>Este campo es requerido.</FormHelperText>}
					</FormControl>

					<JsonForms
						i18n={{ translate: translator as Translator }}
						schema={schema}
						uischema={uischema}
						data={groupData}
						renderers={renderers}
						onChange={({ data, errors }): void => {
							setData(data, errors ? errors.length !== 0 : false);
						}}
						cells={materialCells}
					/>
				</Box>
			</Modal>
		</Card>
	);
}
