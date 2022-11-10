/* eslint-disable */
import React, { useCallback, useState } from "react";

import { Box, Card, CardContent, Divider, IconButton, Typography, Container, CircularProgress, Alert } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import * as Models from "../../../../../core/Models";
import { PaymentMethod, PaymentMethodOption, StudentTypeScholarship } from "../../../../../core/Models";
import PaymentMethodHistory from "../PaymentMethodsSection/PaymentMethodHistory";
import useFetchFromAPI, { FetchStatus } from "../../../../../hooks/useFetchFromAPI";
import { fetchStudentTypeScholarships } from "../../../../../core/ApiStore";
import AddStudentTypeScholarship from "./AddStudentTypeScholarship";
import TypeScholarshipHistory from "./TypeScholarshipHistory";

type TypeScholarshipSectionProps = {
	editable: boolean;
	student: Models.Student;
};

export default function TypeScholarshipSection(props: TypeScholarshipSectionProps): React.ReactElement {
	const { editable, student } = props;

	const [studentTypeScholarships, setStudentTypeScholarships] = useState<StudentTypeScholarship[]>();
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);

	const { fetchStatus, refetch } = useFetchFromAPI(() => fetchStudentTypeScholarships(Number(student.id)), setStudentTypeScholarships);

	const handleModalOpen = useCallback(() => {
		setIsAddModalOpen(true);
	}, []);

	const handleModalClose = useCallback((added = false) => {
		setIsAddModalOpen(false);

		if (added) refetch();
	}, []);

	if (fetchStatus === FetchStatus.Fetching) return <CircularProgress />;

	if (fetchStatus === FetchStatus.Error)
		return (
			<Alert variant="outlined" severity="error" style={{ cursor: "pointer" }} onClick={refetch}>
				<Typography>No se pudieron obtener los métodos de pago. Haga click aquí para reintentar.</Typography>
			</Alert>
		);

	return (
		<Card className="payment-method-container">
			<CardContent className="payment-content">
				<Container className="payment-header" sx={{ display: "flex" }}>
					<Typography variant={"subtitle1"}>Escolaridad</Typography>
					<Box>
						{editable && (
							<IconButton color="secondary" onClick={handleModalOpen}>
								<AddCircleOutlineIcon />
							</IconButton>
						)}
					</Box>

					<AddStudentTypeScholarship isOpen={isAddModalOpen} studentId={student.id} onClose={handleModalClose} />
				</Container>

				<Divider />

				<TypeScholarshipHistory rows={studentTypeScholarships ?? []} height={210} />
			</CardContent>
		</Card>
	);
}
