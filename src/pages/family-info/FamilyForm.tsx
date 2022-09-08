import React, { useState } from "react";
import { Card, CardContent } from "@mui/material";

import { JsonForms } from "@jsonforms/react";
import { JsonSchema7 } from "@jsonforms/core";
import { materialCells, materialRenderers } from "@jsonforms/material-renderers";

import schema from "./schema.json";
import ui from "./ui.json";

import "./FamilyForm.scss";

const initialData = {};

export default function FamilyForm(): React.ReactElement {
	const [data, setData] = useState(initialData);

	return (
		<div>
			<Card>
				<CardContent>
					<JsonForms
						schema={schema as JsonSchema7}
						uischema={ui}
						data={data}
						renderers={materialRenderers}
						cells={materialCells}
						onChange={({ data }): void => setData(data)}
					/>
				</CardContent>
			</Card>
		</div>
	);
}
