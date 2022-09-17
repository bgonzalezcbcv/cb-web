/* eslint-disable */
import React, { useCallback, useState } from "react";

import { createAjv } from "@jsonforms/core";
import * as Models from "../../../../../core/Models";
import { VisualComponent } from "../../../../../core/interfaces";
import FileUploader from "../../../../../components/fileUploader/FileUploader";
import Modal from "../../../../../components/modal/Modal";
import DiscountHistory from ".././historyTables/DiscountHistory";
import { Card, CardContent, Divider, FormControl, InputAdornment, InputLabel, MenuItem, Select, TextField, TextFieldProps } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DownloadIcon from "@mui/icons-material/Download";

import "./DiscountSection.scss";

export type AdministrativeInfoProps = {
	editable: boolean;
	student: Models.Student;
	onChange: (data: Models.Student) => void;
};

export default function DiscountSection(props: VisualComponent & AdministrativeInfoProps): React.ReactElement {
	const { editable, student, onChange } = props;

	const [discountModalOpen, setDiscountModalOpen] = useState(false);
	const [discountPercentage, setDiscountPercentage] = useState("");
	const [discountReason, setDiscountReason] = useState("");
	const [discountType, setDiscountType] = useState("");
	const [discountIniDate, setDiscountIniDate] = useState<Date>(new Date());
	const [discountFinDate, setDiscountFinDate] = useState<Date>(new Date());
	const [resolutionDocument, setResolutionDocument] = useState<File>();
	const [reportDocument, setReportDocument] = useState<File>();

	const [discountDescription, setDiscountDescription] = useState("");

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

		const updatedStudent = {
			...student,
			administrative_info: { ...student.administrative_info, discount: [newDiscount, ...student.administrative_info.discounts] },
		};
		onChange(updatedStudent);
	}, []);

	// @ts-ignore
	return (
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
										<FileUploader label={"Adjunto resolución"} width={200} uploadedFile={(file) => setResolutionDocument(file)} />
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
	);
}
