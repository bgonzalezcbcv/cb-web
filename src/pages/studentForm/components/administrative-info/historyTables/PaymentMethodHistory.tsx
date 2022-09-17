import React from "react";
import * as Models from "../../../../../core/Models";
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

export type PaymentMethodHistoryProps = {
    rows?: Models.PaymentMethod[];
}

export default function PaymentMethodHistory(props: PaymentMethodHistoryProps): React.ReactElement {
    const {rows} = props;

    return (
        <TableContainer style={{height: 160}}>
            <Table sx={{width: '100%'}} stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{fontWeight: 600}}>Año</TableCell>
                        <TableCell sx={{fontWeight: 600}}>Forma</TableCell>
                        <TableCell sx={{fontWeight: 600}}>Documento</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows && rows.map((row) => (
                        <TableRow
                            key={row.year}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {row.year}
                            </TableCell>
                            <TableCell>{row.method}</TableCell>
                            {/*TODO: Add handle to download file*/}
                            <TableCell>{row.yearly_payment_url ? <DownloadIcon style={{marginLeft: 25}} /> : ""}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}