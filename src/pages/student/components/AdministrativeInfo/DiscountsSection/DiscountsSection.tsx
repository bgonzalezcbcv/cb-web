import React, { useCallback, useState } from "react";

import * as Models from "../../../../../core/Models";
import { Discount } from "../../../../../core/Models";
import { VisualComponent } from "../../../../../core/interfaces";
import { fetchDiscounts, deleteDiscount } from "../../../../../core/ApiStore";
import AddDiscount from "./AddDiscount";
import DiscountHistory from "./DiscountHistory";
import useFetchFromAPI, { FetchStatus } from "../../../../../hooks/useFetchFromAPI";

import { Alert, Box, Card, CardContent, CircularProgress, Divider, IconButton, Typography } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import "./DiscountsSection.scss";

export type AdministrativeInfoProps = {
	student: Models.Student;
	editable: boolean;
};

export default function DiscountsSection(props: VisualComponent & AdministrativeInfoProps): React.ReactElement {
	const { editable, student } = props;

	const [discountModalOpen, setDiscountModalOpen] = useState(false);

	const [discounts, setDiscounts] = useState<Discount[]>([]);

	const { fetchStatus, refetch } = useFetchFromAPI(() => fetchDiscounts(Number(student.id)), setDiscounts);

	const handleDiscountModalOpen = useCallback(() => {
		setDiscountModalOpen(true);
	}, []);

	function handleDiscountAdd(creation = false): void {
		setDiscountModalOpen(false);
		if (creation) {
			refetch();
		}
	}

	async function handleDeletion(discount_id: number): Promise<void> {
		if (window.confirm("¿Desea eliminar este descuento?")) {
			const { success } = await deleteDiscount(Number(student.id), discount_id);

			if (success) refetch();
			else alert("No se pudo borrar el descuento.");
		}
	}

	if (fetchStatus === FetchStatus.Fetching) return <CircularProgress />;

	if (fetchStatus === FetchStatus.Error)
		return (
			<Alert variant="outlined" severity="error" style={{ cursor: "pointer" }} onClick={refetch}>
				<Typography>No se pudieron obtener los descuentos. Haga click aquí para reintentar.</Typography>
			</Alert>
		);

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

						<AddDiscount isOpen={discountModalOpen} studentId={Number(student.id)} onClose={handleDiscountAdd} />
					</Box>
				</Box>

				<Divider />

				<DiscountHistory rows={discounts ?? []} handleDeletion={handleDeletion} canDelete />
			</CardContent>
		</Card>
	);
}
