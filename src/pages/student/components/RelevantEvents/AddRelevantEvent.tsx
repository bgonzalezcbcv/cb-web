import _ from "lodash";
import React, { useState } from "react";
import { ErrorObject } from "ajv";

import { Box, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { JsonFormsCore, JsonSchema7 } from "@jsonforms/core";
import { JsonForms } from "@jsonforms/react";
import { materialRenderers } from "@jsonforms/material-renderers";

import { EventType, EventTypeName, RelevantEvent } from "../../../../core/Models";
import { getCustomAjv } from "../../../../core/AJVHelper";

import incompleteSchema from "./adding_schema.json";
import ui from "./ui.json";

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

	const [newRelevantEvent, setNewRelevantEvent] = useState<RelevantEvent>({} as RelevantEvent);
	const [errors, setErrors] = useState<ErrorObject[]>([]);

	function handleDismiss(created = false): void {
		onClose(created);
	}

	function handleChange(state: Pick<JsonFormsCore, "data" | "errors">): void {
		const { data, errors } = state;

		console.log(data);
		setNewRelevantEvent(data);
		setErrors(errors ?? []);
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

					<Box display="flex" justifyContent="flex-end">
						<LoadingButton variant="outlined" disabled={errors.length > 0}>
							Crear
						</LoadingButton>
					</Box>
				</Box>
			</DialogContent>
		</Dialog>
	);
}

export default AddRelevantEvent;
