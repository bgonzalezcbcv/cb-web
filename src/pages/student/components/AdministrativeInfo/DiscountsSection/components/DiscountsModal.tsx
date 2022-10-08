/* eslint-disable */
import React, { useCallback, useMemo, useState } from "react";

import * as Models from "../../../../../../core/Models";
import Modal from "../../../../../../components/modal/Modal";
import FileUploader from "../../../../../../components/fileUploader/FileUploader";
import { Container, Typography, Alert } from "@mui/material";
import { JsonForms } from "@jsonforms/react";
import { materialCells, materialRenderers } from "@jsonforms/material-renderers";
import { JsonSchema7, Translator } from "@jsonforms/core";

import schema from "../../../../schema.json";
import ui from "../ui.json";
import uiResolution from "../ui-resolution.json";
import uiReport from "../ui-report.json";

import "../DiscountsSection.scss";
import _ from "lodash";

export type DiscountsModalProps = {
	student: Models.Student;
	discountModalOpen: boolean;
	handleDiscountModalClose: () => void;
	handleAddNewDiscount: (discountData: DiscountData, student: Models.Student) => void;
};

type DiscountData = {
	percentage: number;
	starting_date: string;
	ending_date: string;
	type: string;
	resolution_url: string;
	explanation: string;
	report_url: string;
	description: string;
};

const initialState: DiscountData = {
	percentage: 0,
	starting_date: "",
	ending_date: "",
	type: "",
	resolution_url: "",
	explanation: "",
	report_url: "",
	description: "",
};

export default function DiscountsModal(props: DiscountsModalProps): React.ReactElement {
	const { handleAddNewDiscount, handleDiscountModalClose, discountModalOpen, student } = props;

	const [discountData, setDiscountData] = useState<DiscountData>(initialState);
	const [hasFormErrors, setHasFormErrors] = useState<boolean>(false);
	const [hasDateErrors, setHasDateErrors] = useState<boolean>(false);

	const translator = (id: string, defaultMessage: string | undefined): string => {
		if (id.includes("percentage") && id.includes("error") && discountData.percentage) {
			return "El valor debe estar entre 0 y 100";
		}
		if (id.includes("error")) return "Este campo es requerido";
		return defaultMessage ?? "";
	};

	function setResolutionFile(file: File | undefined): void {
		//TODO
	}

	function setReportFile(file: File | undefined): void {
		//TODO
	}

	const setData = useCallback(
		(data: any, hasErrors: boolean) => {
			console.log("Discoun", discountData, "data", data);
			data !== discountData && setDiscountData({ ..._.assign(discountData, data) });

			const startDate = new Date(data.starting_date);
			const endDate = new Date(data.ending_date);

			setHasDateErrors(data.starting_date && data.ending_date && startDate > endDate);
			setHasFormErrors(hasErrors);
		},
		[discountData, hasFormErrors]
	);

	const subForms = [
		{ label: "Resolución", ui: uiResolution, setter: setResolutionFile },
		{ label: "Informe Administrativo", ui: uiReport, setter: setReportFile },
	];

	return (
		<Modal
			show={discountModalOpen}
			title={"Agregar un nuevo descuento"}
			onClose={() => {
				handleDiscountModalClose();
				setDiscountData({} as DiscountData);
			}}
			onAccept={(): void => {
				handleAddNewDiscount(discountData, student);
			}}
			acceptEnabled={!hasFormErrors && !hasDateErrors}>
			<Container>
				<JsonForms
					i18n={{ translate: translator as Translator }}
					schema={schema.properties.administrative_info.properties.discounts.items as JsonSchema7}
					uischema={ui}
					data={discountData}
					renderers={materialRenderers}
					cells={materialCells}
					onChange={({ data, errors }): void => {
						setData(data, errors?.length != 0);
					}}
				/>
				{discountData.explanation == Models.DiscountExplanation.Resolution.valueOf() ? (
					<>
						{subForms.map((subForm) => (
							<Container style={{ padding: "15px 0 0 0" }}>
								<Typography>{subForm.label}</Typography>
								<JsonForms
									i18n={{ translate: translator as Translator }}
									schema={schema.properties.administrative_info.properties.discounts.items as JsonSchema7}
									uischema={subForm.ui}
									data={discountData}
									renderers={materialRenderers}
									cells={materialCells}
									onChange={({ data, errors }): void => {
										setData(data, errors?.length != 0);
									}}
								/>
								<FileUploader label={subForm.label} width={"100%"} uploadedFile={(file): void => subForm.setter(file)} />
							</Container>
						))}
					</>
				) : null}
				{hasDateErrors ? <Alert severity="error">La fecha de fin debe ser posterior a la fecha de inicio</Alert> : null}
			</Container>
		</Modal>
	);
}
