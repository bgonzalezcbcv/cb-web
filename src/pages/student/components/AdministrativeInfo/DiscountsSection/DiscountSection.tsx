/* eslint-disable */
import React, { useCallback, useState } from "react";

import * as Models from "../../../../../core/Models";
import { VisualComponent } from "../../../../../core/interfaces";
import Modal from "../../../../../components/modal/Modal";
import DiscountHistory from ".././historyTables/DiscountHistory";
import { Card, CardContent, Divider } from "@mui/material";
import { JsonForms } from "@jsonforms/react";
import { JsonSchema7, Translator, createAjv } from "@jsonforms/core";
import { materialCells, materialRenderers } from "@jsonforms/material-renderers";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import schema from "../../../schema.json";
import ui from "./ui.json";

import "./DiscountSection.scss";

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

export default function DiscountSection(props: VisualComponent & AdministrativeInfoProps): React.ReactElement {
	const { editable, student, onChange } = props;

	const [discountModalOpen, setDiscountModalOpen] = useState(false);

	const [discountData, setDiscountData] = useState<DiscountData>({} as DiscountData);

	const handleDiscountModalOpen = useCallback(() => {
		setDiscountModalOpen(true);
	}, []);

	const handleDiscountModalClose = useCallback(() => {
		setDiscountModalOpen(false);
	}, []);

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
								<JsonForms
									schema={schema as JsonSchema7}
									uischema={ui}
									data={{ administrative_info: { discounts: [discountData] } }}
									renderers={materialRenderers}
									cells={materialCells}
									onChange={({ data, errors }): void => {
										if (
											data &&
											data.administrative_info &&
											data.administrative_info.discounts &&
											data.administrative_info.discounts.length > 0
										) {
											const info = data.administrative_info.discounts[0];
											setDiscountData(info);
										}
									}}
								/>
							}
							onClose={handleDiscountModalClose}
							onAccept={() => {
								handleAddNewDiscount(discountData);
							}}
						/>
					</div>
				</div>

				<Divider />

				<DiscountHistory rows={student?.administrative_info.discounts} />
			</CardContent>
		</Card>
	);
}
