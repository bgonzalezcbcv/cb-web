import React, { useState } from "react";

import { JsonForms } from "@jsonforms/react";
import { JsonSchema7, Translator } from "@jsonforms/core";
import { materialCells, materialRenderers } from "@jsonforms/material-renderers";

import schema from "./schema.json";
import ui from "./ui.json";

import "./FamilyForm.scss";

import { createAjv } from "@jsonforms/core";
import { Button, ToggleButton, ToggleButtonGroup } from "@mui/material";

export type FamilyFormProps = {
	family: FamilyMember[];
	onChange: (data: FamilyMember[]) => unknown;
	editable: boolean;
};
export type FamilyMember = {
	role: string;
	fullName: string;
	birthDate: Date;
	birthCountry: string;
	nationality: string;
	motherTongue: string;
	ci: number;
	maritalStatus: string;
	cellphone: string;
	email: string;
	address: string;
	residenceNeighbourhood: string;
	educationLevel: string;
	occupation: string;
	workplace: string;
	workplaceAddress: string;
	workplaceNeighbourhood: string;
	workplacePhone: string;
};
type FamilyMemberData = {
	role: string;
	fullName: string;
	birthDate: string;
	birthCountry: string;
	nationality: string;
	motherTongue: string;
	ci: number;
	maritalStatus: string;
	cellphone: string;
	email: string;
	address: string;
	residenceNeighbourhood: string;
	educationLevel: string;
	occupation: string;
	workplace: string;
	workplaceAddress: string;
	workplaceNeighbourhood: string;
	workplacePhone: string;
};

function parseFamilyMemberData(familyMember: FamilyMember): FamilyMemberData {
	return {
		...familyMember,
		birthDate: familyMember?.birthDate?.toString() ?? "",
	};
}

function parseFamilyMember(familyMemberData: FamilyMemberData): FamilyMember {
	return {
		...familyMemberData,
		birthDate: new Date(familyMemberData?.birthDate ?? ""), // TODO: check
	};
}

function canParseFamilyMember(familyMemberData: FamilyMemberData): boolean {
	const date = Date.parse(familyMemberData?.birthDate);
	return !isNaN(date);
}

export default function FamilyForm(props: FamilyFormProps): React.ReactElement {
	const { family, onChange, editable } = props;

	const [hasErrorsArray, setHasErrorsArray] = useState<boolean[]>(Array(family.length).fill(false));
	const [familyMemberDatas, setFamilyMemberDatas] = useState<FamilyMemberData[]>(family.map(parseFamilyMemberData));
	const [familyIndex, setFamilyIndex] = useState(0);

	const handleDefaultsAjv = createAjv({ useDefaults: true });

	const setFamilyIndexFromButton = (event: React.MouseEvent<HTMLElement>, newIndex: number): void => {
		newIndex !== null && setFamilyIndex(newIndex);
	};

	function setCurrentData(dataFamilyMember: FamilyMemberData, errors: unknown[] | undefined): void {
		const canSaveArrayCopy = hasErrorsArray.slice();
		canSaveArrayCopy[familyIndex] = !errors || errors.length == 0;
		setHasErrorsArray(canSaveArrayCopy);

		if (!canParseFamilyMember(dataFamilyMember)) return;

		const familyMemberDatasCopy = familyMemberDatas.slice();
		familyMemberDatasCopy[familyIndex] = dataFamilyMember;
		setFamilyMemberDatas(familyMemberDatasCopy);
	}

	function canSave(): boolean {
		let canSave = true;
		hasErrorsArray.forEach((element) => {
			canSave = canSave && element;
		});
		return canSave;
	}

	const toggleButtons = familyMemberDatas.map((step, index) => {
		let text = "Familiar " + (index + 1).toString();
		if (step && step.fullName) text = step.fullName;
		return (
			<ToggleButton id={"family" + index.toString()} key={index} value={index}>
				{text}
			</ToggleButton>
		);
	});

	const translator = (id: string, defaultMessage: string | undefined): string => {
		if (id.includes("ci.error")) return "Se deben ingresar solo los números, sin puntos ni guiones y no puede quedar vacía";
		return defaultMessage ?? "";
	};

	return (
		<div>
			<div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-end" }}>
				<ToggleButtonGroup value={familyIndex} exclusive onChange={setFamilyIndexFromButton}>
					{toggleButtons}

					{familyMemberDatas.length <= 1 && editable ? (
						<ToggleButton
							id="addFamilyMember"
							value={familyMemberDatas.length}
							onClick={(): void => setFamilyMemberDatas([...familyMemberDatas, {} as FamilyMemberData])}>
							+
						</ToggleButton>
					) : null}
				</ToggleButtonGroup>
			</div>
			<JsonForms
				i18n={{ translate: translator as Translator }}
				schema={schema as JsonSchema7}
				uischema={ui}
				data={familyMemberDatas[familyIndex]}
				renderers={materialRenderers}
				cells={materialCells}
				onChange={({ data, errors }): void => setCurrentData(data, errors)}
				readonly={!editable}
				ajv={handleDefaultsAjv}
			/>
			<div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-end" }}>
				{editable ? (
					<Button
						id="saveButton"
						variant="contained"
						disabled={!canSave()}
						onClick={(): void => {
							onChange(familyMemberDatas.map(parseFamilyMember));
						}}>
						Guardar
					</Button>
				) : null}
			</div>
		</div>
	);
}
