import React, { useState } from "react";

import { Box, Button, Dialog, Link, Typography } from "@mui/material";
import { DataGrid, GridRowId } from "@mui/x-data-grid";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import { materialCells, materialRenderers } from "@jsonforms/material-renderers";
import { JsonFormsCore, Translator } from "@jsonforms/core";
import { JsonForms } from "@jsonforms/react";

import { DocumentTypeLabel, UserInfo } from "../../../../core/Models";
import { ajv as userAjv } from "../../../../core/AJVHelper";
import schema from "../../../../core/schemas/user_info.json";
import { requiredFieldsTranslator } from "../../../../core/CoreHelper";
import ProfileCard from "../ProfileCard/ProfileCard";

import ui from "./documents-ui.json";

interface DocumentsProps {
	user: UserInfo;
	setUser: (newUser: UserInfo) => void;
	editable: boolean;
	canAdd: boolean;
	canDelete: boolean;
}

//todo: usar date input de eva.
function Documents(props: DocumentsProps): JSX.Element {
	const { user, setUser, editable, canAdd, canDelete } = props;
	const { documents } = user;

	const [selectedRows, setSelectedRows] = useState<GridRowId[]>([]);
	const [isAddingRowOpen, setIsAddingRowOpen] = useState(false);
	const [newRow, setNewRow] = useState<Pick<JsonFormsCore, "data" | "errors">>({ data: undefined, errors: [] });

	if (!documents) return <></>;

	function handleDeleteDocumentsRows(): void {
		setUser({
			...user,
			documents: documents?.filter((document, index) => !selectedRows.includes(index)),
		});
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
		if (!newRow.data) return;

		setUser({
			...user,
			documents: [...(user.documents ?? []), newRow.data],
		});

		setNewRow({ data: undefined, errors: [] });

		setIsAddingRowOpen(false);
	}

	return (
		<ProfileCard title="Documentos">
			<Box display="flex" justifyContent="flex-end" width="100%">
				{editable && (
					<>
						{canDelete && (
							<Button onClick={handleDeleteDocumentsRows}>
								<DeleteOutlineIcon />
							</Button>
						)}

						{canAdd && (
							<Button onClick={openAddDialog}>
								<AddIcon />
							</Button>
						)}
					</>
				)}

				<Dialog open={isAddingRowOpen} onClose={closeAddDialog}>
					<Box width="400px" padding="12px">
						<Typography variant="h5">Agregar documento</Typography>

						<JsonForms
							i18n={{ translate: requiredFieldsTranslator as Translator }}
							ajv={userAjv}
							schema={schema.properties.documents.items}
							uischema={ui}
							renderers={materialRenderers}
							cells={materialCells}
							data={newRow.data}
							onChange={setNewRow}
						/>

						<Box display="flex" width="100%" justifyContent="flex-end">
							<Button variant="outlined" disabled={!enableAddingRow()} onClick={addTitleRow}>
								Guardar
							</Button>
						</Box>
					</Box>
				</Dialog>
			</Box>

			<Box sx={{ height: 400, width: "100%", paddingTop: "12px" }}>
				<DataGrid
					columns={[
						{ field: "type", headerName: "Tipo de documentación", width: 250 },
						{ field: "upload_date", headerName: "Fecha de subida", width: 200 },
						{
							field: "attachment",
							headerName: "Adjunto certificado/constancia",
							width: 300,
							renderCell: (cell) => (
								<Link href={cell.value} target="_blank">
									<AttachFileIcon />
								</Link>
							),
						},
					]}
					rows={documents.map((document, id) => ({
						id,
						...document,
						upload_date: document.upload_date.replaceAll("-", "/"),
						type: DocumentTypeLabel[document.type],
					}))}
					checkboxSelection={editable}
					onSelectionModelChange={setSelectedRows}
					pageSize={5}
					rowsPerPageOptions={[5]}
				/>
			</Box>
		</ProfileCard>
	);
}

export default Documents;
