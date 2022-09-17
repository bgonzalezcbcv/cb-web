import * as XLSX from "xlsx";

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
