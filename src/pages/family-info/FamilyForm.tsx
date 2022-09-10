import React, { useState } from "react";

import { JsonForms } from "@jsonforms/react";
import { JsonSchema7 } from "@jsonforms/core";
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

export default function FamilyForm(props: FamilyFormProps): React.ReactElement {
	const [canSave, setCanSave] = useState(false);
	const [data1, setData1] = useState(props.family[0]);
	const [data2, setData2] = useState(props.family[1]);
	const [familyIndex, setFamilyIndex] = useState(0);
	const setFamilyIndexFromButton = (event: React.MouseEvent<HTMLElement>, newIndex: number): void => {
		setFamilyIndex(newIndex);
	};
	const handleDefaultsAjv = createAjv({ useDefaults: true });
	function getCurrentData(): unknown {
		let data = data1;
		if (familyIndex != 0) {
			data = data2;
		}
		return data;
	}
	function setCurrentData(data: FamilyMember, errors: unknown[] | undefined): void {
		console.log(errors);
		setCanSave(!errors || errors.length == 0);
		if (familyIndex == 0) {
			setData1(data);
		} else {
			setData2(data);
		}
	}
	return (
		<div>
			<div>
				<ToggleButtonGroup value={familyIndex} exclusive onChange={setFamilyIndexFromButton}>
					<ToggleButton value={0}>Familiar 1</ToggleButton>
					<ToggleButton value={1}>Familiar 2</ToggleButton>
				</ToggleButtonGroup>
			</div>
			<JsonForms
				schema={schema as JsonSchema7}
				uischema={ui}
				data={getCurrentData()}
				renderers={materialRenderers}
				cells={materialCells}
				onChange={({ data, errors }): void => setCurrentData(data, errors)}
				ajv={handleDefaultsAjv}
			/>
			<div style={{ textAlign: "right" }}>
				<Button
					variant="contained"
					disabled={!canSave}
					onClick={(): void => {
						props.onChange([data1, data2]);
					}}>
					Guardar
				</Button>
			</div>
		</div>
	);
}
