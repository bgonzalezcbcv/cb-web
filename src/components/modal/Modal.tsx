import React, { useCallback, useEffect, useState } from "react";

import { Box, Button, IconButton, Typography, Dialog, Container } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import "./Modal.scss";

export type ModalProps = {
	show: boolean;
	title: string;
	children: React.ReactElement;
	cancelText?: string;
	acceptText?: string;
	onClose: () => void;
	onAccept: () => void;
	acceptEnabled?: boolean;
};

export default function Modal(props: ModalProps): React.ReactElement {
	const { acceptText, children, cancelText, show, title, onClose, onAccept, acceptEnabled } = props;

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

	if (!isOpen) return <></>;
	return (
		<Dialog open={isOpen} onClose={handleModalClose} id="MUIModal">
			<Box className="modal">
				<IconButton>
					<CloseIcon onClick={handleModalClose} />
				</IconButton>
				<Container className="wrapper">
					<Typography variant={"h6"}>{title}</Typography>
					{children}
				</Container>

				<Container className="button-container">
					<Button variant="outlined" sx={{ marginRight: 2 }} onClick={handleModalClose} id="modalCancel">
						{cancelText ?? "Cancelar"}
					</Button>

					<Button variant="contained" onClick={handleModalAccept} disabled={!acceptEnabled} id="modalAccept">
						{acceptText ?? "Aceptar"}
					</Button>
				</Container>
			</Box>
		</Dialog>
	);
}
