import React, { useState } from "react";

import { Alert, Box, Button, Dialog, Link, Typography } from "@mui/material";
import { DataGrid, GridRowId } from "@mui/x-data-grid";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import { materialCells, materialRenderers } from "@jsonforms/material-renderers";
import { JsonFormsCore, Translator } from "@jsonforms/core";
import { JsonForms } from "@jsonforms/react";

import { UserInfo } from "../../../../core/Models";
import { ajv as userAjv } from "../../../../core/AJVHelper";
import schema from "../../../../core/schemas/user_info.json";
import { dateBeforeOrEqualThan, requiredFieldsTranslator } from "../../../../core/CoreHelper";
import ProfileCard from "../ProfileCard/ProfileCard";

import ui from "./absences-ui.json";

interface AbscencesProps {
	user: UserInfo;
	setUser: (newUser: UserInfo) => void;
	editable: boolean;
	canAdd: boolean;
	canDelete: boolean;
}

//todo: usar date input de eva.
function Absences(props: AbscencesProps): JSX.Element {
	const { user, setUser, editable, canAdd, canDelete } = props;
	const { absences } = user;

	const [selectedRows, setSelectedRows] = useState<GridRowId[]>([]);
	const [isAddingRowOpen, setIsAddingRowOpen] = useState(false);
	const [newRow, setNewRow] = useState<Pick<JsonFormsCore, "data" | "errors">>({ data: undefined, errors: [] });

	if (!absences) return <></>;

	function handleDeleteAbsencesRows(): void {
		setUser({
			...user,
			absences: absences?.filter((absence, index) => !selectedRows.includes(index)),
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

	function areDatesCorrect(): boolean {
		if (!newRow.data) return true;

		const { starting_date, ending_date } = newRow.data;

		if (!(starting_date && ending_date)) return false;

		return dateBeforeOrEqualThan(starting_date, ending_date);
	}

	function enableAddingRow(): boolean {
		if (!newRow.data || areSchemaErrors()) return false;

		return areDatesCorrect();
	}

	function addTitleRow(): void {
		if (!newRow.data) return;

		setUser({
			...user,
			absences: absences ? [...absences, newRow.data] : [newRow.data],
		});

		setNewRow({ data: undefined, errors: [] });

		setIsAddingRowOpen(false);
	}

	return (
		<ProfileCard title="Inasistencias">
			<Box display="flex" justifyContent="flex-end" width="100%">
				{editable && (
					<>
						{canDelete && (
							<Button onClick={handleDeleteAbsencesRows}>
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
						<Typography variant="h5">Agregar inasistencia</Typography>

						<JsonForms
							i18n={{ translate: requiredFieldsTranslator as Translator }}
							ajv={userAjv}
							schema={schema.properties.absences.items}
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

						{!areDatesCorrect() && (
							<Box paddingTop="6px">
								<Alert severity={"error"}>
									<Typography>Fecha de inicio ha de ser menor o igual a la fecha de finalización.</Typography>
								</Alert>
							</Box>
						)}
					</Box>
				</Dialog>
			</Box>

			<Box sx={{ height: 400, width: "100%", paddingTop: "12px" }}>
				<DataGrid
					columns={[
						{ field: "starting_date", headerName: "Inicio", width: 150 },
						{ field: "ending_date", headerName: "Finalización", width: 150 },
						{ field: "reason", headerName: "Motivo", width: 120 },
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
					rows={absences.map((absence, id) => ({
						id,
						...absence,
						starting_date: absence.starting_date.replaceAll("-", "/"),
						ending_date: absence.ending_date.replaceAll("-", "/"),
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

export default Absences;
