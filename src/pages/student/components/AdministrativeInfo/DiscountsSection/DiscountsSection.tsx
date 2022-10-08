import React, { useCallback, useState } from "react";

import { Discount, DiscountType, DiscountExplanation, Student } from "../../../../../core/Models";
import { VisualComponent } from "../../../../../core/interfaces";
import DiscountHistory from ".././historyTables/DiscountHistory";
import { Card, CardContent, Divider, IconButton, Container, Typography, Box, Alert } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import "./DiscountsSection.scss";
import DiscountsModal from "./components/DiscountsModal";

export type AdministrativeInfoProps = {
	editable: boolean;
	student: Student;
	onChange: (data: Student) => void;
};

export type DiscountData = {
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

	const handleDiscountModalOpen = useCallback(() => {
		setDiscountModalOpen(true);
	}, []);

	const handleDiscountModalClose = useCallback(() => {
		setDiscountModalOpen(false);
	}, []);

	//TODO: Adjust this when file handling is defined
	const handleAddNewDiscount = useCallback((discountData: DiscountData, student: Student) => {
		const { percentage, starting_date, ending_date, explanation, report_url, description, resolution_url, type } = discountData;

		const newDiscount: Discount = {
			percentage: percentage,
			starting_date: new Date(starting_date),
			ending_date: new Date(ending_date),
			type: type as DiscountType,
			resolution_url: resolution_url,
			explanation: explanation as DiscountExplanation,
			report_url: report_url,
			description: description,
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
						<DiscountsModal
							discountModalOpen={discountModalOpen}
							handleDiscountModalClose={handleDiscountModalClose}
							student={student}
							handleAddNewDiscount={handleAddNewDiscount}
						/>
					</Box>
				</Box>

				<Divider />

				<DiscountHistory rows={student?.administrative_info.discounts} />
			</CardContent>
		</Card>
	);
}
