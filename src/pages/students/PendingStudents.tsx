import React, { useState } from "react";

import { Alert, CircularProgress } from "@mui/material";

import { Student } from "../../core/Models";
import useFetchFromAPI, { FetchStatus } from "../../hooks/useFetchFromAPI";
import Students from "./Students";
import * as APIStore from "../../core/ApiStore";

export default function PendingStudents(): JSX.Element {
	const [students, setStudents] = useState<Student[]>();
	const { fetchStatus, refetch } = useFetchFromAPI(() => APIStore.fetchPendingStudents(), setStudents);

	if (fetchStatus === FetchStatus.Fetching) return <CircularProgress />;

	if (fetchStatus === FetchStatus.Error)
		return (
			<Alert severity="error" variant="outlined" onClick={refetch} style={{ cursor: "pointer" }}>
				No se pudieron obtener los alumnos pendientes.
			</Alert>
		);

	return <Students rows={students} />;
}
