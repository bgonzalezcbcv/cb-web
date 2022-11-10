import React from "react";

import * as Models from "../../../../../core/Models";
import { Link, TableContainer } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { DiscountExplanationName, DiscountTypeName } from "../../../../../core/Models";
import { reverseDate } from "../../../../../core/CoreHelper";

export type DiscountHistoryProps = {
	rows: Models.Discount[];
	handleDeletion: (id: number) => void;
	canDelete?: boolean;
};

export default function DiscountHistory(props: DiscountHistoryProps): React.ReactElement {
	const { rows, handleDeletion, canDelete } = props;

	const columns: GridColDef[] = [
		{
			field: "start_date",
			headerName: "Comienzo",
			width: 120,
			renderCell: ({ value }) => reverseDate(value, "/"),
		},
		{
			field: "end_date",
			headerName: "Fin",
			width: 120,
			renderCell: ({ value }) => reverseDate(value, "/"),
		},
		{
			field: "percentage",
			headerName: "%",
			width: 80,
		},
		{
			field: "explanation",
			headerName: "Explicación",
			width: 150,
			renderCell: ({ value }) => DiscountExplanationName[value as keyof typeof DiscountExplanationName],
		},
		{
			field: "resolution_description",
			headerName: "Descripción",
			width: 200,
		},
		{
			field: "resolution_url",
			headerName: "Resolución",
			width: 100,
			renderCell: ({ value }): React.ReactElement | null => {
				return value ? (
					<Link href={value} target="_blank">
						<DownloadIcon style={{ marginLeft: 25 }} />
					</Link>
				) : null;
			},
		},
		{
			field: "administrative_type",
			headerName: "Tipo",
			width: 200,
			renderCell: ({ value }) => DiscountTypeName[value as keyof typeof DiscountTypeName],
		},
		{
			field: "administrative_info_url",
			headerName: "Informe",
			width: 100,
			renderCell: ({ value }): React.ReactElement | null => {
				return value ? (
					<Link href={value} target="_blank">
						<DownloadIcon style={{ marginLeft: 25 }} />
					</Link>
				) : null;
			},
		},
		{
			field: "",
			headerName: "Borrar",
			width: 100,
			hide: !canDelete,
			renderCell: (params): React.ReactElement => (
				<DeleteOutlineIcon onClick={(): void => handleDeletion?.(Number(params.row.id))} style={{ cursor: "pointer" }} />
			),
		},
	];

	return (
		<TableContainer style={{ height: 240, width: "100%", fontWeight: 600 }}>
			<DataGrid columns={columns} rows={rows} />
		</TableContainer>
	);
}
