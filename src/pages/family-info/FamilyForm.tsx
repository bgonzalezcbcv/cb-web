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

export default function FamilyForm(props: FamilyFormProps): React.ReactElement {
	const [canSaveArray, setCanSave] = useState(Array(props.family.length).fill(false));
	const [data, setData] = useState(props.family);
	const [familyIndex, setFamilyIndex] = useState(0);
	const setFamilyIndexFromButton = (event: React.MouseEvent<HTMLElement>, newIndex: number): void => {
		if (newIndex < 0) {
			const dataCopy = data.slice();
			dataCopy.push({} as FamilyMember);
			setData(dataCopy);
			setFamilyIndex(dataCopy.length - 1);
			return;
		}
		setFamilyIndex(newIndex);
	};
	const handleDefaultsAjv = createAjv({ useDefaults: true });
	function getCurrentData(): unknown {
		const dataCopy = data[familyIndex] as unknown as FamilyMemberData;
		if (data[familyIndex] && data[familyIndex].birthDate) {
			dataCopy.birthDate = data[familyIndex].birthDate.toString();
		}
		return dataCopy;
	}
	function setCurrentData(dataFamilyMember: FamilyMember, errors: unknown[] | undefined): void {
		const canSaveArrayCopy = canSaveArray.slice();
		canSaveArrayCopy[familyIndex] = !errors || errors.length == 0;
		setCanSave(canSaveArrayCopy);
		if (dataFamilyMember && dataFamilyMember.birthDate) {
			dataFamilyMember.birthDate = new Date(dataFamilyMember.birthDate);
		}
		const dataCopy = data.slice();
		dataCopy[familyIndex] = dataFamilyMember;
		setData(dataCopy);
	}
	function canSave(): boolean {
		let canSave = true;
		canSaveArray.forEach((element) => {
			canSave = canSave && element;
		});
		return canSave;
	}
	const toggleButtons = data.map((step, index) => {
		let text = "Familiar " + (index + 1).toString();
		if (step && step.fullName) text = step.fullName;
		return (
			<ToggleButton id={"family" + index.toString()} key={index} value={index}>
				{text}
			</ToggleButton>
		);
	});
	const allButtons = (): JSX.Element[] => {
		const toggleButtonArray = toggleButtons;
		if (data.length <= 1 && props.editable) {
			toggleButtonArray.push(
				<ToggleButton id="addFamilyMember" key={-1} value={-1}>
					+
				</ToggleButton>
			);
		}
		return toggleButtonArray;
	};

	const translator = (id: string, defaultMessage: string | undefined): string => {
		if (id.includes("ci.error")) return "Se deben ingresar solo los números, sin puntos ni guiones y no puede quedar vacía";
		return defaultMessage ?? "";
	};
	return (
		<div>
			<div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-end" }}>
				<ToggleButtonGroup value={familyIndex} exclusive onChange={setFamilyIndexFromButton}>
					{allButtons()}
				</ToggleButtonGroup>
			</div>
			<JsonForms
				i18n={{ translate: translator as Translator }}
				schema={schema as JsonSchema7}
				uischema={ui}
				data={getCurrentData()}
				renderers={materialRenderers}
				cells={materialCells}
				onChange={({ data, errors }): void => setCurrentData(data, errors)}
				readonly={!props.editable}
				ajv={handleDefaultsAjv}
			/>
			<div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-end" }}>
				{props.editable ? (
					<Button
						id="saveButton"
						variant="contained"
						disabled={!canSave()}
						onClick={(): void => {
							props.onChange(data);
						}}>
						Guardar
					</Button>
				) : null}
			</div>
		</div>
	);
}
