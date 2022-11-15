import React, { useEffect, useState } from "react";

import { Alert, Box, Button, Card, IconButton, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

import { ScholarshipType, TypeScholarship } from "../../core/Models";
import { deleteTypeScholarship, fetchTypeScholarships } from "../../core/ApiStore";
import AddScholarship from "./AddScholarship";
import { reverseDate } from "../../core/CoreHelper";
import useFetchFromAPI, { FetchStatus } from "../../hooks/useFetchFromAPI";

interface DocumentsProps {
	editable: boolean;
	canAdd: boolean;
	canDelete: boolean;
}

function Scholarship(props: DocumentsProps): JSX.Element {
	const { editable, canAdd, canDelete } = props;

	const { Initial, Fetching, Error } = FetchStatus;

	const [isAddingOpen, setIsAddingOpen] = useState(false);
	const [deleteState, setDeleteState] = useState<FetchStatus>(Initial);
	const [typeScholarships, setTypeScholarships] = useState<TypeScholarship[]>();
	const [errorID, setErrorID] = useState<null | number>(null);

	const { fetchStatus, refetch } = useFetchFromAPI(() => fetchTypeScholarships(), setTypeScholarships);

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
		setIsAddingOpen(true);
	}

	function closeAddDialog(created = false): void {
		setIsAddingOpen(false);

		if (created) refetch();
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async function handleDelete(id: number): Promise<void> {
		if (window.confirm("¿Desea eliminar convenio?")) {
			setDeleteState(Fetching);

			const { success } = await deleteTypeScholarship(id);

			setDeleteState(Initial);

			if (success) refetch();
			else {
				setDeleteState(Error);
			}
		}
	}

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
			<Box display="flex" flexDirection="column" width="100%" height="100%">
				{deleteState === Error && (
					<Alert variant="outlined" severity="error">
						No se pudo eliminar la inasistencia. Intente de nuevo.
					</Alert>
				)}

				{fetchStatus === Error && (
					<Alert variant="outlined" severity="error" onClick={refetch} style={{ cursor: "pointer" }}>
						No se pudieron obtener los convenios. Haga click aquí para reintentar.
					</Alert>
				)}

				<Box display="flex" justifyContent="flex-start" width="100%">
					<Typography variant="h4">Convenios</Typography>
				</Box>

				<Box display="flex" justifyContent="flex-end" width="100%">
					{editable && (
						<>
							{canAdd && (
								<Button onClick={openAddDialog}>
									<AddIcon />
								</Button>
							)}
						</>
					)}
				</Box>

				{editable && canAdd && <AddScholarship isOpen={isAddingOpen} onClose={closeAddDialog} />}

				<Box sx={{ height: "100%", width: "100%", paddingTop: "12px" }}>
					<DataGrid
						columns={[
							{
								field: "scholarship",
								headerName: "Tipo de escolaridad",
								width: 200,
								renderCell: ({ value }) => ScholarshipType[value as keyof typeof ScholarshipType],
							},
							{ field: "description", headerName: "Nombre", flex: 2 },
							{ field: "signed_date", headerName: "Fecha de firmado", width: 180, renderCell: ({ value }) => reverseDate(value, "/") },
							{ field: "contact_name", headerName: "Nombre del contacto", flex: 2 },
							{ field: "contact_phone", headerName: "Teléfono de contacto", width: 220 },
							{
								field: "",
								headerName: "Borrar",
								width: 120,
								hide: !(canDelete && editable),
								renderCell: ({ row }) => (
									<IconButton disabled={!editable && !canDelete} onClick={(): Promise<void> => handleDelete(row.id)}>
										<DeleteIcon />
									</IconButton>
								),
							},
						]}
						style={{ height: "100%" }}
						loading={fetchStatus === Fetching || deleteState === Fetching}
						rows={typeScholarships?.filter((scholarship) => scholarship.description !== null) ?? []}
					/>
				</Box>
			</Box>
		</Card>
	);
}

export default Scholarship;
