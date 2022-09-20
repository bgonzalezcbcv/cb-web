import React , {useCallback, useEffect, useState} from "react";
import {Box, Button, Modal as MUIModal} from "@mui/material";
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
}

export default function Modal(props: ModalProps): React.ReactElement {
    const {acceptText, body, cancelText, show, title, onClose, onAccept} = props;

    const [isOpen, setIsOpen] = useState<boolean>(false);

    useEffect( () => {
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
                <CloseIcon onClick={handleModalClose} />

                <div className="wrapper">
                    <h3>{title}</h3>
                    {body}
                </div>

                <div className="button-container">
                    <Button variant="outlined" sx={{marginRight: 2}} onClick={handleModalClose}>{cancelText ?? "Cancelar"}</Button>
                    <Button variant="contained" onClick={handleModalAccept}>{acceptText ?? "Aceptar"}</Button>
                </div>
            </Box>
        </MUIModal>
    );
}