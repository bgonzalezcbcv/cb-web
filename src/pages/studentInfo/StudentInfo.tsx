import React, { useState } from "react";

import { JsonForms } from "@jsonforms/react";
import { JsonSchema7, Translator, ValidationMode } from "@jsonforms/core";
import { materialRenderers } from "@jsonforms/material-renderers";

import { Button } from "@mui/material";

import "./StudentInfo.scss";

export type StudentInfoProps = {
	student: Student;
	onChange: (data: Student) => void;
	editable: boolean;
};

export type Student = {
	nombres: string;
	apellidos: string;
	ci: string;
	estado: ["Activo", "Inactivo", "Pendiente"];
	clase: string;
	subgrupo: string;
	matricula: number;
	nroReferencia: number;
	lugarNacimiento: string;
	fechaNacimiento: Date;
	nacionalidad: string;
	lenguaMaterna: string;
	direccion: string;
	barrio: string;
	coberturaMedica: string;
	emergencia: string;
	vacunas: Date;
};

export type StudentData = {
	nombres: string;
	apellidos: string;
	ci: string;
	estado: ["Activo", "Inactivo", "Pendiente"];
	clase: string;
	subgrupo: string;
	matricula: number;
	nroReferencia: number;
	lugarNacimiento: string;
	fechaNacimiento: Date;
	nacionalidad: string;
	lenguaMaterna: string;
	direccion: string;
	barrio: string;
	coberturaMedica: string;
	emergencia: string;
	vacunas: Date;
};

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
		estado: {
			type: "string",
			enum: ["Activo", "Inactivo", "Pendiente"],
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
		fechaNacimiento: {
			type: "string",
			format: "date",
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
			format: "date",
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
			type: "HorizontalLayout",
			elements: [
				{
					type: "Control",
					scope: "#/properties/ci",
				},
				{
					type: "Control",
					scope: "#/properties/estado",
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
					scope: "#/properties/clase",
				},
				{
					type: "Control",
					scope: "#/properties/subgrupo",
				},
				{
					type: "Control",
					scope: "#/properties/nroReferencia",
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
					scope: "#/properties/fechaNacimiento",
				},
				{
					type: "Control",
					scope: "#/properties/nacionalidad",
				},
			],
		},
		{
			type: "HorizontalLayout",
			elements: [
				{
					type: "Control",
					scope: "#/properties/lenguaMaterna",
				},
				{
					type: "Control",
					scope: "#/properties/barrio",
				},
				{
					type: "Control",
					scope: "#/properties/direccion",
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
				{
					type: "Control",
					scope: "#/properties/vacunas",
				},
			],
		},
	],
};

const dataExample = {
	nombres: "Santiago Roberto",
	apellidos: "Cancela Cardona",
	ci: "5.123.134-3",
	estado: "Activo",
	clase: "ClaseX",
	subgrupo: "A",
	matricula: 1234,
	nroReferencia: 5555,
	lugarNacimiento: "Montevideo",
	fechaNacimiento: "1999-04-10",
	nacionalidad: "Uruguaya",
	lenguaMaterna: "Espaniol",
	direccion: "Guazucua 331",
	barrio: "Nuevo Paris",
	coberturaMedica: "Universal",
	emergencia: "Universal",
	vacunas: "2022-09-10",
};

export default function StudentInfo(props: StudentInfoProps): React.ReactElement {
	console.log(props);

	const { editable } = props;

	const style = {
		margin: "20px",
	};

	const translator = (id: string, defaultMessage: string | undefined): string => {
		if (id.includes("ci.error")) return "Se deben ingresar solo los números, sin puntos ni guiones y no puede quedar vacía";
		return defaultMessage ?? "";
	};

	const [data, setData] = useState(dataExample);
	const [aux, setAux] = useState(dataExample);
	const [errors, setErrors] = useState<unknown[]>([]);
	const [validationMode, setValidationMode] = useState<ValidationMode>("ValidateAndHide");

	function saveOnClick(): void {
		setValidationMode("ValidateAndShow");

		if (errors.length > 0) return;

		//editable = !editable;
		setAux(data);
	}

	function cancelOnClick(): void {
		//editable = !editable;
		setData(aux);
	}
	return (
		<div>
			<div className="ImageSim"></div>
			<JsonForms
				i18n={{ translate: translator as Translator }}
				schema={schema}
				data={data}
				renderers={materialRenderers}
				onChange={({ data, errors }): void => {
					setErrors(errors ?? []);
					setData(data);
				}}
				uischema={uischema}
				readonly={editable}
				validationMode={validationMode}
			/>
			{!editable ? (
				<div className="ButtonContainer">
					<Button style={style} className="Button" variant="contained" onClick={saveOnClick}>
						Guardar
					</Button>
					<Button style={style} className="Button" variant="outlined" onClick={cancelOnClick}>
						Cancelar
					</Button>
				</div>
			) : null}
		</div>
	);
}
