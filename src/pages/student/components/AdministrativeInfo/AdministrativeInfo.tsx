/* eslint-disable */
import React, { useCallback, useState, useEffect } from "react";
import _ from "lodash";
import { JsonForms } from "@jsonforms/react";
import { JsonSchema7 } from "@jsonforms/core";
import { materialCells, materialRenderers } from "@jsonforms/material-renderers";
import { createAjv } from "@jsonforms/core";
import schema from "./schema.json";
import uiSchema from "./ui.json";
import { DataStore } from "../../../../core/DataStore";
import * as Models from "../../../../core/Models";
import { VisualComponent } from "../../../../core/interfaces";
import FileUploader from "../../../../components/fileUploader/FileUploader";
import Modal from "../../../../components/modal/Modal";
import PaymentMethodHistory from "./historyTables/PaymentMethodHistory";
import DiscountHistory from "./historyTables/DiscountHistory";
import { Card, CardContent, Divider, FormControl, InputAdornment, InputLabel, MenuItem, Select, TextField, TextFieldProps } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DownloadIcon from "@mui/icons-material/Download";

import "./AdministrativeInfo.scss";

export type AdministrativeInfoProps = {
	editable: boolean;
	student: Models.Student;
	onChange: (data: Models.Student) => void;
};

export default function AdministrativeInfo(props: VisualComponent & AdministrativeInfoProps): React.ReactElement {
	const dataStore = DataStore.getInstance();

	const { editable, student, height, width, onChange } = props;

	const info = student?.administrative_info;

	// const [data, setData] = useState(student);

	const [enrollmentCommitment, setEnrollmentCommitment] = useState<File | undefined>();
	const [agreementType, setAgreementType] = useState<string | undefined>(undefined);

	const [discountModalOpen, setDiscountModalOpen] = useState(false);
	const [discountPercentage, setDiscountPercentage] = useState("");
	const [discountReason, setDiscountReason] = useState("");
	const [discountType, setDiscountType] = useState("");
	const [discountIniDate, setDiscountIniDate] = useState<Date>(new Date());
	const [discountFinDate, setDiscountFinDate] = useState<Date>(new Date());
	const [resolutionDocument, setResolutionDocument] = useState<File>();
	const [reportDocument, setReportDocument] = useState<File>();

	const [paymentMethodModalOpen, setPaymentMethodModalOpen] = React.useState(false);
	const [paymentMethod, setPaymentMethod] = useState("");
	const [paymentMethodYear, setPaymentMethodYear] = useState("");
	const [yearlyPaymentDocument, setYearlyPaymentDocument] = useState<File>();
	const [discountDescription, setDiscountDescription] = useState("");

	const [currentPaymentMethods, setCurrentPaymentMethods] = useState<Models.PaymentMethod[]>(student?.administrative_info.payment_methods ?? []);
	const [currentDiscounts, setCurrentDiscounts] = useState<Models.Discount[]>(student?.administrative_info.discounts ?? []);

	const handleDefaultsAjv = createAjv({ useDefaults: true });

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

		if (student && student?.administrative_info.payment_methods.length > 0)
			setCurrentPaymentMethods([newPaymentMethod, ...student.administrative_info.payment_methods]);
		else setCurrentPaymentMethods([newPaymentMethod]);
	}, []);

	const handleDiscountModalOpen = useCallback(() => {
		setDiscountModalOpen(true);
	}, []);

	const handleDiscountModalClose = useCallback(() => {
		setDiscountModalOpen(false);
	}, []);

	//TODO: Adjust this when file handling is defined
	const handleAddNewDiscount = useCallback(() => {
		const newDiscount: Models.Discount = {
			percentage: Number(discountPercentage),
			starting_date: discountIniDate,
			ending_date: discountFinDate,
			type: discountType as Models.DiscountType,
			resolution_url: resolutionDocument?.name ?? "",
			explanation: discountReason as Models.DiscountExplanation,
			report_url: reportDocument?.name ?? "",
			description: discountDescription,
		};

		if (student && student?.administrative_info.discounts.length > 0) {
			const updatedStudent = {
				...student,
				administrative_info: { ...student.administrative_info, discount: [newDiscount, ...student.administrative_info.discounts] },
			};
			// setCurrentDiscounts([newDiscount, ...student.administrative_info.discounts]);
			onChange(updatedStudent);
		} else setCurrentDiscounts([newDiscount]);
	}, []);

	// @ts-ignore
	return (
		<div>
			<Card
				className="administrative-info"
				sx={{
					width: width ?? "100%",
					height: height ?? "100%",
				}}>
				<CardContent className="form-container">
					<JsonForms
						schema={schema as JsonSchema7}
						uischema={uiSchema}
						data={student}
						renderers={materialRenderers}
						cells={materialCells}
						onChange={({ data }): void => {
							onChange(data);
						}}
						readonly={!editable}
						ajv={handleDefaultsAjv}
					/>

					<FormControl variant="standard" sx={{ width: "100%" }}>
						<InputLabel id="agreement-type-label">Convenio</InputLabel>

						<Select
							labelId="agreement-type"
							id="agreement-type"
							label="Convenio"
							value={agreementType}
							onChange={(event) => setAgreementType(event.target.value)}>
							{dataStore.agreementTypes &&
								dataStore.agreementTypes?.map((value, index) => {
									return (
										<MenuItem key={index} value={value}>
											{value}
										</MenuItem>
									);
								})}
						</Select>
					</FormControl>

					{editable ? (
						<FileUploader label={"Compromiso de inscripción"} width={"100%"} uploadedFile={(file) => setEnrollmentCommitment(file)} />
					) : (
						<div className="document-download-container">
							<div className="document-download">Compromiso de inscripción</div>
							{/*TODO: Add handle to download file*/}
							<DownloadIcon />
						</div>
					)}

					<TextField
						sx={{ width: "100%", marginTop: 1 }}
						label={"Comentarios"}
						value={student.administrative_info.comments}
						multiline
						rows={4}
						variant="standard"
						disabled={!editable}
						onChange={(event) => {
							const newStudent = { ...student, administrative_info: { ...student.administrative_info, comments: event.target.value } };
							onChange(newStudent);
						}}
					/>
				</CardContent>

				<div className="payment-details-wrapper">
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
													<FileUploader
														label={"Pago anualidad firmado"}
														width={200}
														uploadedFile={(file) => setYearlyPaymentDocument(file)}
													/>
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

					<Card className="discount-wrapper">
						<CardContent className="payment-content">
							<div className="payment-header">
								<h4>Descuentos</h4>

								<div>
									{editable && <AddCircleOutlineIcon onClick={handleDiscountModalOpen} />}

									<Modal
										show={discountModalOpen}
										title={"Agregar un nuevo descuento"}
										body={
											<div className="discount-container-wrapper">
												<div className="validity-dates-container">
													<LocalizationProvider dateAdapter={AdapterDayjs}>
														<DatePicker
															label="Inicio"
															value={discountIniDate}
															inputFormat={"D/MM/YYYY"}
															onChange={(newValue) => {
																return setDiscountIniDate(newValue ?? new Date());
															}}
															renderInput={(params: JSX.IntrinsicAttributes & TextFieldProps) => (
																<TextField {...params} variant={"standard"} />
															)}
														/>
													</LocalizationProvider>

													<LocalizationProvider dateAdapter={AdapterDayjs}>
														<DatePicker
															label="Fin"
															value={discountFinDate}
															inputFormat={"D/MM/YYYY"}
															onChange={(newValue) => {
																return setDiscountFinDate(newValue ?? new Date());
															}}
															renderInput={(params: JSX.IntrinsicAttributes & TextFieldProps) => (
																<TextField {...params} variant={"standard"} />
															)}
														/>
													</LocalizationProvider>
												</div>

												<div className="discount-container">
													<TextField
														label={"Porcentaje"}
														value={discountPercentage}
														variant="standard"
														sx={{ width: 100 }}
														InputProps={{ endAdornment: <InputAdornment position={"end"}>%</InputAdornment> }}
														onChange={(event) => setDiscountPercentage(event.target.value)}
													/>

													<FormControl variant="standard" sx={{ width: 150 }}>
														<InputLabel id="discount-reason-label">Explicación</InputLabel>

														<Select
															labelId="discount-reason"
															id="discount-reason"
															label="Explicación del descuento"
															value={discountReason}
															onChange={(event) => {
																const newStudent = {
																	...student,
																	administrative_info: { ...student.administrative_info },
																};
																onChange(newStudent);

																setDiscountReason(event.target.value);
															}}>
															<MenuItem value={"hermano"}>Hermano</MenuItem>
															<MenuItem value={"resolucion"}>Resolución</MenuItem>
														</Select>
													</FormControl>

													<TextField
														label={"Descripción"}
														value={discountDescription}
														variant="standard"
														onChange={(event) => {
															setDiscountDescription(event.target.value);
														}}
													/>
												</div>

												<div className="resolution-document">
													<FileUploader
														label={"Adjunto resolución"}
														width={200}
														uploadedFile={(file) => setResolutionDocument(file)}
													/>
												</div>

												<div className="discount-type-container">
													<FormControl variant="standard" sx={{ width: 150 }}>
														<InputLabel id="discount-type-label">Tipo</InputLabel>

														<Select
															labelId="discount-type"
															id="discount-type"
															label="Tipo"
															value={discountType}
															onChange={(event) => setDiscountType(event.target.value)}>
															<MenuItem value={"direccion"}>Dirección</MenuItem>
															<MenuItem value={"asistente_social"}>Asistente social</MenuItem>
														</Select>
													</FormControl>

													<FileUploader label={"Adjunto informe"} width={200} uploadedFile={(file) => setReportDocument(file)} />
												</div>
											</div>
										}
										onClose={handleDiscountModalClose}
										onAccept={handleAddNewDiscount}
									/>
								</div>
							</div>

							<Divider />

							<DiscountHistory rows={student?.administrative_info.discounts} />
						</CardContent>
					</Card>
				</div>
			</Card>
		</div>
	);
}
