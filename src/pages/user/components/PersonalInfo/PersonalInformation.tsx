import React, { useState } from "react";
import { ErrorObject } from "ajv";

import { Box, Button, Typography } from "@mui/material";
import { JsonForms } from "@jsonforms/react";
import { Translator } from "@jsonforms/core";
import { materialCells, materialRenderers } from "@jsonforms/material-renderers";
import { UserInfo } from "../../../../core/Models";
import { requiredFieldsTranslator } from "../../../../core/CoreHelper";
import { ajv as userAjv } from "../../../../core/AJVHelper";
import ProfileCard from "../ProfileCard/ProfileCard";

import schema from "../../../../core/schemas/user_info.json";
import ui from "./personal-info-ui.json";

interface PersonalInformationProps {
	user: UserInfo;
	setUser: (newUser: UserInfo) => void;
	editable: boolean;
}

function PersonalInformation(props: PersonalInformationProps): JSX.Element {
	const { user, setUser, editable } = props;

	const [errors, setErrors] = useState<ErrorObject<string, Record<string, unknown>, unknown>[]>([]);

	function onSave(): void {
		alert("Not implemented");
	}

	function canSave(): boolean {
		const expectedCorrectProperties = ["ci", "phone", "name", "surname", "birthdate", "address"];

		return !errors.some((entry) => {
			return (
				expectedCorrectProperties.includes(entry.instancePath.replace("/", "")) ||
				expectedCorrectProperties.includes((entry.params.missingProperty as string) ?? "")
			);
		});
	}

	return (
		<ProfileCard
			title={
				<Box display="flex" flexDirection="row" alignContent="flex-start" width="100%">
					<Box display="flex" flexGrow={1} justifyContent="flex-start">
						<Typography variant="h5">Información básica</Typography>
					</Box>

					{editable && (
						<Box display="flex" justifyContent="flex-end" alignItems="flex-end">
							<Button variant="outlined" onClick={onSave} disabled={!canSave()}>
								Guardar
							</Button>
						</Box>
					)}
				</Box>
			}>
			<JsonForms
				i18n={{ translate: requiredFieldsTranslator as Translator }}
				ajv={userAjv}
				schema={schema}
				uischema={ui}
				renderers={materialRenderers}
				cells={materialCells}
				data={user}
				readonly={!editable}
				onChange={({ data, errors }): void => {
					setUser(data);
					setErrors(errors ?? []);
				}}
			/>
		</ProfileCard>
	);
}

export default PersonalInformation;
