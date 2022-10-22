import _ from "lodash";
import React, { useCallback, useEffect, useState } from "react";

import * as API from "../../core/ApiStore";
import { DataGrid, GridCellValue, GridColDef } from "@mui/x-data-grid";
import CloseIcon from "@mui/icons-material/Close";
import RemoveIcon from "@mui/icons-material/Remove";
import { ReportCard, ReportCard as ReportCardModel } from "../../core/Models";
import { Alert, Box, Card, CircularProgress, Icon, Input, Paper, Typography } from "@mui/material";
import { FetchState } from "../../core/interfaces";

// starting_month: string;
// ending_month: string;

const columns: GridColDef[] = [
	{ field: "id", headerName: "ID", disableColumnMenu: false, flex: 1 },
	{ field: "grade", headerName: "Grado", disableColumnMenu: false, flex: 2 },
	{
		field: "",
		headerName: "Periodo",
		disableColumnMenu: false,
		flex: 2,
		renderCell: (params): React.ReactElement => {
			let period = "";

			params.row.type === "Intermedio"
				? (period = `${params.row.starting_month} - ${params.row.ending_month}`)
				: (period = `${params.row.starting_month}`);

			return <span>{period}</span>;
		},
	},
	{ field: "type", headerName: "Tipo", disableColumnMenu: false, flex: 2 },
	{
		field: "passed",
		headerName: "Aprobado",
		disableColumnMenu: false,
		flex: 1,
		renderCell: (params): React.ReactElement => {
			let cellValue = "N/A";
			const isFinal = params.row.type === "Final";
			const passed = params.row.passed === true;

			if (isFinal) {
				passed ? (cellValue = "SI") : (cellValue = "NO");
			}

			return <span>{cellValue}</span>;
		},
	},
];

export const emptyReport: ReportCard = {
	id: -1,
	grade: "",
	starting_month: "",
	ending_month: "",
	type: "",
	passed: false,
};

export const emptyReportList: ReportCard[] = [emptyReport];

interface ReportCardListProps {
	rows?: ReportCardModel[];
}

export default function ReportCardList(props: ReportCardListProps): React.ReactElement {
	const { rows } = props;

	const [reports, setReports] = useState<ReportCardModel[]>(rows ?? []);
	const [fetchState, setFetchState] = React.useState(FetchState.initial);
	const [searchText, setSearchText] = useState("");

	const getReports = useCallback(async (): Promise<void> => {
		if (rows) return;

		setFetchState(FetchState.loading);

		const response = await API.fetchReports();

		if (response.success && response.data) {
			setReports(_.merge(emptyReportList, response.data));
			setFetchState(FetchState.initial);
		} else {
			setFetchState(FetchState.failure);
		}
	}, [rows, setFetchState, setReports]);

	useEffect((): void => {
		getReports();
	}, []);

	const printTable = useCallback((): JSX.Element | null => {
		switch (fetchState) {
			case "loading":
				return (
					<Box style={{ padding: "20px", display: "flex", justifyContent: "center", alignItems: "center" }}>
						<CircularProgress />
					</Box>
				);
			case "failure":
				return (
					<Box style={{ padding: "20px", display: "flex", justifyContent: "center", alignItems: "center" }}>
						<Alert severity="error" variant="outlined">
							Falló la carga de boletines.
						</Alert>
					</Box>
				);
			case "initial": {
				const foundItems = reports.filter((report) => Object.values(report).some((value) => value && value.toString().includes(searchText)));
				return <DataGrid style={{ height: 380, width: "100%" }} rows={foundItems} columns={columns} pageSize={5} rowsPerPageOptions={[5]} />;
			}
			default:
				return null;
		}
	}, [reports, fetchState, searchText]);

	return (
		<Card
			sx={{
				width: "90%",
				padding: "20px",
				alignSelf: "flex-start",
				marginTop: "20px",
				display: "flex",
				flexDirection: "column",
				boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
			}}>
			<Box display="flex" justifyContent="flex-start" width="100%">
				<Typography variant="h4">Boletines</Typography>
			</Box>

			<Box className="SearchAndGroupFilter">
				<Input
					style={{ flex: 1, marginRight: "10%" }}
					id="search"
					type="text"
					placeholder="Buscar..."
					value={searchText}
					onChange={(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void => setSearchText(e.target.value)}
				/>
			</Box>

			<Paper>{printTable()}</Paper>
		</Card>
	);
}
