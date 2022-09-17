import React from "react";
import {Link} from "react-router-dom";
import * as Models from "../../../../../core/Models";
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material"
import DownloadIcon from "@mui/icons-material/Download";

export type DiscountHistoryProps = {
    rows: Models.Discount[];
}

export default function DiscountHistory(props: DiscountHistoryProps): React.ReactElement {
    const {rows} = props;

    return (
        <TableContainer className="discount-history">
            <Table sx={{ width: '100%'}} stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{fontWeight: 600}}>Fecha inicio</TableCell>
                        <TableCell sx={{fontWeight: 600}}>Fecha fin</TableCell>
                        <TableCell sx={{fontWeight: 600}}>Porcentaje</TableCell>
                        <TableCell sx={{fontWeight: 600}}>Explicación</TableCell>
                        <TableCell sx={{fontWeight: 600}}>Descripción</TableCell>
                        <TableCell sx={{fontWeight: 600}}>Resolución</TableCell>
                        <TableCell sx={{fontWeight: 600}}>Tipo</TableCell>
                        <TableCell sx={{fontWeight: 600}}>Informe administrativo</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, index) => (
                        <TableRow
                            key={index}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell>{row.starting_date.toLocaleDateString('es')}</TableCell>
                            <TableCell>{row.ending_date.toLocaleDateString('es')}</TableCell>
                            <TableCell>{row.percentage + '%'}</TableCell>
                            <TableCell>{row.explanation}</TableCell>
                            <TableCell>{row.description}</TableCell>
                            <TableCell>{<Link to={row.resolution_url} target="_blank" download><DownloadIcon style={{marginLeft: 25, color: 'black'}} /></Link>}</TableCell>
                            <TableCell>{row.type}</TableCell>
                            <TableCell>{<Link to={row.report_url} target="_blank" download><DownloadIcon style={{marginLeft: 25, color: 'black'}} /></Link>}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}