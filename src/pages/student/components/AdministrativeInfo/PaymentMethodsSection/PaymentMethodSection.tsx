/* eslint-disable */
import React, { useCallback, useState } from "react";
import * as Models from "../../../../../core/Models";
import { VisualComponent } from "../../../../../core/interfaces";
import FileUploader from "../../../../../components/fileUploader/FileUploader";
import Modal from "../../../../../components/modal/Modal";
import PaymentMethodHistory from "../historyTables/PaymentMethodHistory";
import { Card, CardContent, Divider, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import "./PaymentMethodSection.scss";

export type PaymentMethodSectionProps = {
	editable: boolean;
	student: Models.Student;
	onChange: (data: Models.Student) => void;
};

export default function PaymentMethodSection(props: VisualComponent & PaymentMethodSectionProps): React.ReactElement {
	const { editable, student, onChange } = props;

	const [paymentMethodModalOpen, setPaymentMethodModalOpen] = React.useState(false);
	const [paymentMethod, setPaymentMethod] = useState("");
	const [paymentMethodYear, setPaymentMethodYear] = useState("");
	const [yearlyPaymentDocument, setYearlyPaymentDocument] = useState<File>();

	const handlePaymentMethodModalOpen = useCallback(() => {
		setPaymentMethodModalOpen(true);
	}, []);

	const handlePaymentMethodModalClose = useCallback(() => {
		setPaymentMethodModalOpen(false);
	}, []);

	//TODO: Adjust this when file handling is defined
	const handleAddNewPaymentMethod = useCallback(() => {
		const newPaymentMethod: Models.PaymentMethod = {
			year: Number(paymentMethodYear),
			method: paymentMethod as Models.PaymentMethodOption,
			yearly_payment_url: yearlyPaymentDocument?.name ?? "",
		};

		const updatedStudent = {
			...student,
			administrative_info: { ...student.administrative_info, payment_methods: [newPaymentMethod, ...student.administrative_info.payment_methods] },
		};
		onChange(updatedStudent);
	}, []);

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
									<div className="payment-method-modal-container">
										<TextField
											label="Año"
											variant="standard"
											sx={{ width: 100 }}
											value={paymentMethodYear}
											onChange={(event) => {
												setPaymentMethodYear(event.target.value);
											}}
										/>

										<FormControl variant="standard" sx={{ width: 150 }}>
											<InputLabel id="payment-method-label">Forma</InputLabel>

											<Select
												labelId="payment-method"
												id="payment-method"
												label="Forma"
												value={paymentMethod}
												onChange={(event) => setPaymentMethod(event.target.value)}>
												<MenuItem value={"contado"}>Contado</MenuItem>
												<MenuItem value={"financiacion"}>Financiación</MenuItem>
												<MenuItem value={"licitacion"}>Licitación</MenuItem>
											</Select>
										</FormControl>
									</div>

									{paymentMethod === Models.PaymentMethodOption.Cash && (
										<FileUploader label={"Pago anualidad firmado"} width={200} uploadedFile={(file) => setYearlyPaymentDocument(file)} />
									)}
								</div>
							}
							onClose={handlePaymentMethodModalClose}
							onAccept={handleAddNewPaymentMethod}
						/>
					</div>
				</div>

				<Divider />

				<PaymentMethodHistory rows={student!.administrative_info.payment_methods} />
			</CardContent>
		</Card>
	);
}
