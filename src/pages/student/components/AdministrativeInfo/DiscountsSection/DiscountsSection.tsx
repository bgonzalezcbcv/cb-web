import React, { useCallback, useState } from "react";

import * as Models from "../../../../../core/Models";
import { VisualComponent } from "../../../../../core/interfaces";
import Modal from "../../../../../components/modal/Modal";
import DiscountHistory from ".././historyTables/DiscountHistory";
import { Card, CardContent, Divider, IconButton, Box, Typography, Alert, Container } from "@mui/material";
import { JsonForms } from "@jsonforms/react";
import { JsonSchema7, Translator } from "@jsonforms/core";
import { materialCells, materialRenderers } from "@jsonforms/material-renderers";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import schema from "./schema.json";
import ui from "./ui.json";

import "./DiscountsSection.scss";

export type AdministrativeInfoProps = {
	editable: boolean;
	student: Models.Student;
	onChange: (data: Models.Student) => void;
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

export default function DiscountsSection(props: VisualComponent & AdministrativeInfoProps): React.ReactElement {
	const { editable, student, onChange } = props;

	const [discountModalOpen, setDiscountModalOpen] = useState(false);

	const [discountData, setDiscountData] = useState<DiscountData>({} as DiscountData);
	const [hasFormErrors, setHasFormErrors] = useState<boolean>(false);
	const [hasDateErrors, setHasDateErrors] = useState<boolean>(false);

	const handleDiscountModalOpen = useCallback(() => {
		setDiscountModalOpen(true);
	}, []);

	const handleDiscountModalClose = useCallback(() => {
		setDiscountModalOpen(false);
		setDiscountData({} as DiscountData);
	}, []);

	const translator = (id: string, defaultMessage: string | undefined): string => {
		if (id.includes("percentage") && id.includes("error") && discountData.percentage) {
			return "El valor debe estar entre 0 y 100";
		}
		if (id.includes("error")) return "Este campo es requerido";
		return defaultMessage ?? "";
	};

	//TODO: Adjust this when file handling is defined
	const handleAddNewDiscount = useCallback((discountData: DiscountData) => {
		const newDiscount: Models.Discount = {
			percentage: discountData.percentage,
			starting_date: new Date(discountData.starting_date),
			ending_date: new Date(discountData.ending_date),
			type: discountData.type as Models.DiscountType,
			resolution_url: discountData.resolution_url,
			explanation: discountData.explanation as Models.DiscountExplanation,
			report_url: discountData.report_url,
			description: discountData.description,
		};

		const updatedStudent = {
			...student,
			administrative_info: { ...student.administrative_info, discounts: [newDiscount, ...student.administrative_info.discounts] },
		};
		onChange(updatedStudent);
		handleDiscountModalClose();
	}, []);

	return (
		<Card color={"primary"} className="discount-wrapper">
			<CardContent className="payment-content">
				<Box className="payment-header">
					<Typography variant={"subtitle1"}>Descuentos</Typography>

					<Box>
						{editable && (
							<IconButton color="secondary" onClick={handleDiscountModalOpen}>
								<AddCircleOutlineIcon />
							</IconButton>
						)}

						<Modal
							show={discountModalOpen}
							title={"Agregar un nuevo descuento"}
							onClose={handleDiscountModalClose}
							onAccept={(): void => {
								handleAddNewDiscount(discountData);
							}}
							acceptEnabled={!hasFormErrors && !hasDateErrors}>
							<Container>
								<JsonForms
									i18n={{ translate: translator as Translator }}
									schema={schema as JsonSchema7}
									uischema={ui}
									data={discountData}
									renderers={materialRenderers}
									cells={materialCells}
									onChange={({ data, errors }): void => {
										setDiscountData(data);
										const startDate = new Date(data.starting_date);
										const endDate = new Date(data.ending_date);
										setHasDateErrors(data.starting_date && data.ending_date && startDate > endDate);
										setHasFormErrors(errors?.length != 0);
									}}
								/>
								{hasDateErrors ? <Alert severity="error">La fecha de fin debe ser posterior a la fecha de inicio</Alert> : null}
							</Container>
						</Modal>
					</Box>
				</Box>

				<Divider />

				<DiscountHistory rows={student?.administrative_info.discounts} />
			</CardContent>
		</Card>
	);
}
