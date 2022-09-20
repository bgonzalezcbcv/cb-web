import React, { useCallback, useState } from "react";

import { FamilyMember, Student } from "../../../../core/Models";
import { JsonForms } from "@jsonforms/react";
import { JsonSchema7, Translator } from "@jsonforms/core";
import { materialRenderers } from "@jsonforms/material-renderers";
import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { defaultStudent } from "../../DefaultStudent";

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
	const { family } = student;

	const [familyIndex, setFamilyIndex] = useState(0);

	const setFamilyIndexFromButton = (event: React.MouseEvent<HTMLElement>, newIndex: number): void => {
		newIndex !== null && setFamilyIndex(newIndex);
	};

	function setCurrentData(dataFamilyMember: FamilyMember): void {
		const familyMembersCopy = family.slice();
		familyMembersCopy[familyIndex] = dataFamilyMember;
		onChange({
			...student,
			family: familyMembersCopy,
		});
	}

	function addFamilyMemberHandler(): void {
		onChange({
			...student,
			family: [...student.family, defaultStudent.family[0]],
		});
	}

	const toggleButtons = useCallback(
		(): React.ReactElement[] =>
			family.map((step, index) => {
				let text = "Familiar " + (index + 1).toString();
				if (step && step.full_name) text = step.full_name;
				return (
					<ToggleButton id={"family" + index.toString()} key={index} value={index}>
						{text}
					</ToggleButton>
				);
			}),
		[student]
	);

	const translator = (id: string, defaultMessage: string | undefined): string => {
		if (id.includes("ci.error")) return "El campo de CI no puede estar vacío.";
		return defaultMessage ?? "";
	};

	return (
		<Box display="flex" flexDirection="column" width="100%" height="100%">
			<Box display="flex" flexDirection="row" justifyContent="flex-end" marginBottom="12px">
				<ToggleButtonGroup value={familyIndex} exclusive onChange={setFamilyIndexFromButton}>
					{toggleButtons()}

					{family.length <= 1 && editable ? (
						<ToggleButton id="addFamilyMember" value={family.length} onClick={addFamilyMemberHandler}>
							+
						</ToggleButton>
					) : null}
				</ToggleButtonGroup>
			</Box>

			<JsonForms
				i18n={{ translate: translator as Translator }}
				schema={schema.properties.family.items[0] as JsonSchema7}
				uischema={ui}
				data={family[familyIndex]}
				renderers={materialRenderers}
				onChange={({ data }): void => setCurrentData(data)}
				validationMode="ValidateAndShow"
				readonly={!editable}
			/>
		</Box>
	);
}