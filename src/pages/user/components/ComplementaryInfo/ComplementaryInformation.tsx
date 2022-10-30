import React, { useState } from "react";

import { Box, Button, Dialog, Link, Typography } from "@mui/material";
import { DataGrid, GridRowId } from "@mui/x-data-grid";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import { materialCells, materialRenderers } from "@jsonforms/material-renderers";
import { JsonFormsCore, Translator } from "@jsonforms/core";
import { JsonForms } from "@jsonforms/react";

import { UserInfo } from "../../../../core/Models";
import { ajv as userAjv } from "../../../../core/AJVHelper";
import { requiredFieldsTranslator } from "../../../../core/CoreHelper";
import ProfileCard from "../ProfileCard/ProfileCard";

import schema from "../../../../core/schemas/user_info.json";
import ui from "./complementary-info-ui.json";
import addItemUi from "./complementary-info-add-item-ui.json";

interface ComplementaryInformationProps {
	user: UserInfo;
	setUser: (newUser: UserInfo) => void;
	editable: boolean;
	canAdd: boolean;
	canDelete: boolean;
}

//todo: usar date input de eva.
function ComplementaryInformation(props: ComplementaryInformationProps): JSX.Element {
	const { user, setUser, editable, canAdd, canDelete } = props;
	const { complementary_info } = user;

	const [selectedRows, setSelectedRows] = useState<GridRowId[]>([]);
	const [isAddingRowOpen, setIsAddingRowOpen] = useState(false);
	const [newRow, setNewRow] = useState<Pick<JsonFormsCore, "data" | "errors">>({ data: undefined, errors: [] });

	const [beginningDateError, setBeginningDateError] = useState<unknown[]>([]);

	if (!complementary_info) return <></>;

	const { beginning_date, academic_training } = complementary_info;

	function handleDeleteAcademicTrainingRows(): void {
		setUser({
			...user,
			complementary_info: {
				beginning_date,
				academic_training: academic_training.filter((row, index) => !selectedRows.includes(index)) ?? [],
			},
		});
	}

	function openAddDialog(): void {
		setIsAddingRowOpen(true);
	}

	function closeAddDialog(): void {
		setIsAddingRowOpen(false);
	}

	function addTitleRow(): void {
		if (!newRow.data) return;

		setUser({
			...user,
			complementary_info: {
				beginning_date,
				academic_training: [...academic_training, newRow.data],
			},
		});

		setNewRow({ data: undefined, errors: [] });

		setIsAddingRowOpen(false);
	}

	function onSave(): void {
		alert("Not implemented");
	}

	function canSave(): boolean {
		return beginningDateError.length === 0;
	}

	return (
		<ProfileCard
			title={
				<Box display="flex" flexDirection="row" alignContent="flex-start" width="100%">
					<Box display="flex" flexGrow={1} justifyContent="flex-start">
						<Typography variant="h5">Información complementaria</Typography>
					</Box>

					{editable && (
						<Box display="flex" justifyContent="flex-end" alignItems="flex-end">
							<Button variant="outlined" onClick={onSave} disabled={!canSave()}>
								Guardar
							</Button>
						</Box>
					)}
				</Box>
			}>
			<JsonForms
				i18n={{ translate: requiredFieldsTranslator as Translator }}
				ajv={userAjv}
				schema={schema.properties.complementary_info.properties.beginning_date}
				uischema={ui}
				renderers={materialRenderers}
				cells={materialCells}
				data={beginning_date}
				readonly={!editable}
				onChange={({ data, errors }): void => {
					setUser({
						...user,
						complementary_info: {
							academic_training: academic_training,
							beginning_date: data ?? beginning_date,
						},
					});
					setBeginningDateError(errors ?? []);
				}}
			/>

			<Box display="flex" justifyContent="flex-end" width="100%">
				{editable && (
					<>
						{canDelete && (
							<Button onClick={handleDeleteAcademicTrainingRows}>
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
						<Typography variant="h5">Agregar título</Typography>

						<JsonForms
							i18n={{ translate: requiredFieldsTranslator as Translator }}
							ajv={userAjv}
							schema={schema.properties.complementary_info.properties.academic_training.items}
							uischema={addItemUi}
							renderers={materialRenderers}
							cells={materialCells}
							data={newRow.data}
							onChange={setNewRow}
						/>

						<Box display="flex" width="100%" justifyContent="flex-end">
							<Button variant="outlined" disabled={(newRow?.errors as unknown[]).length > 0 ?? false} onClick={addTitleRow}>
								Guardar
							</Button>
						</Box>
					</Box>
				</Dialog>
			</Box>
			<Box sx={{ height: 400, width: "100%" }}>
				<DataGrid
					columns={[
						{ field: "title", headerName: "Descripción título", width: 200 },
						{ field: "date", headerName: "Fecha", width: 120 },
						{
							field: "attachment",
							headerName: "Adjunto título/curso",
							width: 200,
							renderCell: (cell) => (
								<Link href={cell.value} target="_blank">
									<AttachFileIcon />
								</Link>
							),
						},
					]}
					rows={academic_training.map((training, id) => ({
						id,
						...training,
						date: training.date.replaceAll("-", "/"),
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

export default ComplementaryInformation;
