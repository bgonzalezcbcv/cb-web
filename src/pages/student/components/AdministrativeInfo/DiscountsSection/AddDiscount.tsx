import React, { useEffect, useState } from "react";

import { JsonSchema7 } from "@jsonforms/core";
import { JsonForms } from "@jsonforms/react";
import { Alert, Box, CircularProgress, Container, Typography } from "@mui/material";
import { materialCells, materialRenderers } from "@jsonforms/material-renderers";

import * as Models from "../../../../../core/Models";
import { Discount, DiscountExplanation, DiscountWithFiles } from "../../../../../core/Models";
import * as API from "../../../../../core/ApiStore";
import { FetchState } from "../../../../../core/interfaces";
import Modal from "../../../../../components/modal/Modal";
import FileUploader from "../../../../../components/fileUploader/FileUploader";
import DatePickerToString from "../../../../../components/datePicker/DatePicker";
import NumericInputControl, { NumericInputControlTester } from "../../../../../components/NumericInput/NumericInputControl";

import schema from "../../../schema.json";
import ui from "./ui.json";
import uiResolution from "./ui-resolution.json";
import uiReport from "./ui-report.json";
import { ErrorObject } from "ajv";
import { dateBeforeOrEqualThan } from "../../../../../core/CoreHelper";

const discountSchema = schema.properties.administrative_info.properties.discounts.items;

const renderers = [...materialRenderers, { tester: NumericInputControlTester, renderer: NumericInputControl }];

interface AddDiscountProps {
	studentId: number;
	isOpen: boolean;
	onClose: (creation?: boolean) => void;
}

function AddDiscount(props: AddDiscountProps): React.ReactElement {
	const { studentId, isOpen, onClose } = props;

	const [newDiscount, setNewDiscount] = useState<DiscountWithFiles>({} as DiscountWithFiles);
	const [creationState, setCreationState] = useState<FetchState>(FetchState.initial);
	const [errors, setErrors] = useState<unknown[]>([]);
	const [errorMessage, setErrorMessage] = useState("");

	useEffect(() => {
		if (isOpen) return;

		setNewDiscount({} as DiscountWithFiles);
		setCreationState(FetchState.initial);
		setErrors([]);
		setErrorMessage("");
	}, [isOpen]);

	useEffect(() => {
		const { start_date, end_date } = newDiscount;

		if (!(start_date && end_date)) return;

		if (!dateBeforeOrEqualThan(newDiscount.start_date, newDiscount.end_date)) setErrorMessage("La fecha de inicio no puede ser mayor a la fecha final");
		else setErrorMessage("");
	}, [newDiscount.end_date, newDiscount.start_date]);

	function canAccept(): boolean {
		if (newDiscount.explanation === DiscountExplanation.Resolution && !(newDiscount.start_date && newDiscount.end_date)) return false;

		return errors.length === 0 && errorMessage === "";
	}

	async function handleDiscountCreation(): Promise<void> {
		setCreationState(FetchState.loading);
		const { success } = await API.createDiscount(studentId, newDiscount);

		if (success) onClose(true);
		else {
			setCreationState(FetchState.initial);
			setErrorMessage("No se pudo crear el descuento. Intente de nuevo.");
			setTimeout(() => setErrorMessage(""), 2000);
		}
	}

	function handleSubmit(): void {
		handleDiscountCreation();
	}

	function handleDiscountChange(param: { data: unknown; errors: ErrorObject<string, Record<string, unknown>, unknown>[] | undefined }): void {
		setNewDiscount(param.data as Discount);
		setErrors(param.errors ?? []);
	}

	function handleDismiss(): void {
		if (creationState !== FetchState.loading) onClose();
	}

	const handleAddingDiscountAttribute =
		(key: string) =>
		(value: unknown): void =>
			setNewDiscount({ ...newDiscount, [key]: value });

	const translator = (id: string, defaultMessage: string | undefined): string => {
		if (id.includes("percentage") && id.includes("error") && newDiscount.percentage) {
			return "El valor debe estar entre 0 y 100";
		}
		if (id.includes("error")) return "Este campo es requerido";
		return defaultMessage ?? "";
	};

	return (
		<Modal show={isOpen} title={"Agregar un nuevo descuento"} onClose={handleDismiss} onAccept={handleSubmit} acceptEnabled={canAccept()}>
			<Container>
				<JsonForms
					i18n={{ translate: translator }}
					schema={schema.properties.administrative_info.properties.discounts.items as JsonSchema7}
					uischema={ui}
					data={newDiscount}
					renderers={renderers}
					cells={materialCells}
					onChange={handleDiscountChange}
				/>

				{newDiscount?.explanation == Models.DiscountExplanation.Resolution.valueOf() ? (
					<Container style={{ paddingRight: "0px", paddingLeft: "0px", paddingTop: "15px" }}>
						<Typography>{"Resolución"}</Typography>

						<Box className="dates-container">
							<DatePickerToString
								width={"48%"}
								editable={true}
								date={newDiscount.start_date}
								onChange={handleAddingDiscountAttribute("start_date")}
								label="Comienzo"
								required={true}
							/>

							<DatePickerToString
								width={"48%"}
								editable={true}
								date={newDiscount.end_date}
								onChange={handleAddingDiscountAttribute("end_date")}
								label="Fin"
								required={true}
							/>
						</Box>

						<JsonForms
							i18n={{ translate: translator }}
							schema={discountSchema as JsonSchema7}
							uischema={uiResolution}
							data={newDiscount}
							renderers={renderers}
							cells={materialCells}
							onChange={handleDiscountChange}
						/>
						<FileUploader label={"Resolución"} width={"100%"} uploadedFile={handleAddingDiscountAttribute("resolution")} />
					</Container>
				) : null}

				{newDiscount.explanation == Models.DiscountExplanation.Resolution.valueOf() ? (
					<Container style={{ paddingRight: "0px", paddingLeft: "0px", paddingTop: "15px" }}>
						<Typography>{"Informe Administrativo"}</Typography>

						<JsonForms
							i18n={{ translate: translator }}
							schema={discountSchema as JsonSchema7}
							uischema={uiReport}
							data={newDiscount}
							renderers={renderers}
							cells={materialCells}
							onChange={handleDiscountChange}
						/>
						<FileUploader label={"Informe"} width={"100%"} uploadedFile={handleAddingDiscountAttribute("administrative_info")} />
					</Container>
				) : null}

				{errorMessage !== "" ? (
					<Alert severity="error" className="alert">
						{errorMessage}
					</Alert>
				) : null}

				{creationState === FetchState.loading ? <CircularProgress /> : null}
			</Container>
		</Modal>
	);
}

export default AddDiscount;
