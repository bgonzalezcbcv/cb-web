import _ from "lodash";
import React from "react";

import { TableContainer } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import { ScholarshipType, StudentTypeScholarship } from "../../../../../core/Models";
import { reverseDate } from "../../../../../core/CoreHelper";

export type TypeScholarshipHistoryProps = {
	rows: StudentTypeScholarship[];
	height: number;
	handleDeletion?: (id: number) => void;
	canDelete?: boolean;
};

export default function TypeScholarshipHistory(props: TypeScholarshipHistoryProps): React.ReactElement {
	const { rows, height, handleDeletion, canDelete } = props;

	const sortedRows = _.sortBy(rows, (row) => 0 - row.id);

	const columns: GridColDef[] = [
		{
			field: "date",
			headerName: "Fecha",
			flex: 1,
			renderCell: ({ value }) => reverseDate(value, "/"),
		},
		{
			field: "scholarship",
			headerName: "Tipo de escolaridad",
			flex: 2,
			renderCell: (params) => ScholarshipType[params.value as keyof typeof ScholarshipType],
		},
		{
			field: "description",
			headerName: "Convenio",
			flex: 2,
		},
		{
			field: "",
			headerName: "Borrar",
			flex: 1,
			hide: !canDelete,
			renderCell: (params) => <DeleteOutlineIcon onClick={(): void => handleDeletion?.(Number(params.row.id))} style={{ cursor: "pointer" }} />,
		},
	];

	return (
		<TableContainer style={{ height: height }}>
			<DataGrid columns={columns} rows={sortedRows} />
		</TableContainer>
	);
}
