import React, { useEffect, useState } from "react";
import { ErrorObject } from "ajv";

import { Alert, Box, Dialog, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { JsonFormsCore, Translator } from "@jsonforms/core";
import { JsonForms } from "@jsonforms/react";
import { materialCells, materialRenderers } from "@jsonforms/material-renderers";

import { ajv as userAjv } from "../../../../core/AJVHelper";
import * as API from "../../../../core/ApiStore";
import { requiredFieldsTranslator } from "../../../../core/CoreHelper";
import { ComplementaryInfoWithFile } from "../../../../core/Models";
import FileUploader from "../../../../components/fileUploader/FileUploader";
import { FetchStatus } from "../../../../hooks/useFetchFromAPI";

import schema from "../../../../core/schemas/user_info.json";
import addItemUi from "./complementary-info-add-item-ui.json";

interface AddComplementaryInformationProps {
	userId: number;
	isOpen: boolean;
	onClose: (added?: boolean) => void;
}

function AddComplementaryInformation(props: AddComplementaryInformationProps): JSX.Element {
	const { userId, isOpen, onClose } = props;

	const [newCompInfo, setNewCompInfo] = useState<ComplementaryInfoWithFile>({} as ComplementaryInfoWithFile);
	const [creationState, setCreationState] = useState<FetchStatus>(FetchStatus.Initial);
	const [errors, setErrors] = useState<ErrorObject[]>([]);
	const [errorID, setErrorID] = useState<null | number>(null);

	function dismissTimeout(): void {
		if (errorID) window.clearTimeout(errorID);
	}

	useEffect(() => {
		if (creationState === FetchStatus.Error) {
			dismissTimeout();

			setErrorID(window.setTimeout(() => setCreationState(FetchStatus.Initial), 5000));
		}
	}, [creationState]);

	function handleDismiss(added = false): void {
		if (creationState === FetchStatus.Fetching) return;

		onClose(added);
	}

	async function handleAdd(): Promise<void> {
		setCreationState(FetchStatus.Fetching);
		dismissTimeout();

		const { success } = await API.createComplementaryInformation(userId, newCompInfo);

		setCreationState(FetchStatus.Initial);

		if (success) handleDismiss(true);
		else setCreationState(FetchStatus.Error);
	}

	function handleChange(state: Pick<JsonFormsCore, "errors" | "data">): void {
		const { data, errors } = state;

		setNewCompInfo(data);
		setErrors(errors ?? []);
	}

	return (
		<Dialog open={isOpen} onClose={(): void => handleDismiss()}>
			<Box display="flex" flexDirection="column" width="400px" padding="12px" gap="6px">
				<Typography variant="h5">Agregar título</Typography>

				<JsonForms
					i18n={{ translate: requiredFieldsTranslator as Translator }}
					ajv={userAjv}
					schema={schema.properties.complementary_info.properties.academic_training.items}
					uischema={addItemUi}
					renderers={materialRenderers}
					cells={materialCells}
					data={newCompInfo}
					onChange={handleChange}
				/>

				<FileUploader label="Adjunto" width="100%" uploadedFile={(file): void => setNewCompInfo({ ...newCompInfo, attachment: file })} />

				{creationState === FetchStatus.Error ? (
					<Alert variant="outlined" severity="error">
						No se pudo crear esta información académica. Vuelva a intentar.
					</Alert>
				) : null}

				<Box display="flex" width="100%" justifyContent="flex-end">
					<LoadingButton
						variant="outlined"
						disabled={errors.length > 0 && !newCompInfo.attachment}
						onClick={handleAdd}
						loading={creationState === FetchStatus.Fetching}>
						Guardar
					</LoadingButton>
				</Box>
			</Box>
		</Dialog>
	);
}

export default AddComplementaryInformation;
