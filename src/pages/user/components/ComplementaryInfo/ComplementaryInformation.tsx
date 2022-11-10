import React, { useEffect, useState } from "react";

import { Alert, Box, Button, IconButton, Link, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import AddIcon from "@mui/icons-material/Add";

import { UserInfo } from "../../../../core/Models";
import { reverseDate } from "../../../../core/CoreHelper";
import ProfileCard from "../ProfileCard/ProfileCard";

import DeleteIcon from "@mui/icons-material/Delete";
import AddComplementaryInformation from "./AddComplementaryInformation";
import { FetchStatus } from "../../../../hooks/useFetchFromAPI";
import { deleteComplementaryInformation } from "../../../../core/ApiStore";

interface ComplementaryInformationProps {
	user: UserInfo;
	setUser: (newUser: UserInfo) => void;
	editable: boolean;
	canAdd: boolean;
	canDelete: boolean;
	refetch: () => void;
}

function ComplementaryInformation(props: ComplementaryInformationProps): JSX.Element {
	const { user, editable, canAdd, canDelete, refetch } = props;
	const { complementary_informations } = user;

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

	function handleOpenDialog(): void {
		setIsAddingRowOpen(true);
	}

	function handleCloseDialog(created = false): void {
		setIsAddingRowOpen(false);

		if (created) refetch();
	}

	async function handleDelete(id: number): Promise<void> {
		if (window.confirm("¿Desea eliminar información complementaria?")) {
			setDeleteState(Fetching);

			const { success } = await deleteComplementaryInformation(user.id, id);

			setDeleteState(Initial);

			if (success) refetch();
			else {
				setDeleteState(Error);
			}
		}
	}

	return (
		<ProfileCard
			title={
				<Box display="flex" flexDirection="row" alignContent="flex-start" width="100%">
					<Box display="flex" flexGrow={1} justifyContent="flex-start">
						<Typography variant="h5">Información complementaria</Typography>
					</Box>
				</Box>
			}>
			{deleteState === Error && (
				<Alert variant="outlined" severity="error">
					No se pudo eliminar la información complementaria. Intente de nuevo.
				</Alert>
			)}

			<Box display="flex" justifyContent="flex-end" width="100%">
				{editable && canAdd && (
					<Button onClick={handleOpenDialog}>
						<AddIcon />
					</Button>
				)}

				<AddComplementaryInformation isOpen={isAddingRowOpen} userId={user.id} onClose={handleCloseDialog} />
			</Box>
			<Box sx={{ height: 400, width: "100%" }}>
				<DataGrid
					columns={[
						{ field: "description", headerName: "Descripción título", flex: 2 },
						{ field: "date", headerName: "Fecha", flex: 1, renderCell: ({ value }) => reverseDate(value, "/") },
						{
							field: "attachment_url",
							headerName: "Adjunto título/curso",
							flex: 1,
							renderCell: ({ value: url }) =>
								url ? (
									<Link href={url} target="_blank">
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
					rows={complementary_informations ?? []}
					pageSize={5}
					rowsPerPageOptions={[5]}
				/>
			</Box>
		</ProfileCard>
	);
}

export default ComplementaryInformation;
