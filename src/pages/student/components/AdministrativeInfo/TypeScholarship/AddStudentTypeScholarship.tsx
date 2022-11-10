import _ from "lodash";
import React, { useCallback, useMemo, useState } from "react";

import { Alert, CircularProgress, Container, Typography } from "@mui/material";

import { ScholarshipType, StudentTypeScholarship, TypeScholarship } from "../../../../../core/Models";
import Modal from "../../../../../components/modal/Modal";
import Dropdown from "../../../../../components/Dropdown/Dropdown";
import { createStudentTypeScholarship, fetchTypeScholarships } from "../../../../../core/ApiStore";
import useFetchFromAPI, { FetchStatus } from "../../../../../hooks/useFetchFromAPI";

interface AddTypeScholarshipProps {
	studentId: number | string;
	isOpen: boolean;
	onClose: (added?: boolean) => void;
}

function AddStudentTypeScholarship(props: AddTypeScholarshipProps): JSX.Element {
	const { studentId, isOpen, onClose } = props;

	const [typeScholarships, setTypeScholarships] = useState<TypeScholarship[]>();
	const [newStudentTypeScholarship, setNewStudentTypeScholarship] = useState({ student_id: studentId } as StudentTypeScholarship);
	const [creationState, setCreationState] = useState<FetchStatus>(FetchStatus.Initial);

	const { fetchStatus, refetch } = useFetchFromAPI(() => fetchTypeScholarships(), setTypeScholarships);

	const scholarships = useMemo(() => {
		return (typeScholarships ?? []).map(({ id, scholarship, description }) => {
			return {
				scholarship,
				text: ScholarshipType[scholarship as keyof typeof ScholarshipType],
				value: id,
				description: description,
			};
		});
	}, [typeScholarships]);

	const selectedScholarship = useMemo(() => {
		return typeScholarships?.find((typeScholarship) => typeScholarship.id === newStudentTypeScholarship.type_scholarship_id)?.scholarship;
	}, [typeScholarships, newStudentTypeScholarship]);

	const handleDismiss = useCallback(
		(commit = false) => {
			if (commit) onClose(true);
			else onClose();
		},
		[onClose]
	);

	const handleAccept = useCallback(async (): Promise<void> => {
		setCreationState(FetchStatus.Fetching);

		const { success } = await createStudentTypeScholarship(newStudentTypeScholarship);

		if (success) handleDismiss(true);
		else {
			setCreationState(FetchStatus.Error);

			setTimeout(() => setCreationState(FetchStatus.Initial), 5000);
		}
	}, [handleDismiss, newStudentTypeScholarship]);

	const setProperty = (key: string) => (value: unknown) => value !== 0 && setNewStudentTypeScholarship({ ...newStudentTypeScholarship, [key]: value });

	function creationIndicator(): React.ReactElement | null {
		switch (creationState) {
			case FetchStatus.Error:
				return (
					<Alert severity="error" variant="outlined">
						No se pudo registar la nueva escolaridad para el alumno. Intente de nuevo.
					</Alert>
				);
			case FetchStatus.Fetching:
				return <CircularProgress />;
			case FetchStatus.Initial:
			default:
				return null;
		}
	}

	function getBody(): React.ReactElement {
		if (fetchStatus === FetchStatus.Fetching) return <CircularProgress />;

		if (fetchStatus === FetchStatus.Error)
			return (
				<Alert variant="outlined" severity="error" style={{ cursor: "pointer" }} onClick={refetch}>
					<Typography>No se pudieron obtener los métodos tipos de escolaridad. Haga click aquí para reintentar.</Typography>
				</Alert>
			);

		return (
			<>
				<Dropdown
					label="Escolaridad"
					options={_.uniqBy(scholarships, "text")}
					value={newStudentTypeScholarship.type_scholarship_id}
					onChange={setProperty("type_scholarship_id")}
				/>

				{["agreement", "bidding"].includes(selectedScholarship ?? "") ? (
					<Dropdown
						label="Convenio"
						options={scholarships
							.filter(({ scholarship }) => scholarship === selectedScholarship)
							.map(({ description, value }) => ({
								text: description,
								value,
							}))}
						value={newStudentTypeScholarship.type_scholarship_id}
						onChange={setProperty("type_scholarship_id")}
					/>
				) : null}
			</>
		);
	}

	return (
		<Modal
			show={isOpen}
			title="Agregar una nueva escolaridad"
			acceptEnabled={newStudentTypeScholarship.type_scholarship_id !== undefined}
			onClose={handleDismiss}
			onAccept={handleAccept}>
			<Container className="payment-method-modal-wrapper" sx={{ display: "flex", gap: "12px" }}>
				{getBody()}

				{creationIndicator()}
			</Container>
		</Modal>
	);
}

export default AddStudentTypeScholarship;
