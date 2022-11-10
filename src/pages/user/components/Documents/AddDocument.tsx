import React, { useEffect, useState } from "react";
import { ErrorObject } from "ajv";

import { Translator } from "@jsonforms/core";
import { JsonForms } from "@jsonforms/react";
import { Alert, Box, Dialog, Typography } from "@mui/material";
import { materialCells, materialRenderers } from "@jsonforms/material-renderers";

import { ajv as userAjv } from "../../../../core/AJVHelper";
import * as Api from "../../../../core/ApiStore";
import { getDateInStringFormat, requiredFieldsTranslator } from "../../../../core/CoreHelper";
import { DocumentWithFile } from "../../../../core/Models";

import schema from "../../../../core/schemas/user_info.json";
import ui from "./documents-ui.json";
import FileUploader from "../../../../components/fileUploader/FileUploader";
import { FetchStatus } from "../../../../hooks/useFetchFromAPI";
import { LoadingButton } from "@mui/lab";

export function AddDocument(props: { userId: number; isOpen: boolean; onClose: (commit?: boolean) => void }): React.ReactElement {
	const { userId, isOpen, onClose } = props;

	const [newDocument, setNewDocument] = useState({ upload_date: getDateInStringFormat() } as DocumentWithFile);
	const [errors, setErrors] = useState<ErrorObject[]>([]);
	const [creationState, setCreationState] = useState<FetchStatus>(FetchStatus.Initial);
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

	function areSchemaErrors(): boolean {
		return errors.length > 0;
	}

	function enableAdd(): boolean {
		return !areSchemaErrors() && newDocument.certificate !== undefined;
	}

	async function addDocument(): Promise<void> {
		setCreationState(FetchStatus.Fetching);
		dismissTimeout();

		const { success } = await Api.createDocument(userId, newDocument);

		if (success) onClose(true);
		else setCreationState(FetchStatus.Error);
	}

	return (
		<Dialog open={isOpen} onClose={(): void => onClose()}>
			<Box display="flex" flexDirection="column" gap="6px" width="400px" padding="12px">
				<Typography variant="h5">Agregar documento</Typography>

				<JsonForms
					i18n={{ translate: requiredFieldsTranslator as Translator }}
					ajv={userAjv}
					schema={schema.properties.documents.items}
					uischema={ui}
					renderers={materialRenderers}
					cells={materialCells}
					data={newDocument}
					onChange={({ data, errors }): void => {
						setNewDocument(data);
						setErrors(errors ?? []);
					}}
				/>

				<FileUploader label="Documento" width="100%" uploadedFile={(file): void => setNewDocument({ ...newDocument, certificate: file })} />

				{creationState === FetchStatus.Error ? (
					<Alert variant="outlined" severity="error">
						No se pudo crear documentación. Vuelva a intentar.
					</Alert>
				) : null}

				<Box display="flex" width="100%" justifyContent="flex-end">
					<LoadingButton variant="outlined" disabled={!enableAdd()} onClick={addDocument} loading={creationState === FetchStatus.Fetching}>
						Guardar
					</LoadingButton>
				</Box>
			</Box>
		</Dialog>
	);
}
