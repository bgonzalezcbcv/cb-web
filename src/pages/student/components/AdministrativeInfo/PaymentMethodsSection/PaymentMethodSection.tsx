/* eslint-disable */
import React, { useCallback, useState } from "react";
import * as Models from "../../../../../core/Models";
import { VisualComponent } from "../../../../../core/interfaces";
import Modal from "../../../../../components/modal/Modal";
import PaymentMethodHistory from "../historyTables/PaymentMethodHistory";
import { Card, CardContent, Divider, Container, Box, IconButton, Typography } from "@mui/material";
import { JsonForms } from "@jsonforms/react";
import { JsonSchema7, Translator } from "@jsonforms/core";
import { materialCells, materialRenderers } from "@jsonforms/material-renderers";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import schema from "../../../schema.json";
import ui from "./ui.json";

import "./PaymentMethodSection.scss";

export type PaymentMethodSectionProps = {
	editable: boolean;
	student: Models.Student;
	onChange: (data: Models.Student) => void;
};

export default function PaymentMethodSection(props: VisualComponent & PaymentMethodSectionProps): React.ReactElement {
	const { editable, student, onChange } = props;

	const [paymentMethodModalOpen, setPaymentMethodModalOpen] = React.useState(false);
	const [paymentMethodData, setPaymentMethodData] = useState<Models.PaymentMethod>({} as Models.PaymentMethod);
	const [hasFormErrors, setHasFormErrors] = useState<boolean>(false);

	const handlePaymentMethodModalOpen = useCallback(() => {
		setPaymentMethodModalOpen(true);
	}, []);

	const handlePaymentMethodModalClose = useCallback(() => {
		setPaymentMethodModalOpen(false);
		setPaymentMethodData({} as Models.PaymentMethod);
	}, []);

	//TODO: Adjust this when file handling is defined
	const handleAddNewPaymentMethod = useCallback((paymentData: Models.PaymentMethod) => {
		const newPaymentMethod: Models.PaymentMethod = {
			year: paymentData.year,
			method: paymentData.method as Models.PaymentMethodOption,
			yearly_payment_url: paymentData.yearly_payment_url,
		};

		const updatedStudent = {
			...student,
			administrative_info: { ...student.administrative_info, payment_methods: [newPaymentMethod, ...student.administrative_info.payment_methods] },
		};
		onChange(updatedStudent);
		handlePaymentMethodModalClose();
	}, []);

	const translator = (id: string, defaultMessage: string | undefined): string => {
		if (id.includes("error")) return "Este campo es requerido";
		return defaultMessage ?? "";
	};

	// @ts-ignore
	return (
		<Card className="payment-method-container">
			<CardContent className="payment-content">
				<Box className="payment-header">
					<Typography variant={"subtitle1"}>Formas de pago</Typography>

					<Box>
						{editable && (
							<IconButton color="secondary" onClick={handlePaymentMethodModalOpen}>
								<AddCircleOutlineIcon />
							</IconButton>
						)}

						<Modal
							show={paymentMethodModalOpen}
							title={"Agregar una nueva forma de pago"}
							onClose={handlePaymentMethodModalClose}
							onAccept={() => {
								handleAddNewPaymentMethod(paymentMethodData);
							}}
							acceptEnabled={!hasFormErrors}>
							<Container className="payment-method-modal-wrapper">
								<JsonForms
									i18n={{ translate: translator as Translator }}
									schema={schema.properties.administrative_info.properties.payment_methods.items[0] as JsonSchema7}
									uischema={ui}
									data={paymentMethodData}
									renderers={materialRenderers}
									cells={materialCells}
									onChange={({ data, errors }): void => {
										setPaymentMethodData(data);
										setHasFormErrors(errors?.length != 0);
									}}
								/>
							</Container>
						</Modal>
					</Box>
				</Box>

				<Divider />

				<PaymentMethodHistory rows={student!.administrative_info.payment_methods} />
			</CardContent>
		</Card>
	);
}
