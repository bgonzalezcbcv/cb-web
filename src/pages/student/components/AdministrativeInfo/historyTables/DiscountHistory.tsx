import React from "react";

import * as Models from "../../../../../core/Models";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

export type DiscountHistoryProps = {
	rows?: Models.Discount[];
};

export default function DiscountHistory(props: DiscountHistoryProps): React.ReactElement {
	const { rows } = props;

	return (
		<TableContainer style={{ height: 240 }}>
			<Table sx={{ width: "100%" }} stickyHeader>
				<TableHead>
					<TableRow hover>
						<TableCell sx={{ fontWeight: 600 }}>Comienzo</TableCell>
						<TableCell sx={{ fontWeight: 600 }}>Fin</TableCell>
						<TableCell sx={{ fontWeight: 600 }}>%</TableCell>
						<TableCell sx={{ fontWeight: 600 }}>Explicación</TableCell>
						<TableCell sx={{ fontWeight: 600 }}>Descripción</TableCell>
						<TableCell sx={{ fontWeight: 600 }}>Resolución</TableCell>
						<TableCell sx={{ fontWeight: 600 }}>Tipo</TableCell>
						<TableCell sx={{ fontWeight: 600 }}>Informe</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{rows &&
						rows.map((row, index) => (
							<TableRow key={index} hover>
								<TableCell>{row.starting_date.toLocaleDateString("es")}</TableCell>
								<TableCell>{row.ending_date.toLocaleDateString("es")}</TableCell>
								<TableCell>{row.percentage + "%"}</TableCell>
								<TableCell>{row.explanation}</TableCell>
								<TableCell>{row.description}</TableCell>
								{/*TODO: Add handle to download file*/}
								<TableCell>{<DownloadIcon style={{ marginLeft: 25 }} />}</TableCell>
								<TableCell>{row.type}</TableCell>
								{/*TODO: Add handle to download file*/}
								<TableCell>{<DownloadIcon style={{ marginLeft: 25 }} />}</TableCell>
							</TableRow>
						))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}
