import React from "react";

import { Link, TableContainer } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

import * as Models from "../../../../../core/Models";

export type PaymentMethodHistoryProps = {
	rows: Models.PaymentMethod[];
	height: number;
	handleDeletion?: (id: number) => void;
	canDelete?: boolean;
};

export default function PaymentMethodHistory(props: PaymentMethodHistoryProps): React.ReactElement {
	const { rows, height, handleDeletion, canDelete } = props;

	const columns: GridColDef[] = [
		{
			field: "year",
			headerName: "Año",
			flex: 2,
		},
		{
			field: "method",
			headerName: "Forma de pago",
			flex: 2,
		},
		{
			field: "annual_payment_url",
			headerName: "Documento",
			flex: 2,
			renderCell: (params) =>
				params.value ? (
					<Link href={params.value} target="_blank">
						<DownloadIcon style={{ marginLeft: 25 }} />{" "}
					</Link>
				) : null,
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
			<DataGrid columns={columns} rows={rows} />
		</TableContainer>
	);
}
