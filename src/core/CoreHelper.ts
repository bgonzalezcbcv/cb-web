import _ from "lodash";
import * as XLSX from "xlsx";
import { JsonSchema7 } from "@jsonforms/core";

/**
 * @param xlsxFile Excel file with .xlsx format.
 * @returns Array of rows from the excel with the typing desired.
 */
export async function processXLSXtoJSON<Type>(xlsxFile: File): Promise<Type[]> {
	const data = await xlsxFile.arrayBuffer();

	const workbook = XLSX.read(data);

	console.log(XLSX.utils.sheet_to_json<Type>(workbook.Sheets[workbook.SheetNames[0]]));

	return XLSX.utils.sheet_to_json<Type>(workbook.Sheets[workbook.SheetNames[0]]);
}

export function downloadFile(fileName: string, file: Blob): void {
	const url = window.URL.createObjectURL(new Blob([file]));
	const link = document.createElement("a");
	link.href = url;
	link.setAttribute("download", fileName);

	// Append to html link element page
	document.body.appendChild(link);

	// Start download
	link.click();

	// Clean up and remove the link
	link.parentNode?.removeChild(link);
}

//1/2/1998 -> 01/02/1998
export function addLeadingZeroToDate(date: string): string {
	return date.replaceAll(/\b(\d)(?=\/)/gm, "0$1");
}

export const basicTranslator =
	(errors: { id: string; errorMessage: string }[], defaultErrorMessage = "Campo inválido.") =>
	(id: string, defaultMessage: string | undefined): string => {
		for (let i = 0; i < errors.length; i++) {
			if (id.includes(errors[i].id + ".error")) return errors[i].errorMessage;
		}

		if (id.includes("error")) return defaultErrorMessage;

		return defaultMessage ?? "";
	};

export const requiredFieldsTranslator = (id: string, defaultMessage: string): string => {
	if (id.includes("required")) return "Este campo es requerido.";
	else return defaultMessage;
};

export function pathToSchemaPath(path: string): string {
	return "properties." + path.replaceAll(".", ".properties.").replaceAll(/\[(\d*)\]/gm, ".items[$1]");
}

export function getTitleFromSchema(path: string, schema: JsonSchema7): string | undefined {
	return _.get(schema, pathToSchemaPath(path) + ".title") as string | undefined;
}

export function getFormattedPhone(phone: string): string {
	switch (phone.length) {
		case 8:
			return phone.replaceAll(/(\d{4})(\d{4})/gm, "$1 $2");
		case 9:
			return phone.replaceAll(/(\d{3})(\d{3})(\d{3})/gm, "$1 $2 $3");
		default:
			return phone;
	}
}

export function decomposeDate(date: string, separator: string | RegExp = "-"): number[] {
	return date.split(separator).map(Number);
}

export function dateBeforeOrEqualThan(date1: string, date2: string, separator = "-"): boolean {
	const [d1, m1, y1] = decomposeDate(date1, separator).map(Number);
	const [d2, m2, y2] = decomposeDate(date2, separator).map(Number);

	return y2 >= y1 && m2 >= m1 && d2 >= d1;
}

export function normalizeText(str: string): string {
	return str
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLowerCase();
}
