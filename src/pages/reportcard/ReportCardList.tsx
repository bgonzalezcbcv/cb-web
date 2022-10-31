import _ from "lodash";
import React, { useCallback, useEffect, useState } from "react";

import * as API from "../../core/ApiStore";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { ReportApprovalState, ReportCard, ReportCard as ReportCardModel, Student } from "../../core/Models";
import { Alert, Box, CircularProgress, IconButton } from "@mui/material";
import { FetchState } from "../../core/interfaces";
import { DeleteReportCardDialog, ReportDeletionSuccessDialog } from "./components/DeleteReportCardDialog";
import { ApprovalReportCardDialog, ReportApprovalSuccessDialog } from "./components/ApprovalReportCardDialog";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import AddTaskIcon from "@mui/icons-material/AddTask";
import CreateReportCardModal from "./components/CreateReportCard/CreateReportCard";

export const emptyReport: ReportCard = {
	id: -1,
	group: "",
	starting_month: new Date(),
	ending_month: new Date(),
	year: "",
	type: "",
	passed: ReportApprovalState.Pending,
	report_url: "",
};

export const emptyReportList: ReportCard[] = [emptyReport];

interface ReportCardListProps {
	student: Student;
	rows?: ReportCard[];
	editable: boolean;
	canAdd: boolean;
	canDelete: boolean;
	canApprove: boolean;
}

export default function ReportCardList(props: ReportCardListProps): React.ReactElement {
	const { student, rows, editable, canAdd, canDelete, canApprove } = props;

	const [reports, setReports] = useState<ReportCardModel[]>(rows ?? []);
	const [fetchState, setFetchState] = useState(FetchState.initial);

	const [reportToDeleteId, setReportToDeleteId] = useState<number | null>(null);
	const [showDeleteAlert, setShowDeleteAlert] = useState(false);
	const [deletionSuccess, setDeletionSuccess] = useState(false);
	const [showDeletionSuccessAlert, setShowDeletionSuccessAlert] = useState(false);

	const [reportStateId, setReportStateId] = useState<number | null>(null);
	const [isGradingModalOpen, setIsGradingModalOpen] = useState(false);
	const [showApprovalSuccesAlert, setShowApprovalSuccesAlert] = useState(false);

	const [showCreateReport, setShowCreateReport] = useState<boolean>(false);

	const getReports = useCallback(async (): Promise<void> => {
		if (rows) return;

		setFetchState(FetchState.loading);

		const response = await API.fetchReports(student.id);

		if (response.success && response.data) {
			setReports(_.merge(emptyReportList, response.data)); // TODO: see if the merge is necessary when the endpoint is functional
			setFetchState(FetchState.initial);
		} else {
			setFetchState(FetchState.failure);
		}
	}, [rows, setFetchState, setReports]);

	useEffect((): void => {
		getReports();
	}, []);

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

	const handleGrading = async (setOpen: boolean, approved: boolean | null): Promise<void> => {
		setIsGradingModalOpen(false);
		let response;
		if (approved != null) {
			if (approved) response = await API.setReportApprovalState(student.id, reportStateId as number, ReportApprovalState.Approved);
			else response = await API.setReportApprovalState(student.id, reportStateId as number, ReportApprovalState.Failed);

			if (response.success) {
				setShowApprovalSuccesAlert(true);
			}
		}
	};

	const handleGradingModalOpen = (reportId: number): void => {
		setReportStateId(reportId);
		setIsGradingModalOpen(true);
	};

	const columns: GridColDef[] = [
		{ field: "group", headerName: "Grupo", disableColumnMenu: false, flex: 2 },
		{
			field: "starting_month",
			headerName: "Inicio de Periodo",
			disableColumnMenu: false,
			flex: 2,
			renderCell: (params): React.ReactElement => {
				let period = "";

				params.row.type === "Intermedio"
					? (period = `${params.row.starting_month.getMonth() + 1}/${params.row.starting_month.getFullYear()}`)
					: (period = `12/${params.row.year}`);

				return <span>{period}</span>;
			},
		},
		{
			field: "ending_month",
			headerName: "Fin de Periodo",
			disableColumnMenu: false,
			flex: 2,
			renderCell: (params): React.ReactElement => {
				let period = "";

				params.row.type === "Intermedio"
					? (period = `${params.row.ending_month.getMonth() + 1}/${params.row.ending_month.getFullYear()}`)
					: (period = `12/${params.row.year}`);

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
					<IconButton onClick={(): void => alert("No implementado!")}>
						<DownloadIcon />
					</IconButton>
				);
			},
		},
		{
			field: "approval",
			headerName: "Aprobar",
			hide: !canApprove,
			disableColumnMenu: false,
			flex: 1,
			renderCell: (params): React.ReactElement => {
				return (
					<Box>
						{params.row.type === "Final" && (
							<IconButton disabled={!editable} onClick={(): void => handleGradingModalOpen(params.row.id)}>
								<AddTaskIcon />
							</IconButton>
						)}
					</Box>
				);
			},
		},
		{
			field: "delete",
			headerName: "Borrar",
			disableColumnMenu: false,
			flex: 1,
			renderCell: (params): React.ReactElement => {
				return (
					<Box>
						<IconButton disabled={!editable && !canDelete} onClick={(): void => handleDeleteAlert(params.row.id)}>
							<DeleteIcon />
						</IconButton>
					</Box>
				);
			},
		},
	];

	if (fetchState === FetchState.loading)
		return (
			<Box style={{ padding: "20px", display: "flex", justifyContent: "center", alignItems: "center" }}>
				<CircularProgress />
			</Box>
		);

	if (fetchState === FetchState.failure)
		return (
			<Box style={{ padding: "20px", display: "flex", justifyContent: "center", alignItems: "center" }}>
				<Alert severity="error" variant="outlined">
					Falló la carga de boletines.
				</Alert>
			</Box>
		);

	return (
		<Box>
			{/*<Box className="SearchAndGroupFilter">*/}
			{/*	<Input*/}
			{/*		style={{ flex: 1, marginRight: "10%" }}*/}
			{/*		id="search"*/}
			{/*		type="text"*/}
			{/*		placeholder="Buscar..."*/}
			{/*		value={searchText}*/}
			{/*		onChange={(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void => setSearchText(e.target.value)}*/}
			{/*	/>*/}
			{/*</Box>*/}

			<Box
				sx={{
					display: "flex",
					flexDirection: "column-reverse",
					alignItems: "flex-end",
				}}>
				{canAdd && (
					<IconButton disabled={!editable} color="secondary" onClick={(): void => setShowCreateReport(true)}>
						<AddCircleOutlineIcon />
					</IconButton>
				)}
			</Box>
			<DataGrid
				style={{ height: 380, width: "100%" }}
				rows={reports}
				columns={columns}
				pageSize={5}
				rowsPerPageOptions={[5]}
				initialState={{
					sorting: {
						sortModel: [{ field: "starting_month", sort: "desc" }],
					},
				}}
			/>

			<DeleteReportCardDialog show={showDeleteAlert} setOpen={handleDeletion} />

			<ReportDeletionSuccessDialog success={deletionSuccess} show={showDeletionSuccessAlert} setOpen={setShowDeletionSuccessAlert} />

			<ApprovalReportCardDialog show={isGradingModalOpen} setOpen={handleGrading} />

			<ReportApprovalSuccessDialog show={showApprovalSuccesAlert} setOpen={setShowApprovalSuccesAlert} />
			{showCreateReport ? <CreateReportCardModal show={true} onClose={(): void => setShowCreateReport(false)} student={student} /> : null}
		</Box>
	);
}
