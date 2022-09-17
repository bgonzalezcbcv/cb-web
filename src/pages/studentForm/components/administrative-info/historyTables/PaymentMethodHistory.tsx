import React from "react";
import {Link} from "react-router-dom";
import * as Models from "../../../../../core/Models";
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

export type PaymentMethodHistoryProps = {
    rows: Models.PaymentMethod[];
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
                    {rows.map((row) => (
                        <TableRow
                            key={row.year}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {row.year}
                            </TableCell>
                            <TableCell>{row.method}</TableCell>
                            <TableCell>{row.yearly_payment_url ? <Link to={row.yearly_payment_url} target="_blank" download><DownloadIcon style={{marginLeft: 25, color: "black"}} /></Link> : ""}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}