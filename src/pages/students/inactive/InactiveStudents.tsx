import React, { useState } from "react";

import { Alert, CircularProgress } from "@mui/material";

import { Student } from "../../../core/Models";
import { fetchInactiveStudents } from "../../../core/ApiStore";
import Students from "../Students";
import useFetchFromAPI, { FetchStatus } from "../../../hooks/useFetchFromAPI";

export default function InactiveStudents(): JSX.Element {
	const [students, setStudents] = useState<Student[]>();
	const { fetchStatus, refetch } = useFetchFromAPI(() => fetchInactiveStudents(), setStudents);

	if (fetchStatus === FetchStatus.Fetching) return <CircularProgress />;

	if (fetchStatus === FetchStatus.Error)
		return (
			<Alert severity="error" variant="outlined" onClick={refetch} style={{ cursor: "pointer" }}>
				No se pudieron obtener los alumnos inactivos. Haga click aquí para reintentar.
			</Alert>
		);

	return <Students title="Alumnos inactivos" rows={students} />;
}
