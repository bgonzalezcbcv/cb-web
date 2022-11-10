/* eslint-disable */
import React, { useCallback, useState } from "react";

import { Box, Card, CardContent, Divider, IconButton, Typography, Container, CircularProgress, Alert } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import * as Models from "../../../../../core/Models";
import { PaymentMethod, PaymentMethodOption } from "../../../../../core/Models";
import { fetchPaymentMethod, fetchPaymentMethodList } from "../../../../../core/ApiStore";
import AddPaymentMethod from "./AddPaymentMethod";
import PaymentMethodHistory from "./PaymentMethodHistory";
import useFetchFromAPI, { FetchStatus } from "../../../../../hooks/useFetchFromAPI";

import "./PaymentMethodSection.scss";

type PaymentMethodSectionProps = {
	editable: boolean;
	student: Models.Student;
};

export default function PaymentMethodSection(props: PaymentMethodSectionProps): React.ReactElement {
	const { editable, student } = props;

	const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
	const [paymentMethodsOptions, setPaymentMethodsOptions] = useState<PaymentMethodOption[]>([]);
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);

	const { fetchStatus: fetchStatusPaymentMethods, refetch: refetchPaymentMethods } = useFetchFromAPI(() => fetchPaymentMethod(student.id), setPaymentMethods);
	const { fetchStatus: fetchStatusPaymentMethodsOptions } = useFetchFromAPI(() => fetchPaymentMethodList(), setPaymentMethodsOptions);

	const handlePaymentMethodModalOpen = useCallback(() => {
		setIsAddModalOpen(true);
	}, []);

	const handlePaymentMethodModalClose = useCallback((methodAdded = false) => {
		setIsAddModalOpen(false);

		if (methodAdded) refetchPaymentMethods();
	}, []);

	if (fetchStatusPaymentMethods === FetchStatus.Fetching || fetchStatusPaymentMethodsOptions === FetchStatus.Fetching) return <CircularProgress />;

	if (fetchStatusPaymentMethods === FetchStatus.Error || fetchStatusPaymentMethodsOptions === FetchStatus.Error)
		return (
			<Alert variant="outlined" severity="error" style={{ cursor: "pointer" }} onClick={refetchPaymentMethods}>
				<Typography>No se pudieron obtener los métodos de pago. Haga click aquí para reintentar.</Typography>
			</Alert>
		);

	return (
		<Card className="payment-method-container">
			<CardContent className="payment-content">
				<Container className="payment-header" sx={{ display: "flex" }}>
					<Typography variant={"subtitle1"}>Formas de pago</Typography>
					<Box>
						{editable && (
							<IconButton color="secondary" onClick={handlePaymentMethodModalOpen}>
								<AddCircleOutlineIcon />
							</IconButton>
						)}
					</Box>

					<AddPaymentMethod
						isOpen={isAddModalOpen}
						studentId={student.id}
						onClose={handlePaymentMethodModalClose}
						paymentMethodOptions={paymentMethodsOptions}
					/>
				</Container>

				<Divider />

				<PaymentMethodHistory rows={paymentMethods ?? []} height={210} />
			</CardContent>
		</Card>
	);
}
