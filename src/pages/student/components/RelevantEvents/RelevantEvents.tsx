import React, { useState } from "react";

import { Alert, Box, Link } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";

import { RelevantEvent } from "../../../../core/Models";
import * as Api from "../../../../core/ApiStore";
import AddRelevantEvent from "./AddRelevantEvent";
import useFetchFromAPI, { FetchStatus } from "../../../../hooks/useFetchFromAPI";
import { LoadingButton } from "@mui/lab";

interface RelevantEventsProps {
	studentId: number;
	editable: boolean;
	canAdd: boolean;
	canDelete: boolean;
}

function RelevantEvents(props: RelevantEventsProps): JSX.Element {
	const { studentId, editable, canAdd, canDelete } = props;

	const [isAddingRowOpen, setIsAddingRowOpen] = useState(false);
	const [relevantEvents, setRelevantEvents] = useState<RelevantEvent[]>([]);
	const [deletionStatus, setDeletionStatus] = useState<FetchStatus>(FetchStatus.Initial);

	const { fetchStatus, refetch } = useFetchFromAPI(() => Api.fetchRelevantEvents(studentId), setRelevantEvents);

	function openAddDialog(): void {
		setIsAddingRowOpen(true);
	}

	function closeAddDialog(): void {
		setIsAddingRowOpen(false);
	}

	async function handleDeletion(id: number): Promise<void> {
		if (window.confirm("¿Quiere eliminar este evento?")) {
			setDeletionStatus(FetchStatus.Fetching);
			const { success, error } = await Api.deleteRelevantEvent(studentId, id);

			setDeletionStatus(FetchStatus.Initial);
			if (success) refetch();
			else window.alert(error);
		}
	}

	return (
		<Box display="flex" flexDirection="column" width="100%" height="100%">
			{fetchStatus === FetchStatus.Error && (
				<Alert variant="outlined" severity="error" onClick={refetch} style={{ cursor: "pointer" }}>
					No se pudieron obtener los eventos relevantes. Haga click aquí para reintenar.
				</Alert>
			)}

			<Box display="flex" justifyContent="flex-end" width="100%">
				{editable && canAdd && (
					<LoadingButton onClick={openAddDialog} loading={fetchStatus === FetchStatus.Fetching || deletionStatus === FetchStatus.Fetching}>
						<AddIcon />
					</LoadingButton>
				)}

				<AddRelevantEvent studentId={studentId} isOpen={isAddingRowOpen} onClose={closeAddDialog} />
			</Box>

			<Box sx={{ height: 350, width: "100%", paddingTop: "12px" }}>
				<DataGrid
					columns={[
						{ field: "event_date", headerName: "Fecha", width: 120 },
						{ field: "name", headerName: "Nombre", width: 150 },
						{ field: "event_type", headerName: "Tipo", width: 100 },
						{ field: "description", headerName: "Descripción", width: 250 },
						{
							field: "user",
							headerName: "Creador",
							width: 120,
							renderCell: ({ value }) => (
								<Link href={value.id} target="_blank">
									${value.name} ${value.surname}
								</Link>
							),
						},
						{
							field: "attachment",
							headerName: "Adjunto",
							width: 120,
							renderCell: ({ value }) => (
								<Link href={value} target="_blank">
									<AttachFileIcon />
								</Link>
							),
						},
						{
							field: "",
							headerName: "Borrar",
							width: 100,
							hide: !canDelete,
							renderCell: (params): React.ReactElement => (
								<DeleteOutlineIcon onClick={(): Promise<void> => handleDeletion(params.row.id)} style={{ cursor: "pointer" }} />
							),
						},
					]}
					rows={relevantEvents}
					loading={fetchStatus === FetchStatus.Fetching || deletionStatus === FetchStatus.Fetching}
				/>
			</Box>
		</Box>
	);
}

export default RelevantEvents;
