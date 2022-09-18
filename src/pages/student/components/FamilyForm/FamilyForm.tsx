import React, { useEffect, useState } from "react";

import { FamilyMember, Student } from "../../../../core/Models";
import { JsonForms } from "@jsonforms/react";
import { JsonSchema7, Translator, createAjv } from "@jsonforms/core";
import { materialCells, materialRenderers } from "@jsonforms/material-renderers";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";

import schema from "../../schema.json";
import ui from "./ui.json";

import "./FamilyForm.scss";

export type FamilyFormProps = {
	student: Student;
	editable: boolean;
	onChange: (data: Student) => void;
};

export default function FamilyForm(props: FamilyFormProps): React.ReactElement {
	const { student, onChange, editable } = props;
	const family = student.family;

	const [hasErrorsArray, setHasErrorsArray] = useState<boolean[]>(Array(family.length).fill(false));
	const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(family);
	const [familyIndex, setFamilyIndex] = useState(0);

	const handleDefaultsAjv = createAjv({ useDefaults: true });

	useEffect(
		() =>
			onChange({
				...student,
				family: familyMembers,
			}),
		[familyMembers]
	);

	const setFamilyIndexFromButton = (event: React.MouseEvent<HTMLElement>, newIndex: number): void => {
		newIndex !== null && setFamilyIndex(newIndex);
	};

	function setCurrentData(dataFamilyMember: FamilyMember, errors: unknown[] | undefined): void {
		const canSaveArrayCopy = hasErrorsArray.slice();
		canSaveArrayCopy[familyIndex] = !errors || errors.length == 0;
		setHasErrorsArray(canSaveArrayCopy);

		const familyMembersCopy = familyMembers.slice();
		familyMembersCopy[familyIndex] = dataFamilyMember;
		setFamilyMembers(familyMembersCopy);
	}

	// function canSave(): boolean {
	// 	let canSave = true;
	// 	hasErrorsArray.forEach((element) => {
	// 		canSave = canSave && element;
	// 	});
	// 	return canSave;
	// }

	const toggleButtons = familyMembers.map((step, index) => {
		let text = "Familiar " + (index + 1).toString();
		if (step && step.full_name) text = step.full_name;
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

					{familyMembers.length <= 1 && editable ? (
						<ToggleButton
							id="addFamilyMember"
							value={familyMembers.length}
							onClick={(): void => setFamilyMembers([...familyMembers, {} as FamilyMember])}>
							+
						</ToggleButton>
					) : null}
				</ToggleButtonGroup>
			</div>

			<JsonForms
				i18n={{ translate: translator as Translator }}
				schema={schema as JsonSchema7}
				uischema={ui}
				data={familyMembers[familyIndex]}
				renderers={materialRenderers}
				cells={materialCells}
				onChange={({ data, errors }): void => setCurrentData(data, errors)}
				readonly={!editable}
				ajv={handleDefaultsAjv}
			/>

			{/*<div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-end" }}>*/}
			{/*	{editable ? (*/}
			{/*		<Button*/}
			{/*			id="saveButton"*/}
			{/*			variant="contained"*/}
			{/*			disabled={!canSave()}*/}
			{/*			onClick={(): void => {*/}
			{/*				onChange({ ...student, family: familyMembers });*/}
			{/*			}}>*/}
			{/*			Guardar*/}
			{/*		</Button>*/}
			{/*	) : null}*/}
			{/*</div>*/}
		</div>
	);
}
