import React from "react";
import { BrowserRouter } from "react-router-dom";
import { act, fireEvent, queryByText, render, waitForElementToBeRemoved } from "@testing-library/react";

import * as Parsers from "../../../../core/Parsers";
import * as CoreHelper from "../../../../core/CoreHelper";
import UploadStudentForm from "./UploadStudentForm";
import userEvent from "@testing-library/user-event";
import { defaultStudent } from "../../DefaultStudent";

describe("UploadStudentForm", () => {
	const dropZoneRef = "#file-drop-zone";
	const uploadedFileNameRef = "#uploaded-file-name";
	const fileInputRef = "#file-input";
	const errorAlertRef = "#create-student-alert-error";

	beforeEach(() => {
		jest.spyOn(CoreHelper, "processXLSXtoJSON").mockResolvedValue([]);

		jest.useFakeTimers();
	});

	test("Should not load file with incorrect extension when dropped", async () => {
		const wrapper = render(<UploadStudentForm studentProp={defaultStudent} onUpload={console.log} />, { wrapper: BrowserRouter });

		const testingFile = new File(["testing data"], "data.png", { type: "png" });

		const dropZone = wrapper.container.querySelector(dropZoneRef);
		if (dropZone === null) return;

		await act(async () => {
			await fireEvent.drop(dropZone, { dataTransfer: { files: [testingFile] } });
		});

		const uploadedFileName = wrapper.container.querySelector(uploadedFileNameRef);
		expect(uploadedFileName?.textContent).toEqual("");

		const errorAlert = wrapper.container.querySelector(errorAlertRef);
		expect(errorAlert?.textContent).toEqual("Extensión del archivo subido no es soportada");
	});

	test("Should not load file with incorrect extension when clicked", async () => {
		const wrapper = render(<UploadStudentForm studentProp={defaultStudent} onUpload={console.log} />, { wrapper: BrowserRouter });

		const testingFile = new File(["testing data"], "photo.png", { type: "png" });

		const fileInput = wrapper.container.querySelector(fileInputRef);
		if (fileInput === null) return;

		await act(async () => {
			await fireEvent.change(fileInput, { target: { files: [testingFile] } });
		});

		const uploadedFileName = wrapper.container.querySelector(uploadedFileNameRef);
		expect(uploadedFileName?.textContent).toEqual("");

		const errorAlert = wrapper.container.querySelector(errorAlertRef);
		expect(errorAlert?.textContent).toEqual("Extensión del archivo subido no es soportada");
	});

	test("Should show error on empty file and hide it after 3 seconds", async () => {
		const wrapper = render(<UploadStudentForm studentProp={defaultStudent} onUpload={console.log} />, { wrapper: BrowserRouter });

		const fileInput = wrapper.container.querySelector(fileInputRef);
		if (fileInput === null) return;

		await act(async () => {
			await fireEvent.change(fileInput, { target: { files: [] } });
		});

		const uploadedFileName = wrapper.container.querySelector(uploadedFileNameRef);
		expect(uploadedFileName?.textContent).toEqual("");

		let errorAlert = wrapper.container.querySelector(errorAlertRef);
		expect(errorAlert?.textContent).toEqual("Error al cargar el archivo.");

		await waitForElementToBeRemoved(errorAlert, { timeout: 5000 });

		errorAlert = wrapper.container.querySelector(errorAlertRef);
		expect(errorAlert).not.toBeTruthy();
	});

	test("Should show error on parse error", async () => {
		jest.spyOn(Parsers, "parseFormToStudent").mockReturnValue(null);

		const wrapper = render(<UploadStudentForm studentProp={defaultStudent} onUpload={console.log} />, { wrapper: BrowserRouter });

		const testingFile = new File(["testing data"], "data.xlsx", { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

		const dropZone = wrapper.container.querySelector(dropZoneRef);
		if (dropZone === null) return;

		await act(async () => {
			await fireEvent.drop(dropZone, { dataTransfer: { files: [testingFile] } });
		});

		const errorAlert = wrapper.container.querySelector(errorAlertRef);
		expect(errorAlert?.textContent).toEqual("El formato del excel subido no es correcto");
	});

	test("Should load file with correct extension when dropped", async () => {
		jest.spyOn(Parsers, "parseFormToStudent").mockReturnValue(defaultStudent);

		const wrapper = render(<UploadStudentForm studentProp={defaultStudent} onUpload={console.log} />, { wrapper: BrowserRouter });

		const testingFile = new File(["testing data"], "data.xlsx", { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

		const dropZone = wrapper.container.querySelector(dropZoneRef);
		if (dropZone === null) return;

		await act(async () => {
			await fireEvent.drop(dropZone, { dataTransfer: { files: [testingFile] } });
		});

		const uploadedFileName = wrapper.container.querySelector(uploadedFileNameRef);
		expect(uploadedFileName?.textContent).toEqual("Archivo subido: data.xlsx");
	});

	test("Should load file with correct extension when clicked", async () => {
		jest.spyOn(Parsers, "parseFormToStudent").mockReturnValue(defaultStudent);

		const wrapper = render(<UploadStudentForm studentProp={defaultStudent} onUpload={console.log} />, { wrapper: BrowserRouter });

		const testingFile = new File(["testing data"], "data.xlsx", { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

		const fileInput = wrapper.container.querySelector(fileInputRef);
		if (fileInput === null) return;

		await act(async () => {
			await fireEvent.change(fileInput, { target: { files: [testingFile] } });
		});

		const uploadedFileName = wrapper.container.querySelector(uploadedFileNameRef);
		expect(uploadedFileName?.textContent).toEqual("Archivo subido: data.xlsx");
	});

	test("Should show 'Tire el archivo.' on drag enter and 'Tire el archivo excel del alumno aquí ó haga click.' on drag exit", async () => {
		const wrapper = render(<UploadStudentForm studentProp={defaultStudent} onUpload={console.log} />, { wrapper: BrowserRouter });

		const dropZone = wrapper.container.querySelector(dropZoneRef);

		if (!dropZone) return;

		await act(() => {
			fireEvent.dragEnter(dropZone);
		});

		expect(dropZone.textContent).toEqual("Suelte el archivo.");

		await act(() => {
			fireEvent.dragExit(dropZone);
		});

		expect(dropZone.textContent).toEqual("Arrastre el archivo Excel del alumno aquí o haga click.");
	});

	test("Should call callback on 'Crear Alumno'", async () => {
		jest.spyOn(Parsers, "parseFormToStudent").mockReturnValue(defaultStudent);

		const onUploadCallback = jest.fn();

		const wrapper = render(<UploadStudentForm studentProp={defaultStudent} onUpload={onUploadCallback} />, { wrapper: BrowserRouter });

		const testingFile = new File(["testing data"], "data.xlsx", { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

		const fileInput = wrapper.container.querySelector(fileInputRef);
		if (fileInput === null) return;

		await act(async () => {
			await fireEvent.change(fileInput, { target: { files: [testingFile] } });
		});

		const uploadedFileName = wrapper.container.querySelector(uploadedFileNameRef);
		expect(uploadedFileName?.textContent).toEqual("Archivo subido: data.xlsx");

		const createButton = queryByText(wrapper.container, "Crear Alumno");
		if (createButton === null) return;

		await act(async () => {
			userEvent.click(createButton);
		});

		expect(onUploadCallback).toBeCalled();
	});
});
