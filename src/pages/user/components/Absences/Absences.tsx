import React, { useEffect, useState } from "react";

import { Alert, Box, Button, IconButton, Link } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import AddIcon from "@mui/icons-material/Add";

import { UserInfo } from "../../../../core/Models";
import ProfileCard from "../ProfileCard/ProfileCard";
import AddAbsence from "./AddAbsence";
import DeleteIcon from "@mui/icons-material/Delete";
import { reverseDate } from "../../../../core/CoreHelper";
import { FetchStatus } from "../../../../hooks/useFetchFromAPI";
import { deleteAbsences } from "../../../../core/ApiStore";

interface AbscencesProps {
	user: UserInfo;
	editable: boolean;
	canAdd: boolean;
	canDelete: boolean;
	refetch: () => void;
}

//todo: usar date input de eva.
function Absences(props: AbscencesProps): JSX.Element {
	const { user, editable, canAdd, canDelete, refetch } = props;
	const { absences } = user;

	const { Initial, Fetching, Error } = FetchStatus;

	const [isAddingRowOpen, setIsAddingRowOpen] = useState(false);
	const [deleteState, setDeleteState] = useState<FetchStatus>(Initial);
	const [errorID, setErrorID] = useState<null | number>(null);

	function dismissTimeout(): void {
		if (errorID) window.clearTimeout(errorID);
	}

	useEffect(() => {
		if (deleteState === Error) {
			dismissTimeout();

			setErrorID(window.setTimeout(() => setDeleteState(Initial), 5000));
		}
	}, [deleteState]);

	function openAddDialog(): void {
		setIsAddingRowOpen(true);
	}

	function closeAddDialog(creation = false): void {
		setIsAddingRowOpen(false);

		if (creation) refetch();
	}

	async function handleDelete(id: number): Promise<void> {
		if (window.confirm("¿Desea eliminar inasistencia?")) {
			setDeleteState(Fetching);

			const { success } = await deleteAbsences(user.id, id);

			setDeleteState(Initial);

			if (success) refetch();
			else {
				setDeleteState(Error);
			}
		}
	}

	return (
		<ProfileCard title="Inasistencias">
			{deleteState === Error && (
				<Alert variant="outlined" severity="error">
					No se pudo eliminar la inasistencia. Intente de nuevo.
				</Alert>
			)}

			<Box display="flex" justifyContent="flex-end" width="100%">
				{editable && (
					<>
						{canAdd && (
							<Button onClick={openAddDialog}>
								<AddIcon />
							</Button>
						)}

						<AddAbsence userId={user.id} isOpen={isAddingRowOpen} onClose={closeAddDialog} />
					</>
				)}
			</Box>

			<Box sx={{ height: 400, width: "100%", paddingTop: "12px" }}>
				<DataGrid
					columns={[
						{ field: "start_date", headerName: "Inicio", flex: 1 },
						{ field: "end_date", headerName: "Finalización", flex: 1 },
						{ field: "reason", headerName: "Motivo", flex: 3 },
						{
							field: "certificate_url",
							headerName: "Adjunto certificado/constancia",
							flex: 2,
							renderCell: ({ value }) =>
								value ? (
									<Link href={value} target="_blank">
										<AttachFileIcon />
									</Link>
								) : null,
						},
						{
							field: "",
							headerName: "Borrar",
							flex: 1,
							hide: !(canDelete && editable),
							renderCell: ({ row }) => (
								<IconButton disabled={!editable && !canDelete} onClick={(): Promise<void> => handleDelete(row.id)}>
									<DeleteIcon />
								</IconButton>
							),
						},
					]}
					rows={(absences ?? []).map((absence) => ({
						...absence,
						start_date: reverseDate(absence.start_date, "/"),
						end_date: reverseDate(absence.end_date, "/"),
					}))}
					pageSize={5}
					rowsPerPageOptions={[5]}
				/>
			</Box>
		</ProfileCard>
	);
}

export default Absences;
