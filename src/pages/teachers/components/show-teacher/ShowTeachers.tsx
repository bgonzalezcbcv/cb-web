import React from "react";
import { Box } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { VisualComponent } from "../../../../core/interfaces";
import { DataStore } from "../../../../core/DataStore";
import { observer } from "mobx-react-lite";

function ShowTeachers(props: VisualComponent): React.ReactElement {
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
