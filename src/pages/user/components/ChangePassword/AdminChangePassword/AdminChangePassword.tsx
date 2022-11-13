import React, { useState } from "react";

import { JsonForms } from "@jsonforms/react";
import { JsonSchema7, Translator } from "@jsonforms/core";
import { materialCells, materialRenderers } from "@jsonforms/material-renderers";
import Modal from "../../../../../components/modal/Modal";

import * as API from "../../../../../core/ApiStore";
import schema from "./change-password-schema.json";
import uiSchema from "./change-password-ui.json";
import { Container } from "@mui/material";
import { UserInfo } from "../../../../../core/Models";
import { ChangePasswordDialog } from "../ChangePasswordDialog";

interface ChangePasswordProps {
	user: UserInfo;
	isOpen: boolean;
	setOpen: (isOpen: boolean, isChanged: boolean) => void;
}

export function AdminChangePassword(props: ChangePasswordProps): React.ReactElement {
	const { user, isOpen, setOpen } = props;

	const [hasErrors, setHasErrors] = useState<boolean>(false);
	const [newPassword, setNewPassword] = useState<string>("");
	const [success, setSuccess] = useState(false);
	const [openDialog, setOpenDialog] = useState(false);

	const handleOnAccept = async (): Promise<void> => {
		const response = await API.adminChangePassword(user.id, newPassword);

		if (response.success) {
			setSuccess(true);
		} else {
			setSuccess(false);
		}
		setOpenDialog(true);
	};

	const handleOnDialogClosed = (): void => {
		setNewPassword("");
		setOpenDialog(false);
		setSuccess(false);
	};

	const handleOnClose = (): void => {
		setHasErrors(false);
		setNewPassword("");
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
						new_password: newPassword,
					}}
					renderers={materialRenderers}
					cells={materialCells}
					onChange={({ data, errors }): void => {
						setNewPassword(data.new_password);
						setHasErrors(errors?.length != 0);
					}}
				/>
				<ChangePasswordDialog success={success} show={openDialog} setOpen={handleOnDialogClosed} />
			</Container>
		</Modal>
	);
}
