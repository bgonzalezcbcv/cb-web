import React, { useState } from "react";

import { JsonForms } from "@jsonforms/react";
import { JsonSchema7, Translator } from "@jsonforms/core";
import { materialCells, materialRenderers } from "@jsonforms/material-renderers";

const schema: JsonSchema7 = {
	type: "object",
	properties: {
		nombres: {
			type: "string",
			minLength: 1,
		},
		apellidos: {
			type: "string",
			minLength: 1,
		},
		ci: {
			type: "string",
			minLength: 1,
		},
		clase: {
			type: "string",
			minLength: 0,
		},
		subgrupo: {
			type: "string",
			minLength: 0,
		},
		matricula: {
			type: "number",
		},
		nroReferencia: {
			type: "number",
		},
		lugarNacimiento: {
			type: "string",
		},
		nacionalidad: {
			type: "string",
		},
		lenguaMaterna: {
			type: "string",
		},
		direccion: {
			type: "string",
		},
		barrio: {
			type: "string",
		},
		coberturaMedica: {
			type: "string",
		},
		emergencia: {
			type: "string",
		},
		vacunas: {
			type: "string",
		},
	},
	required: ["names"],
};

const uischema = {
	type: "VerticalLayout",
	elements: [
		{
			type: "HorizontalLayout",
			elements: [
				{
					type: "Control",
					scope: "#/properties/nombres",
				},
				{
					type: "Control",
					scope: "#/properties/apellidos",
				},
			],
		},
		{
			type: "Control",
			scope: "#/properties/ci",
		},
		{
			type: "HorizontalLayout",
			elements: [
				{
					type: "Control",
					scope: "#/properties/clase",
				},
				{
					type: "Control",
					scope: "#/properties/subgrupo",
				},
				{
					type: "Control",
					scope: "#/properties/matricula",
				},
			],
		},
		{
			type: "HorizontalLayout",
			elements: [
				{
					type: "Control",
					scope: "#/properties/lugarNacimiento",
				},
				{
					type: "Control",
					scope: "#/properties/nacionalidad",
				},
				{
					type: "Control",
					scope: "#/properties/lenguaMaterna",
				},
			],
		},
		{
			type: "HorizontalLayout",
			elements: [
				{
					type: "Control",
					scope: "#/properties/direccion",
				},
				{
					type: "Control",
					scope: "#/properties/barrio",
				},
			],
		},
		{
			type: "HorizontalLayout",
			elements: [
				{
					type: "Control",
					scope: "#/properties/coberturaMedica",
				},
				{
					type: "Control",
					scope: "#/properties/emergencia",
				},
			],
		},
		{
			type: "Control",
			scope: "#/properties/vacunas",
		},
	],
};

const initialData = {};

export default function StudentForm(): React.ReactElement {
	const [data, setData] = useState(initialData);

	const translator = (id: string, defaultMessage: string | undefined): string => {
		if (id.includes("nombres.error")) return "Ingresar nombre/s";
		return defaultMessage ?? "Error";
	};

	return (
		<div>
			<JsonForms
				i18n={{ translate: translator as Translator }}
				schema={schema}
				uischema={uischema}
				data={data}
				renderers={materialRenderers}
				cells={materialCells}
				onChange={({ data }): void => setData(data)}
			/>
		</div>
	);
}
