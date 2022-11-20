import React, { useEffect, useState } from "react";
import { ErrorObject } from "ajv";

import { Alert, Box, Dialog, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { JsonFormsCore, Translator } from "@jsonforms/core";
import { JsonForms } from "@jsonforms/react";
import { materialCells, materialRenderers } from "@jsonforms/material-renderers";

import { AbsencesWithFile } from "../../../../core/Models";
import * as API from "../../../../core/ApiStore";
import { dateBeforeOrEqualThan, requiredFieldsTranslator } from "../../../../core/CoreHelper";
import { ajv as userAjv } from "../../../../core/AJVHelper";
import { FetchStatus } from "../../../../hooks/useFetchFromAPI";

import schema from "../../../../core/schemas/user_info.json";
import ui from "./absences-ui.json";
import FileUploader from "../../../../components/fileUploader/FileUploader";

interface AddAbsenceProps {
	userId: number;
	isOpen: boolean;
	onClose: (added?: boolean) => void;
}

function AddAbsence(props: AddAbsenceProps): JSX.Element {
	const { userId, isOpen, onClose } = props;

	const [newAbscence, setNewAbscence] = useState<AbsencesWithFile>({} as AbsencesWithFile);
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

		const { success } = await API.createAbsences(userId, newAbscence);

		setCreationState(FetchStatus.Initial);

		if (success) handleDismiss(true);
		else setCreationState(FetchStatus.Error);
	}

	function handleChange(state: Pick<JsonFormsCore, "errors" | "data">): void {
		const { data, errors } = state;

		setNewAbscence(data);
		setErrors(errors ?? []);
	}

	function areSchemaErrors(): boolean {
		return (errors as unknown[]).length > 0;
	}

	function areDatesCorrect(): boolean {
		if (!newAbscence) return true;

		const { start_date, end_date } = newAbscence;

		if (!(start_date && end_date)) return false;

		return dateBeforeOrEqualThan(start_date, end_date);
	}

	function enableAdd(): boolean {
		if (!newAbscence || areSchemaErrors()) return false;

		return areDatesCorrect() && newAbscence.certificate !== undefined;
	}

	return (
		<Dialog open={isOpen} onClose={(): void => handleDismiss()}>
			<Box display="flex" flexDirection="column" gap="6px" width="400px" padding="12px">
				<Typography variant="h5">Agregar inasistencia</Typography>

				<JsonForms
					i18n={{ translate: requiredFieldsTranslator as Translator }}
					ajv={userAjv}
					schema={schema.properties.absences.items}
					uischema={ui}
					renderers={materialRenderers}
					cells={materialCells}
					data={newAbscence}
					onChange={handleChange}
				/>

				<FileUploader label="Certificado" width="100%" uploadedFile={(file): void => setNewAbscence({ ...newAbscence, certificate: file })} />

				<Box display="flex" width="100%" justifyContent="flex-end">
					<LoadingButton variant="outlined" disabled={!enableAdd()} onClick={handleAdd} loading={creationState === FetchStatus.Fetching}>
						Guardar
					</LoadingButton>
				</Box>

				{creationState === FetchStatus.Error && (
					<Alert severity={"error"}>
						<Typography>No se pudo crear la inasistencia. Vuelva a intentar.</Typography>
					</Alert>
				)}

				{!areDatesCorrect() && (
					<Alert severity={"error"}>
						<Typography>Fecha de inicio ha de ser menor o igual a la fecha de finalización.</Typography>
					</Alert>
				)}
			</Box>
		</Dialog>
	);
}

export default AddAbsence;
