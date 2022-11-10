import React, { useEffect, useState } from "react";

import { Alert, Box, Button, IconButton, Link } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import AddIcon from "@mui/icons-material/Add";

import { DocumentTypeLabel, UserInfo } from "../../../../core/Models";
import ProfileCard from "../ProfileCard/ProfileCard";
import { AddDocument } from "./AddDocument";
import DeleteIcon from "@mui/icons-material/Delete";
import { reverseDate } from "../../../../core/CoreHelper";
import { FetchStatus } from "../../../../hooks/useFetchFromAPI";
import { deleteDocument } from "../../../../core/ApiStore";

interface DocumentsProps {
	user: UserInfo;
	editable: boolean;
	canAdd: boolean;
	canDelete: boolean;
	refetch: () => void;
}

//todo: usar date input de eva.
function Documents(props: DocumentsProps): JSX.Element {
	const { user, editable, canAdd, canDelete, refetch } = props;
	const { documents } = user;

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

	function closeAddDialog(created = false): void {
		setIsAddingRowOpen(false);

		if (created) refetch();
	}

	async function handleDelete(id: number): Promise<void> {
		if (window.confirm("¿Desea eliminar documento?")) {
			setDeleteState(Fetching);

			const { success } = await deleteDocument(user.id, id);

			setDeleteState(Initial);

			if (success) refetch();
			else {
				setDeleteState(Error);
			}
		}
	}

	return (
		<ProfileCard title="Documentos">
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
					</>
				)}

				{canAdd && editable && <AddDocument isOpen={isAddingRowOpen} userId={user.id} onClose={closeAddDialog} />}
			</Box>

			<Box sx={{ height: 400, width: "100%", paddingTop: "12px" }}>
				<DataGrid
					columns={[
						{ field: "type", headerName: "Tipo de documentación", flex: 2 },
						{
							//
							field: "upload_date",
							headerName: "Fecha de subida",
							flex: 1,
							renderCell: ({ value }) => reverseDate(value, "/", "/"),
						},
						{
							field: "certificate_url",
							headerName: "Adjunto certificado/constancia",
							flex: 1,
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
					rows={(documents ?? []).map((document, id) => ({
						id,
						...document,
						upload_date: document.upload_date.replaceAll("-", "/"),
						type: DocumentTypeLabel[document.document_type],
					}))}
					pageSize={5}
					rowsPerPageOptions={[5]}
				/>
			</Box>
		</ProfileCard>
	);
}

export default Documents;
