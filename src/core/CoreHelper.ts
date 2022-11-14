import _ from "lodash";
import * as XLSX from "xlsx";
import { JsonSchema7 } from "@jsonforms/core";
import { Answer, Cicle, CicleQuestions, FinalEvaluation, IntermediateEvaluation, ReportApprovalState, ReportCard, StudentGroup } from "./Models";

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

export function apiDateToDisplayDate(stringDate: string | undefined): string {
	if (!stringDate || !/^\d{4}(-\d{2}){2}$/gm.test(stringDate)) return "";
	const aux = stringDate.split("-");
	return `${aux[2]}/${aux[1]}/${aux[0]}`;
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

export function setFinalReports(final_evaluations: FinalEvaluation[]): ReportCard[] {
	const reports: ReportCard[] = [];

	for (const ev of final_evaluations) {
		let status = ReportApprovalState.NA;

		switch (ev.status) {
			case "pending":
				status = ReportApprovalState.Pending;
				break;
			case "passed":
				status = ReportApprovalState.Approved;
				break;
			case "failed":
				status = ReportApprovalState.Failed;
				break;
		}

		const newReport: ReportCard = {
			id: ev.id,
			group: ev.group ? ev.group.grade_name : "",
			starting_month: new Date(),
			ending_month: new Date(),
			year: ev.group ? ev.group.year : "",
			type: "Final",
			passed: status,
			report_url: ev.report_card_url,
		};
		reports.push(newReport);
	}

	return reports;
}

export function setIntermediateReports(intermediate_evaluations: IntermediateEvaluation[]): ReportCard[] {
	const reports: ReportCard[] = [];

	for (const ev of intermediate_evaluations) {
		const start_month = ev.starting_month.replaceAll("-", "/");
		const end_month = ev.ending_month.replaceAll("-", "/");

		const newReport: ReportCard = {
			id: ev.id,
			group: ev.group ? ev.group.grade_name : "",
			starting_month: new Date(start_month),
			ending_month: new Date(end_month),
			year: "",
			type: "Intermedio",
			passed: ReportApprovalState.NA,
			report_url: ev.report_card_url,
		};
		reports.push(newReport);
	}

	return reports;
}

export function getFormDataFromObject(object: unknown): FormData {
	const formData = new FormData();

	if (typeof object === "object")
		Object.entries(object as object).forEach((entry) => {
			const [key, value] = entry;

			if (value instanceof File) return formData.append(key, value);

			if (value === undefined || value === null || _.isArray(value)) return;

			formData.append(key, value.toString());
		});

	return formData;
}

export function stringToDateString(stringDate: string | undefined): string | null {
	if (!stringDate || !/^(\d{2}-){2}\d{4}$/gm.test(stringDate)) return null;
	const aux = stringDate.split("-");
	return new Date(parseInt(aux[2]), parseInt(aux[1]) - 1, parseInt(aux[0])).toString();
}

export function reverseDate(date: string | undefined | null, desiredSeparator = "-", separator = "-"): string | undefined | null {
	if (!date) return date;

	const [year, month, day] = date.split(separator);

	return `${day}-${month}-${year}`.replaceAll("-", desiredSeparator);
}

export function groupString(group: StudentGroup): string {
	return `${group.grade_name} ${group.name} (${group.year})`;
}

export function getDateInStringFormat(date = new Date(), separator = "-"): string {
	const day = date.getDate();
	const month = date.getMonth();
	const year = date.getFullYear();

	return addLeadingZeroToDate(day + separator + month + separator + year);
}

export function mergeQuestionsAndAnswers(cicle_questions: CicleQuestions[], answers: Answer[]): CicleQuestions[] {
	const cicleQuestionsWithAnswers: CicleQuestions[] = _.cloneDeep(cicle_questions);

	cicleQuestionsWithAnswers.forEach((cicleQuestion) => {
		cicleQuestion.questions.forEach((q) => {
			const filteredAnswers = answers.filter((a) => a.question.id === q.id);
			if (filteredAnswers.length > 0) {
				q.answer = filteredAnswers[0].answer;
				q.answerId = filteredAnswers[0].id;
				q.httpRequest = "PATCH";
			} else {
				q.answer = "-";
				q.httpRequest = "POST";
			}
		});
	});

	return cicleQuestionsWithAnswers;
}

export function getCicleFromGroup(group: StudentGroup): Cicle {
	switch (group.grade_name) {
		case "Nivel 0":
		case "Nivel 1":
		case "Nivel 2":
			return Cicle.Nursery;

		case "Nivel 3":
		case "Nivel 4":
		case "Nivel 5":
		case "1ero":
		case "2do":
		case "3ero":
		case "4to":
		case "5to":
		case "6to":
			return Cicle.Primary;

		case "1 CBU":
		case "2 CBU":
		case "3 CBU":
			return Cicle.HighSchool;

		default:
			return Cicle.None;
	}
}
