/* eslint-disable */
import React, { useState } from "react";
import { useTheme } from "@material-ui/core";
import EditIcon from "@mui/icons-material/Edit";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import LastPageIcon from "@mui/icons-material/LastPage";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import { visuallyHidden } from "@mui/utils";
import IconButton from "@mui/material/IconButton";

import data from "./data.json";
import {
	TableContainer,
	Table,
	TableHead,
	TableBody,
	TableRow,
	TableCell,
	Paper,
	Tooltip,
	TableFooter,
	TablePagination,
	Box,
	TableSortLabel,
} from "@mui/material";

import "./StudentsList.scss";
import useEnhancedEffect from "@mui/material/utils/useEnhancedEffect";

interface Data {
	id: number;
	ci: string;
	surnames: string;
	names: string;
}

function createData(id: number, ci: string, surnames: string, names: string): Data {
	return {
		id,
		ci,
		surnames,
		names,
	};
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
	if (b[orderBy] < a[orderBy]) {
		return -1;
	}
	if (b[orderBy] > a[orderBy]) {
		return 1;
	}
	return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
	order: Order,
	orderBy: Key
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
	return order === "desc" ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
	const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
	stabilizedThis.sort((a, b) => {
		const order = comparator(a[0], b[0]);
		if (order !== 0) {
			return order;
		}
		return a[1] - b[1];
	});
	return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
	disablePadding: boolean;
	id: keyof Data;
	label: string;
	numeric: boolean;
}

const headCells: readonly HeadCell[] = [
	{
		id: "id",
		numeric: true,
		disablePadding: false,
		label: "ID",
	},
	{
		id: "ci",
		numeric: false,
		disablePadding: true,
		label: "CI",
	},
	{
		id: "surnames",
		numeric: false,
		disablePadding: true,
		label: "Apellidos",
	},
	{
		id: "names",
		numeric: false,
		disablePadding: true,
		label: "Nombres",
	},
];

interface EnhancedTableProps {
	numSelected: number;
	onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
	order: Order;
	orderBy: string;
	rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
	const { order, orderBy, numSelected, rowCount, onRequestSort } = props;
	const createSortHandler = (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
		onRequestSort(event, property);
	};

	return (
		<TableHead>
			<TableRow>
				{headCells.map((headCell) => (
					<TableCell
						key={headCell.id}
						align={headCell.numeric ? "right" : "left"}
						padding={headCell.disablePadding ? "none" : "normal"}
						sortDirection={orderBy === headCell.id ? order : false}>
						<TableSortLabel
							active={orderBy === headCell.id}
							direction={orderBy === headCell.id ? order : "asc"}
							onClick={createSortHandler(headCell.id)}>
							{headCell.label}
							{orderBy === headCell.id ? (
								<Box component="span" sx={visuallyHidden}>
									{order === "desc" ? "sorted descending" : "sorted ascending"}
								</Box>
							) : null}
						</TableSortLabel>
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	);
}

//----------------------------------------------------------------------------------

interface TablePaginationActionsProps {
	count: number;
	page: number;
	rowsPerPage: number;
	onPageChange: (event: React.MouseEvent<HTMLButtonElement>, newPage: number) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
	const theme = useTheme();
	const { count, page, rowsPerPage, onPageChange } = props;

	const handleFirstPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		onPageChange(event, 0);
	};

	const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		onPageChange(event, page - 1);
	};

	const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		onPageChange(event, page + 1);
	};

	const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
	};

	return (
		<Box sx={{ flexShrink: 0, ml: 2.5 }}>
			<IconButton onClick={handleFirstPageButtonClick} disabled={page === 0} aria-label="first page">
				{theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
			</IconButton>
			<IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
				{theme.direction === "rtl" ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
			</IconButton>
			<IconButton onClick={handleNextButtonClick} disabled={page >= Math.ceil(count / rowsPerPage) - 1} aria-label="next page">
				{theme.direction === "rtl" ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
			</IconButton>
			<IconButton onClick={handleLastPageButtonClick} disabled={page >= Math.ceil(count / rowsPerPage) - 1} aria-label="last page">
				{theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
			</IconButton>
		</Box>
	);
}

//----------------------------------------------------------------------------------

export default function StudentsList() {
	const [students, setStudents] = useState([]);

	const URL = "https://cbcv-staging.herokuapp.com/api/students";
	const showData = async () => {
		const response = await fetch(URL);
		const data = await response.json();
		console.log(data);
		setStudents(data);
	};

	useEnhancedEffect(() => {
		showData();
	}, []);

	const [order, setOrder] = useState<Order>("asc");
	const [orderBy, setOrderBy] = useState<keyof Data>("ci");
	const [selected, setSelected] = useState<readonly string[]>([]);

	const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof Data) => {
		const isAsc = orderBy === property && order === "asc";
		setOrder(isAsc ? "desc" : "asc");
		setOrderBy(property);
	};

	//----------------------------------------------------------------------------------

	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(5);

	// Avoid a layout jump when reaching the last page with empty rows.
	const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

	const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	return (
		<Box>
			<Paper sx={{ width: "100%", mb: 2 }}>
				<TableContainer className="studentsTableContainer" component={Paper}>
					<Table aria-label="custom pagination table">
						<EnhancedTableHead
							numSelected={selected.length}
							order={order}
							orderBy={orderBy}
							onRequestSort={handleRequestSort}
							rowCount={data.length}
						/>
						{/* <TableHead className="headStudentsTable">
                            <TableRow>
                                <TableCell className="headCellStudentsTable" width={"10%"}>ID</TableCell>
                                <TableCell className="headCellStudentsTable" width={"20%"}>CI</TableCell>
                                <TableCell className="headCellStudentsTable" width={"20%"}>Apellidos</TableCell>
                                <TableCell className="headCellStudentsTable" width={"20%"}>Nombres</TableCell>
                                <TableCell className="headCellStudentsTable" width={"10%"}></TableCell>
                            </TableRow>
                        </TableHead> */}
						<TableBody>
							{stableSort(data, getComparator(order, orderBy))
								.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
								.map((row) => {
									return (
										<TableRow>
											<TableCell align="right">{row.id}</TableCell>
											<TableCell align="right">{row.ci}</TableCell>
											<TableCell align="right">{row.surnames}</TableCell>
											<TableCell align="right">{row.names}</TableCell>
											<Tooltip title="Edit">
												<IconButton
													onClick={() => {
														alert("Editar estudiante " + row.ci);
													}}>
													<EditIcon />
												</IconButton>
											</Tooltip>
										</TableRow>
									);
								})}
							{/* {(rowsPerPage > 0
                                ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                : data
                                ).map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell>{row.id}</TableCell>
                                        <TableCell>{row.ci}</TableCell>
                                        <TableCell>{row.surnames}</TableCell>
                                        <TableCell>{row.names}</TableCell>
                                        <Tooltip title="Edit">
                                            <IconButton onClick={() => {
                                                alert("Editar estudiante "+row.ci);
                                                }}>
                                                <EditIcon/>
                                            </IconButton>
                                        </Tooltip>
                                    </TableRow>
                                ))} */}
							{emptyRows > 0 && (
								<TableRow>
									<TableCell colSpan={6} />
								</TableRow>
							)}
						</TableBody>
						<TableFooter>
							<TableRow>
								<TablePagination
									rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
									colSpan={3}
									count={data.length}
									rowsPerPage={rowsPerPage}
									page={page}
									SelectProps={{
										inputProps: {
											"aria-label": "rows per page",
										},
										native: true,
									}}
									onPageChange={handleChangePage}
									onRowsPerPageChange={handleChangeRowsPerPage}
									ActionsComponent={TablePaginationActions}
								/>
							</TableRow>
						</TableFooter>
					</Table>
				</TableContainer>
			</Paper>
		</Box>
	);
}
