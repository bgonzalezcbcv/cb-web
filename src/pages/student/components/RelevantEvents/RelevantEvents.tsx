import React, { useState } from "react";

import { Alert, Box, Link, Tooltip } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";

import { EventTypeName, RelevantEvent, UserInfo } from "../../../../core/Models";
import * as Api from "../../../../core/ApiStore";
import AddRelevantEvent from "./AddRelevantEvent";
import useFetchFromAPI, { FetchStatus } from "../../../../hooks/useFetchFromAPI";
import { LoadingButton } from "@mui/lab";
import { reverseDate } from "../../../../core/CoreHelper";

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

	function closeAddDialog(created = false): void {
		setIsAddingRowOpen(false);

		if (created) refetch();
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

			<Box sx={{ height: "80%", width: "100%", paddingTop: "12px" }}>
				<DataGrid
					columns={[
						{ field: "date", headerName: "Fecha", flex: 1, renderCell: ({ value }) => reverseDate(value, "/") },
						{
							field: "title",
							headerName: "Nombre",
							flex: 2,
							renderCell: ({ value }): React.ReactElement => (
								<Tooltip title={value}>
									<p style={{ whiteSpace: "break-spaces", overflowWrap: "break-word" }}>{value}</p>
								</Tooltip>
							),
						},
						{ field: "event_type", headerName: "Tipo", flex: 2, renderCell: ({ value }) => EventTypeName[value as keyof typeof EventTypeName] },
						{
							field: "description",
							headerName: "Descripción",
							resizable: true,
							flex: 3,
							renderCell: ({ value }): React.ReactElement => (
								<Tooltip title={value}>
									<p style={{ whiteSpace: "break-spaces", overflowWrap: "break-word" }}>{value}</p>
								</Tooltip>
							),
						},
						{
							field: "user",
							headerName: "Creador",
							flex: 2,
							renderCell: ({ value }): React.ReactElement => {
								const { id, name, surname } = value as UserInfo;

								return <Link href={`/user/${id}`}>{`${name} ${surname}`}</Link>;
							},
						},
						{
							field: "attachment_url",
							headerName: "Adjunto",
							flex: 1,
							renderCell: ({ value }): React.ReactElement | null =>
								value ? (
									<Link href={value} target="_blank">
										<AttachFileIcon />
									</Link>
								) : null,
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
					autoPageSize
					rows={relevantEvents}
					loading={fetchStatus === FetchStatus.Fetching || deletionStatus === FetchStatus.Fetching}
				/>
			</Box>
		</Box>
	);
}

export default RelevantEvents;
