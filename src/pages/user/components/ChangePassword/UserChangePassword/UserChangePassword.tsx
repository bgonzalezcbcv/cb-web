import React, { useState } from "react";

import { JsonForms } from "@jsonforms/react";
import { JsonSchema7, Translator } from "@jsonforms/core";
import { materialCells, materialRenderers } from "@jsonforms/material-renderers";
import Modal from "../../../../../components/modal/Modal";

import * as API from "../../../../../core/ApiStore";
import schema from "./change-password-schema.json";
import uiSchema from "./change-password-ui.json";
import { Container } from "@mui/material";
import { ChangePasswordDialog } from "../ChangePasswordDialog";

interface ChangePasswordProps {
	isOpen: boolean;
	setOpen: (isOpen: boolean, isChanged: boolean) => void;
}

export function UserChangePassword(props: ChangePasswordProps): React.ReactElement {
	const { isOpen, setOpen } = props;

	const [hasErrors, setHasErrors] = useState<boolean>(false);
	const [oldPassword, setOldPassword] = useState<string>("");
	const [newPassword, setNewPassword] = useState<string>("");
	const [repeatNewPassword, setRepeatNewPassword] = useState<string>("");
	const [success, setSuccess] = useState(false);
	const [openDialog, setOpenDialog] = useState(false);

	const handleOnAccept = async (): Promise<void> => {
		const response = await API.userChangePassword(oldPassword, newPassword, repeatNewPassword);

		if (response.success) {
			setSuccess(true);
		} else {
			setSuccess(false);
		}
		setOpenDialog(true);
	};

	const handleOnDialogClosed = (): void => {
		setOldPassword("");
		setNewPassword("");
		setRepeatNewPassword("");
		setOpenDialog(false);
		setSuccess(false);
	};

	const handleOnClose = (): void => {
		setHasErrors(false);
		setOldPassword("");
		setNewPassword("");
		setRepeatNewPassword("");
		setOpen(false, false);
	};

	const translator = (id: string, defaultMessage: string): string => {
		if (id.includes("required")) return "Campo requerido";
		else return defaultMessage;
	};

	return (
		<Modal
			show={isOpen}
			title={"Cambiar Contraseña"}
			onClose={(): void => handleOnClose()}
			onAccept={(): Promise<void> => handleOnAccept()}
			acceptEnabled={!hasErrors}>
			<Container>
				<JsonForms
					i18n={{ translate: translator as Translator }}
					schema={schema as JsonSchema7}
					uischema={uiSchema}
					data={{
						old_password: oldPassword,
						new_password: newPassword,
						repeat_new_password: repeatNewPassword,
					}}
					renderers={materialRenderers}
					cells={materialCells}
					onChange={({ data, errors }): void => {
						setOldPassword(data.old_password);
						setNewPassword(data.new_password);
						setRepeatNewPassword(data.repeat_new_password);
						setHasErrors(errors?.length != 0);
					}}
				/>
				<ChangePasswordDialog success={success} show={openDialog} setOpen={handleOnDialogClosed} />
			</Container>
		</Modal>
	);
}
