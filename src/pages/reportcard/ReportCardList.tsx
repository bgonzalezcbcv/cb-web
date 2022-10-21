import _ from "lodash";
import React, { useCallback, useEffect, useState } from "react";

import { GridColDef } from "@mui/x-data-grid";
import { ReportCard as ReportCardModel } from "../../core/Models";
import { Box, Card, Input, Paper, Typography } from "@mui/material";
import { FetchState } from "../../core/interfaces";

const columns: GridColDef[] = [
	{ field: "id", headerName: "ID", disableColumnMenu: false, flex: 1 },
	{ field: "grade", headerName: "Grado", disableColumnMenu: false, flex: 2 },
	{ field: "period", headerName: "Periodo", disableColumnMenu: false, flex: 2 },
	{ field: "type", headerName: "Tipo", disableColumnMenu: false, flex: 2 },
	{ field: "passed", headerName: "Aprobado", disableColumnMenu: false, flex: 2 },
];

interface ReportCardListProps {
	rows?: ReportCardModel[];
}

export default function ReportCardList(props: ReportCardListProps): React.ReactElement {
	const { rows } = props;

	const [reports, setReports] = useState<ReportCardModel[]>(rows ?? []);
	const [fetchState, setFetchState] = React.useState(FetchState.initial);
	const [searchText, setSearchText] = useState("");

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

			<Box>
				<Input
					style={{ flex: 3, marginRight: "10%" }}
					id="search"
					type="text"
					placeholder="Buscar..."
					value={searchText}
					onChange={(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void => setSearchText(e.target.value)}
				/>
			</Box>
		</Card>
	);
}
