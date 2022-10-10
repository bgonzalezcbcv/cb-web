/* eslint-disable */
import React, { useCallback, useState } from "react";

import * as Models from "../../../../../core/Models";
import { VisualComponent } from "../../../../../core/interfaces";
import Modal from "../../../../../components/modal/Modal";
import PaymentMethodHistory from "../historyTables/PaymentMethodHistory";
import FileUploader from "../../../../../components/fileUploader/FileUploader";
import { Box, Card, CardContent, Divider, IconButton, Typography, Container } from "@mui/material";
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
	const handleAddNewPaymentMethod = useCallback((paymentData: Models.PaymentMethod, student: Models.Student) => {
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

	function setYearlyPaymentFile(file: File | undefined): void {
		//TODO
	}

	// @ts-ignore
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

						<Modal
							show={paymentMethodModalOpen}
							title={"Agregar una nueva forma de pago"}
							onClose={handlePaymentMethodModalClose}
							onAccept={() => {
								handleAddNewPaymentMethod(paymentMethodData, student);
							}}
							acceptEnabled={!hasFormErrors}>
							<Container className="payment-method-modal-wrapper" sx={{ display: "flex" }}>
								<JsonForms
									i18n={{ translate: translator as Translator }}
									schema={schema.properties.administrative_info.properties.payment_methods.items as JsonSchema7}
									uischema={ui}
									data={paymentMethodData}
									renderers={materialRenderers}
									cells={materialCells}
									onChange={({ data, errors }): void => {
										setPaymentMethodData(data);
										setHasFormErrors(errors?.length != 0);
									}}
								/>
								{paymentMethodData.method == Models.PaymentMethodOption.Cash.valueOf() ? (
									<FileUploader label={"Pago de anualidad firmado"} width={"100%"} uploadedFile={(file) => setYearlyPaymentFile(file)} />
								) : null}
							</Container>
						</Modal>
					</Box>
				</Container>

				<Divider />

				<PaymentMethodHistory rows={student!.administrative_info.payment_methods} height={210} />
			</CardContent>
		</Card>
	);
}
