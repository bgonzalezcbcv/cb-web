import React, { useState } from "react";

import { JsonForms } from "@jsonforms/react";
import { JsonSchema7 } from "@jsonforms/core";
import { materialCells, materialRenderers } from "@jsonforms/material-renderers";

import schema from "./schema.json";
import ui from "./ui.json";

import "./FamilyForm.scss";

const initialData = {};
import { createAjv } from "@jsonforms/core";
import { Button, ToggleButton, ToggleButtonGroup } from "@mui/material";

export default function FamilyForm(): React.ReactElement {
	const [data1, setData1] = useState(initialData);
	const [data2, setData2] = useState(initialData);
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
	function setCurrentData(data: Record<string, unknown>): void {
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
				onChange={({ data }): void => setCurrentData(data)}
				ajv={handleDefaultsAjv}
			/>
			<div style={{ textAlign: "right" }}>
				<Button variant="contained">Guardar</Button>
			</div>
		</div>
	);
}
