import _ from "lodash";
import React, { useCallback, useEffect, useState } from "react";

import * as API from "../../core/ApiStore";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { normalizeText } from "../../core/CoreHelper";
import { ReportCard, ReportCard as ReportCardModel, Student } from "../../core/Models";
import { Alert, Box, CircularProgress, IconButton, Input, Paper } from "@mui/material";
import { FetchState } from "../../core/interfaces";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import { DeleteReportCardDialog, ReportDeletionSuccessDialog } from "./components/DeleteReportCardDialog";

export const emptyReport: ReportCard = {
	id: -1,
	group: "",
	starting_month: new Date(),
	ending_month: new Date(),
	year: new Date(),
	type: "",
	passed: false,
};

export const emptyReportList: ReportCard[] = [emptyReport];

interface ReportCardListProps {
	student: Student;
	rows?: ReportCard[];
	editable: boolean;
}

export default function ReportCardList(props: ReportCardListProps): React.ReactElement {
	const { student, rows, editable } = props;

	const [reports, setReports] = useState<ReportCardModel[]>(rows ?? []);
	const [fetchState, setFetchState] = useState(FetchState.initial);
	const [searchText, setSearchText] = useState("");
	const [showDeleteAlert, setShowDeleteAlert] = useState(false);
	const [deletionSuccess, setDeletionSuccess] = useState(false);
	const [showDeletionSuccessAlert, setShowDeletionSuccessAlert] = useState(false);
	const [reportToDeleteId, setReportToDeleteId] = useState<number | null>(null);

	const handleDeleteAlert = (reportId: number): void => {
		setShowDeleteAlert(true);
		setReportToDeleteId(reportId);
	};

	const handleDeletion = async (setOpen: boolean, shouldDelete: boolean): Promise<void> => {
		setShowDeleteAlert(setOpen);
		if (shouldDelete) {
			const response = await API.deleteReport(student.id, reportToDeleteId as number);
			setDeletionSuccess(response.success);
			setShowDeletionSuccessAlert(true);
		}
	};

	const columns: GridColDef[] = [
		{ field: "group", headerName: "Grupo", disableColumnMenu: false, flex: 2 },
		{
			field: "starting_month",
			headerName: "Inicio de Periodo",
			disableColumnMenu: false,
			flex: 1,
			renderCell: (params): React.ReactElement => {
				let period = "";

				params.row.type === "Intermedio"
					? (period = `${params.row.starting_month.getMonth()}/${params.row.starting_month.getFullYear()}`)
					: (period = `12/${params.row.year.getFullYear()}`);

				return <span>{period}</span>;
			},
		},
		{
			field: "ending_month",
			headerName: "Fin de Periodo",
			disableColumnMenu: false,
			flex: 1,
			renderCell: (params): React.ReactElement => {
				let period = "";

				params.row.type === "Intermedio"
					? (period = `${params.row.ending_month.getMonth()}/${params.row.ending_month.getFullYear()}`)
					: (period = `12/${params.row.year.getFullYear()}`);

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
		{
			field: "download",
			headerName: "Descargar",
			disableColumnMenu: false,
			flex: 1,
			renderCell: (): React.ReactElement => {
				return (
					<IconButton>
						<DownloadIcon />
					</IconButton>
				);
			},
		},
		{
			field: "delete",
			headerName: "Borrar",
			disableColumnMenu: editable,
			flex: 1,
			renderCell: (params): React.ReactElement => {
				return (
					<Box>
						<IconButton>
							<DeleteIcon onClick={(): void => handleDeleteAlert(params.row.id)} />
						</IconButton>
					</Box>
				);
			},
		},
	];

	const getReports = useCallback(async (): Promise<void> => {
		if (rows) return;

		setFetchState(FetchState.loading);

		const response = await API.fetchReports(student.id);

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
				const foundItems = reports.filter((report) =>
					Object.values(report).some((value) => value && normalizeText(value.toString()).includes(normalizeText(searchText)))
				);

				return <DataGrid style={{ height: 380, width: "100%" }} rows={foundItems} columns={columns} pageSize={5} rowsPerPageOptions={[5]} />;
			}
			default:
				return null;
		}
	}, [reports, fetchState, searchText]);

	return (
		<Box>
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

			<Paper>
				<Box
					sx={{
						display: "flex",
						flexDirection: "column-reverse",
						alignItems: "flex-end",
					}}>
					<IconButton disabled={!editable} color="secondary">
						<AddCircleOutlineIcon />
					</IconButton>
				</Box>
				{printTable()}
			</Paper>
			<DeleteReportCardDialog show={showDeleteAlert} setOpen={handleDeletion} />
			<ReportDeletionSuccessDialog success={deletionSuccess} show={showDeletionSuccessAlert} setOpen={setShowDeletionSuccessAlert} />
		</Box>
	);
}
