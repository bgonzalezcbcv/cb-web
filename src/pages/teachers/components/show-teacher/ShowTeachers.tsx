import React from "react";
import { Box } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { VisualComponent } from "../../../../core/interfaces";
import { DataStore } from "../../../../core/DataStore";
import { observer } from "mobx-react-lite";

interface ShowTeachersProps extends VisualComponent {}

function ShowTeachers(props: ShowTeachersProps) {
	const { width, height } = props;

	const dataStore = DataStore.getInstance();

	const columns: GridColDef[] = [
		{ field: "id", headerName: "ID", width: 40 },
		{
			field: "ci",
			headerName: "Cedula",
			width: 160,
			editable: false,
		},
		{
			field: "firstName",
			headerName: "Nombres",
			width: 150,
			editable: false,
		},
		{
			field: "lastName",
			headerName: "Apellidos",
			width: 150,
			editable: false,
		},
		{
			field: "subjects",
			headerName: "Materias",
			width: 150,
			editable: false,
		},
	];

	const rows = [
		{ id: 1, ci: "5.168.111-7", lastName: "Snow", firstName: "Jon" },
		{
			id: 2,
			ci: "5.222.111-7",
			lastName: "Lannister",
			firstName: "Cersei",
		},
		{ id: 3, ci: "5.333.111-7", lastName: "Lannister", firstName: "Jaime" },
	];

	return (
		<Box sx={{ height: height ?? "100%", width: width ?? "100%" }}>
			<DataGrid
				rows={dataStore.teachers.map((teacher, index) => ({
					id: index,
					...teacher,
				}))}
				columns={columns}
				pageSize={5}
				rowsPerPageOptions={[5]}
				checkboxSelection
				disableSelectionOnClick
				experimentalFeatures={{ newEditingApi: true }}
			/>
		</Box>
	);
}

export default observer(ShowTeachers);
