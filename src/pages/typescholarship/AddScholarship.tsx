import React, { useEffect, useState } from "react";
import { ErrorObject } from "ajv";

import { JsonForms } from "@jsonforms/react";
import { Translator } from "@jsonforms/core";
import { materialCells, materialRenderers } from "@jsonforms/material-renderers";
import { Alert, Box, Dialog, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";

import { TypeScholarship } from "../../core/Models";
import * as Api from "../../core/ApiStore";
import { getCustomAjv } from "../../core/AJVHelper";
import { requiredFieldsTranslator } from "../../core/CoreHelper";
import { FetchStatus } from "../../hooks/useFetchFromAPI";

import schema from "./schema.json";
import ui from "./ui.json";

interface AddScholarshipProps {
	isOpen: boolean;
	onClose: (created?: boolean) => void;
}

function AddScholarship(props: AddScholarshipProps): JSX.Element {
	const { isOpen, onClose } = props;

	const [newScholarship, setNewScholarship] = useState<TypeScholarship>({} as TypeScholarship);
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

	function enableAdd(): boolean {
		return errors.length === 0;
	}

	async function addScholarship(): Promise<void> {
		setCreationState(FetchStatus.Fetching);
		dismissTimeout();

		const { success } = await Api.createTypeScholarship(newScholarship);

		if (success) onClose(true);
		else setCreationState(FetchStatus.Error);
	}

	return (
		<Dialog open={isOpen} onClose={(): void => onClose()}>
			<Box display="flex" flexDirection="column" gap="6px" width="400px" padding="12px">
				<Typography variant="h5">Agregar convenio</Typography>

				<JsonForms
					i18n={{ translate: requiredFieldsTranslator as Translator }}
					ajv={getCustomAjv({ allErrors: true, verbose: true, strictRequired: true, useDefaults: true })}
					schema={schema}
					uischema={ui}
					renderers={materialRenderers}
					cells={materialCells}
					data={newScholarship}
					onChange={({ data, errors }): void => {
						setNewScholarship(data);
						setErrors(errors ?? []);
					}}
				/>

				{creationState === FetchStatus.Error ? (
					<Alert variant="outlined" severity="error">
						No se pudo crear el convenio. Vuelva a intentar.
					</Alert>
				) : null}

				<Box display="flex" width="100%" justifyContent="flex-end">
					<LoadingButton variant="outlined" disabled={!enableAdd()} onClick={addScholarship} loading={creationState === FetchStatus.Fetching}>
						Guardar
					</LoadingButton>
				</Box>
			</Box>
		</Dialog>
	);
}

export default AddScholarship;
