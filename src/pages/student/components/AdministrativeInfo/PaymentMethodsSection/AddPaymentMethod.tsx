import _ from "lodash";
import React, { useMemo, useState } from "react";

import { Alert, Container, Typography } from "@mui/material";

import { PaymentMethodOption, PaymentMethodWithFile } from "../../../../../core/Models";
import Modal from "../../../../../components/modal/Modal";
import Dropdown from "../../../../../components/Dropdown/Dropdown";
import FileUploader from "../../../../../components/fileUploader/FileUploader";
import { createPaymentMethod } from "../../../../../core/ApiStore";
import { FetchState } from "../../../../../core/interfaces";
import DatePickerToString from "../../../../../components/datePicker/DatePicker";

interface AddPaymentMethodProps {
	studentId: number | string;
	isOpen: boolean;
	onClose: (added?: boolean) => void;
	paymentMethodOptions: PaymentMethodOption[];
}

function AddPaymentMethod(props: AddPaymentMethodProps): JSX.Element {
	const { studentId, isOpen, onClose, paymentMethodOptions } = props;

	const options = useMemo(
		//
		() => paymentMethodOptions.map(({ id, method }) => ({ text: method, value: id })),
		[paymentMethodOptions]
	);

	const defaultPayment = useMemo(() => ({ payment_method_id: options[0]?.value } as PaymentMethodWithFile), [options]);

	const [newPaymentMethod, setNewPaymentMethod] = useState<PaymentMethodWithFile>(defaultPayment);
	const [postingState, setPostingState] = useState<FetchState>(FetchState.initial);

	function handleDismiss(added = false): void {
		setNewPaymentMethod(defaultPayment);
		setPostingState(FetchState.initial);
		onClose(added);
	}

	async function handleAddNewPaymentMethod(): Promise<void> {
		setPostingState(FetchState.loading);

		const { success } = await createPaymentMethod(Number(studentId), newPaymentMethod);

		if (success) handleDismiss(true);
	}

	const setProperty = (key: string) => (value: unknown) => value !== 0 && setNewPaymentMethod({ ...newPaymentMethod, [key]: value });

	return (
		<Modal
			show={isOpen}
			title={"Agregar una nueva forma de pago"}
			acceptEnabled={![newPaymentMethod.payment_method_id, newPaymentMethod.year].some(_.isUndefined)}
			onClose={handleDismiss}
			onAccept={handleAddNewPaymentMethod}>
			<Container className="payment-method-modal-wrapper" sx={{ display: "flex", gap: "12px" }}>
				<DatePickerToString label="Año" editable date={newPaymentMethod.year} onChange={setProperty("year")} />

				<Dropdown label="Opciones de pago" options={options} value={newPaymentMethod.payment_method_id} onChange={setProperty("payment_method_id")} />

				<Alert severity="info">
					<Typography variant="body1">En caso de pago en efectivo, subir el pago de anualidad firmado:</Typography>

					<FileUploader label={"Pago de anualidad firmado"} width={"100%"} uploadedFile={setProperty("annual_payment")} />
				</Alert>

				{postingState === FetchState.failure ? (
					<Alert severity="error">Fallo al subir nuevo método de pago. Reintentar volviendo a aceptar.</Alert>
				) : null}
			</Container>
		</Modal>
	);
}

export default AddPaymentMethod;
