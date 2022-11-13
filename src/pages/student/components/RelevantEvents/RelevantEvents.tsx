import React, { useState } from "react";

import { Box, Button, Card, Dialog, Link, Typography } from "@mui/material";
import { DataGrid, GridRowId } from "@mui/x-data-grid";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import { JsonFormsCore } from "@jsonforms/core";
import AddRelevantEvent from "./AddRelevantEvent";

interface RelevantEventsProps {
	studentId: number;
	editable: boolean;
	canAdd: boolean;
	canDelete: boolean;
}

function RelevantEvents(props: RelevantEventsProps): JSX.Element {
	const { studentId, editable, canAdd, canDelete } = props;

	const [isAddingRowOpen, setIsAddingRowOpen] = useState(false);
	const [newRow, setNewRow] = useState<Pick<JsonFormsCore, "data" | "errors">>({ data: undefined, errors: [] });

	function handleDeleteDocumentsRows(): void {
		return;
	}

	function openAddDialog(): void {
		setIsAddingRowOpen(true);
	}

	function closeAddDialog(): void {
		setIsAddingRowOpen(false);
	}

	function areSchemaErrors(): boolean {
		return (newRow?.errors as unknown[]).length > 0;
	}

	function enableAddingRow(): boolean {
		return !areSchemaErrors();
	}

	function addTitleRow(): void {
		return;
	}

	return (
		<Box display="flex" flexDirection="column" width="100%" height="100%">
			<Box display="flex" justifyContent="flex-start">
				<Typography variant="h5">Eventos relevantes</Typography>
			</Box>

			<Box display="flex" justifyContent="flex-end" width="100%">
				{editable && (
					<>
						<Button onClick={handleDeleteDocumentsRows}>
							<DeleteOutlineIcon />
						</Button>

						<Button onClick={openAddDialog}>
							<AddIcon />
						</Button>
					</>
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
					]}
					rows={[]}
				/>
			</Box>
		</Box>
	);
}

export default RelevantEvents;
