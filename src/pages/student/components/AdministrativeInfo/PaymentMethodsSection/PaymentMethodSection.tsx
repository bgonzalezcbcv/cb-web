/* eslint-disable */
import React, { useCallback, useState } from "react";
import * as Models from "../../../../../core/Models";
import { VisualComponent } from "../../../../../core/interfaces";
import Modal from "../../../../../components/modal/Modal";
import PaymentMethodHistory from "../historyTables/PaymentMethodHistory";
import { Card, CardContent, Divider } from "@mui/material";
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

	const handlePaymentMethodModalOpen = useCallback(() => {
		setPaymentMethodModalOpen(true);
	}, []);

	const handlePaymentMethodModalClose = useCallback(() => {
		setPaymentMethodModalOpen(false);
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
				<div className="payment-header">
					<h4>Formas de pago</h4>

					<div>
						{editable && <AddCircleOutlineIcon onClick={handlePaymentMethodModalOpen} />}

						<Modal
							show={paymentMethodModalOpen}
							title={"Agregar una nueva forma de pago"}
							body={
								<div className="payment-method-modal-wrapper">
									<JsonForms
										i18n={{ translate: translator as Translator }}
										schema={schema as JsonSchema7}
										uischema={ui}
										data={{ administrative_info: { payment_methods: [paymentMethodData] } }}
										renderers={materialRenderers}
										cells={materialCells}
										onChange={({ data, errors }): void => {
											if (data?.administrative_info?.payment_methods && data.administrative_info.payment_methods.length > 0) {
												const info = data.administrative_info.payment_methods[0];
												setPaymentMethodData(info);
											}
										}}
									/>
								</div>
							}
							onClose={handlePaymentMethodModalClose}
							onAccept={() => {
								handleAddNewPaymentMethod(paymentMethodData);
							}}
						/>
					</div>
				</div>

				<Divider />

				<PaymentMethodHistory rows={student!.administrative_info.payment_methods} />
			</CardContent>
		</Card>
	);
}
