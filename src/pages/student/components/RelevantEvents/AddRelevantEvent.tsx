import _ from "lodash";
import React, { useEffect, useState } from "react";
import { ErrorObject } from "ajv";

import { Alert, Box, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { JsonFormsCore, JsonSchema7 } from "@jsonforms/core";
import { JsonForms } from "@jsonforms/react";
import { materialRenderers } from "@jsonforms/material-renderers";

import { EventType, EventTypeName, RelevantEventWithFile } from "../../../../core/Models";
import * as Api from "../../../../core/ApiStore";
import { getCustomAjv } from "../../../../core/AJVHelper";
import { FetchStatus } from "../../../../hooks/useFetchFromAPI";

import incompleteSchema from "./adding_schema.json";
import ui from "./ui.json";
import FileUploader from "../../../../components/fileUploader/FileUploader";

const schema = _.set(
	incompleteSchema,
	"properties.event_type.oneOf",
	Object.values(EventType).map((value) => {
		return {
			const: value,
			title: EventTypeName[value as keyof typeof EventTypeName],
		};
	})
);

const ajv = getCustomAjv({ allErrors: true, verbose: true, strictRequired: true, useDefaults: true });

interface AddRelevantEventProps {
	studentId: number;
	isOpen: boolean;
	onClose: (created?: boolean) => void;
}

function AddRelevantEvent(props: AddRelevantEventProps): JSX.Element {
	const { studentId, isOpen, onClose } = props;

	const [newRelevantEvent, setNewRelevantEvent] = useState<RelevantEventWithFile>({} as RelevantEventWithFile);
	const [errors, setErrors] = useState<ErrorObject[]>([]);
	const [creationState, setCreationState] = useState<FetchStatus>(FetchStatus.Initial);
	const [timeoutId, setTimeoutId] = useState<number | null>(null);

	useEffect(() => {
		if (creationState === FetchStatus.Error && !timeoutId) {
			setTimeoutId(
				window.setTimeout(() => {
					setCreationState(FetchStatus.Initial);
					setTimeoutId(null);
				}, 5000)
			);
		}
	}, [creationState, timeoutId]);

	function handleDismiss(created = false): void {
		setNewRelevantEvent({} as RelevantEventWithFile);
		setErrors([]);
		setCreationState(FetchStatus.Initial);
		setTimeoutId(null);
		onClose(created);
	}

	function handleChange(state: Pick<JsonFormsCore, "data" | "errors">): void {
		const { data, errors } = state;

		setNewRelevantEvent(data);
		setErrors(errors ?? []);
	}

	async function handleCreate(): Promise<void> {
		if (timeoutId) {
			window.clearTimeout(timeoutId);
			setTimeoutId(null);
		}

		setCreationState(FetchStatus.Fetching);

		const { success } = await Api.createRelevantEvent(studentId, newRelevantEvent);

		setCreationState(FetchStatus.Initial);

		if (success) handleDismiss(true);
		else setCreationState(FetchStatus.Error);
	}

	return (
		<Dialog open={isOpen} onClose={(): void => handleDismiss()}>
			<DialogTitle>Añadir evento</DialogTitle>
			<DialogContent>
				<Box display="flex" flexDirection="column" gap="6px">
					<JsonForms //
						ajv={ajv}
						renderers={materialRenderers}
						data={newRelevantEvent}
						uischema={ui}
						schema={schema as JsonSchema7}
						onChange={handleChange}
						validationMode="ValidateAndShow"
					/>

					<FileUploader label="Adjunto" width="100%" uploadedFile={(file): void => setNewRelevantEvent({ ...newRelevantEvent, attachment: file })} />

					{creationState === FetchStatus.Error && (
						<Alert variant="outlined" severity="error">
							No se pudo crear el evento. Intente otra vez.
						</Alert>
					)}

					<Box display="flex" justifyContent="flex-end">
						<LoadingButton variant="outlined" disabled={errors.length > 0} onClick={handleCreate} loading={creationState === FetchStatus.Fetching}>
							Crear
						</LoadingButton>
					</Box>
				</Box>
			</DialogContent>
		</Dialog>
	);
}

export default AddRelevantEvent;
