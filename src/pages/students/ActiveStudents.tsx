import React, { useState } from "react";

import { Alert, CircularProgress } from "@mui/material";

import { Student } from "../../core/Models";
import { fetchActiveStudents } from "../../core/ApiStore";
import useFetchFromAPI, { FetchStatus } from "../../hooks/useFetchFromAPI";
import Students from "./Students";

function ActiveStudents(): JSX.Element {
	const [students, setStudents] = useState<Student[]>();
	const { fetchStatus, refetch } = useFetchFromAPI(() => fetchActiveStudents(), setStudents);

	if (fetchStatus === FetchStatus.Fetching) return <CircularProgress />;

	if (fetchStatus === FetchStatus.Error)
		return (
			<Alert severity="error" variant="outlined" onClick={refetch} style={{ cursor: "pointer" }}>
				No se pudieron obtener los alumnos activos.
			</Alert>
		);

	return <Students title="Alumnos activos" rows={students} />;
}

export default ActiveStudents;
