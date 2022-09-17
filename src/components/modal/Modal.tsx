import React, { useCallback, useEffect, useState } from "react";

import { Box, Button, IconButton, Modal as MUIModal, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import "./Modal.scss";

export type ModalProps = {
	show: boolean;
	title: string;
	body: React.ReactElement;
	cancelText?: string;
	acceptText?: string;
	onClose: () => void;
	onAccept: () => void;
};

export default function Modal(props: ModalProps): React.ReactElement {
	const { acceptText, body, cancelText, show, title, onClose, onAccept } = props;

	const [isOpen, setIsOpen] = useState<boolean>(false);

	useEffect(() => {
		setIsOpen(show);
	}, [show]);

	const handleModalClose = useCallback(() => {
		setIsOpen(false);
		onClose();
	}, [onClose]);

	const handleModalAccept = useCallback(() => {
		setIsOpen(false);
		onAccept();
	}, [onAccept]);

	return (
		<MUIModal open={isOpen} onClose={handleModalClose}>
			<Box className="modal">
				<IconButton>
					<CloseIcon onClick={handleModalClose} />
				</IconButton>

				<div className="wrapper">
					<Typography variant={"h6"}>{title}</Typography>
					{body}
				</div>

				<div className="button-container">
					<Button variant="outlined" color={"secondary"} sx={{ marginRight: 2 }} onClick={handleModalClose}>
						{cancelText ?? "Cancelar"}
					</Button>
					<Button variant="contained" color={"secondary"} onClick={handleModalAccept}>
						{acceptText ?? "Aceptar"}
					</Button>
				</div>
			</Box>
		</MUIModal>
	);
}
