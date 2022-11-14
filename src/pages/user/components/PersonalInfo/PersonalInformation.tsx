import React, { useEffect, useState } from "react";
import { ErrorObject } from "ajv";

import { Alert, Box, Typography } from "@mui/material";
import { JsonForms } from "@jsonforms/react";
import { Translator } from "@jsonforms/core";
import { materialCells, materialRenderers } from "@jsonforms/material-renderers";

import * as Api from "../../../../core/ApiStore";
import { UserInfo } from "../../../../core/Models";
import { requiredFieldsTranslator } from "../../../../core/CoreHelper";
import { ajv as userAjv } from "../../../../core/AJVHelper";
import ProfileCard from "../ProfileCard/ProfileCard";
import { FetchStatus } from "../../../../hooks/useFetchFromAPI";

import schema from "../../../../core/schemas/user_info.json";
import ui from "./personal-info-ui.json";
import { LoadingButton } from "@mui/lab";

interface PersonalInformationProps {
	user: UserInfo;
	setUser: (newUser: UserInfo) => void;
	refetch: () => void;
}

function PersonalInformation(props: PersonalInformationProps): JSX.Element {
	const { user, setUser, refetch } = props;

	const [errors, setErrors] = useState<ErrorObject<string, Record<string, unknown>, unknown>[]>([]);
	const [updateState, setUpdateState] = useState<FetchStatus>(FetchStatus.Initial);
	const [errorID, setErrorID] = useState<null | number>(null);

	function dismissTimeout(): void {
		if (errorID) window.clearTimeout(errorID);
	}

	useEffect(() => {
		if (updateState === FetchStatus.Error) {
			dismissTimeout();

			setErrorID(window.setTimeout(() => setUpdateState(FetchStatus.Initial), 5000));
		}
	}, [updateState]);

	async function onSave(): Promise<void> {
		setUpdateState(FetchStatus.Fetching);

		const { success } = await Api.updateUser(user);

		setUpdateState(FetchStatus.Initial);

		if (success) refetch();
		else setUpdateState(FetchStatus.Error);
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

					<Box display="flex" justifyContent="flex-end" alignItems="flex-start" paddingLeft="12px">
						<LoadingButton variant="outlined" onClick={onSave} disabled={!canSave()} loading={updateState === FetchStatus.Fetching}>
							Guardar
						</LoadingButton>
					</Box>
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
				readonly={false}
				onChange={({ data, errors }): void => {
					setUser(data);
					setErrors(errors ?? []);
				}}
			/>

			{updateState === FetchStatus.Error && (
				<Alert variant="outlined" severity="error">
					No se pudo guardar el usuario. Vuelva a intentar.
				</Alert>
			)}
		</ProfileCard>
	);
}

export default PersonalInformation;
