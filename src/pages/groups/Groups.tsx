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
	Tooltip,
	Typography,
} from "@mui/material";
import { DataGrid, GridApi, GridCellValue, GridColDef } from "@mui/x-data-grid";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddIcon from "@mui/icons-material/Add";

import { Grade, Group, User } from "../../core/Models";
import * as APIStore from "../../core/ApiStore";
import useFetchFromAPI, { FetchStatus } from "../../hooks/useFetchFromAPI";
import Modal from "../../components/modal/Modal";
import NumericInputControl, { NumericInputControlTester } from "../../components/NumericInput/NumericInputControl";

import schema from "./schema.json";
import uischema from "./ui.json";

import "./Groups.scss";
import { restrictEditionTo } from "../../core/userRoleHelper";
import { UserRole } from "../../core/interfaces";

type GroupData = {
	gradeId: string;
	name: string;
	year: string;
};

const columns: GridColDef[] = [
	{
		field: "grade",
		headerName: "Clase",
		disableColumnMenu: false,
		width: 120,
		align: "center",
		renderCell: (params): React.ReactNode => {
			const grade = params.value;
			if (grade === undefined) return;

			return <Typography fontSize={12}>{grade.name}</Typography>;
		},
	},
	{ field: "name", headerName: "Subgrupo", disableColumnMenu: false, width: 120, align: "center" },
	{ field: "year", headerName: "Año", disableColumnMenu: false, width: 120, align: "center" },
	{
		field: "teachers",
		headerName: "Docentes",
		flex: 1,
		align: "center",
		sortable: false,
		disableColumnMenu: true,
		renderCell: (params): React.ReactNode => {
			if (params.value?.length === 0) {
				return <Typography fontSize={12}>Sin docentes asignados</Typography>;
			}

			const teachers: User[] = params.value
				.map((teacher: User) => {
					return { name: teacher.name, surname: teacher.surname };
				})
				.sort((a: User, b: User) => (a.surname > b.surname ? 1 : b.surname > a.surname ? -1 : 0));
			const teachersToShow = teachers.length > 3 ? teachers.slice(0, 3) : teachers;

			const tooltipText = (
				<div>
					<Box className="tooltip-text-container">
						{teachers.map((value: { name: string; surname: string }, index: number) => {
							return (
								<Typography key={index} fontSize={12}>
									{value.name + " " + value.surname}
								</Typography>
							);
						})}
					</Box>
				</div>
			);

			return (
				<Tooltip title={tooltipText} arrow>
					<Box className="teachers-wrapper">
						<Box className="teachers-container">
							{teachersToShow.map((value: { name: string; surname: string }, index: number) => {
								return (
									<Typography key={index} fontSize={14}>
										{value.name + " " + value.surname}
									</Typography>
								);
							})}
							{teachers.length > 3 && <Typography fontSize={12} sx={{ marginTop: "5px" }}>{`(Ver ${teachers.length - 3} más)`}</Typography>}
						</Box>
					</Box>
				</Tooltip>
			);
		},
	},
	{
		field: "addTeachers",
		headerName: "Agregar docentes",
		disableColumnMenu: true,
		hide: !restrictEditionTo([UserRole.Administrador, UserRole.Director], true),
		flex: 1,
		align: "center",
		renderCell: (params): React.ReactNode => {
			const navigate = useNavigate();

			return (
				<IconButton
					onClick={(): void => {
						const api: GridApi = params.api;
						const thisRow: Record<string, GridCellValue> = {};

						api.getAllColumns()
							.filter((c) => c.field !== "__check__" && !!c)
							.forEach((c) => (thisRow[c.field] = params.getValue(params.id, c.field)));
						navigate(`/addTeachers/${thisRow.id}`);
					}}>
					<AddIcon />
				</IconButton>
			);
		},
	},
	{
		field: "principal",
		headerName: "Director",
		disableColumnMenu: false,
		flex: 1,
		renderCell: (params): React.ReactNode => {
			const principal: User = params.value;
			return principal ? (
				<Typography fontSize={12}>{principal.name + " " + principal.surname}</Typography>
			) : (
				<Typography fontSize={12}>Sin director asignado</Typography>
			);
		},
	},
	{
		field: "addPrincipal",
		headerName: "Agregar director",
		disableColumnMenu: true,
		flex: 1,
		hide: !restrictEditionTo([UserRole.Administrador], true),
		align: "center",
		renderCell: (): React.ReactNode => {
			return (
				<IconButton
					onClick={(): null => {
						return null;
					}}>
					<AddIcon />
				</IconButton>
			);
		},
	},
	{
		field: "support_teacher",
		headerName: "Adscripto",
		disableColumnMenu: false,
		flex: 1,
		renderCell: (params): React.ReactNode => {
			const teacher: User = params.value;
			return teacher ? (
				<Typography fontSize={12}>{teacher.name + " " + teacher.surname}</Typography>
			) : (
				<Typography fontSize={12}>Sin adscripto asignado</Typography>
			);
		},
	},
	{
		field: "addSupportTeacher",
		headerName: "Agregar adscripto",
		disableColumnMenu: true,
		flex: 1,
		hide: !restrictEditionTo([UserRole.Administrador, UserRole.Director], true),
		align: "center",
		renderCell: (): React.ReactNode => {
			return (
				<IconButton
					onClick={(): null => {
						return null;
					}}>
					<AddIcon />
				</IconButton>
			);
		},
	},
	{
		field: "id",
		headerName: "Ver estudiantes",
		align: "center",
		sortable: false,
		flex: 1,
		disableColumnMenu: true,
		renderCell: (params): React.ReactNode => {
			const navigate = useNavigate();
			const id: string = params.value;

			const onClick = (): void => {
				navigate(`/students/`);
				// navigate(`/students/${id}`); //TODO: Use this line when navigation to group is implemented
			};
			return (
				<IconButton onClick={onClick}>
					<VisibilityIcon />
				</IconButton>
			);
		},
	},
];

interface GroupsProps {
	rows?: Group[];
}

const renderers = [...materialRenderers, { tester: NumericInputControlTester, renderer: NumericInputControl }];

export default function Groups(props: GroupsProps): React.ReactElement {
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
				<Button variant={"outlined"} onClick={handleCreateGroupModalOpen}>
					Crear grupo
				</Button>
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
