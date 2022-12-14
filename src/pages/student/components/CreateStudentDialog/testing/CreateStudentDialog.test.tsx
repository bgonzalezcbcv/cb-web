import React from "react";
import * as ReactRouter from "react-router";
import { act, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ErrorObject } from "ajv";

import { Student } from "../../../../../core/Models";
import { StudentPageMode } from "../../../../../core/interfaces";
import * as API from "../../../../../core/ApiStore";
import * as AJVHelper from "../../../../../core/AJVHelper";
import * as ErrorList from "../../../../../components/ErrorList/ErrorList";
import CreateStudentDialog from "../CreateStudentDialog";

describe("CreateStudentDialog", () => {
	beforeEach(() => {
		jest.spyOn(ErrorList, "default").mockReturnValue(<div>Error List</div>);
		jest.spyOn(API, "createStudent").mockResolvedValue({ success: true, error: "" });
		jest.spyOn(ReactRouter, "useNavigate").mockImplementation(() => jest.fn);
	});

	it("should render a button", () => {
		const wrapper = render(<CreateStudentDialog student={{} as Student} />);

		expect(wrapper).toMatchSnapshot();
	});

	it("should render a dialog when create student button is clicked", async () => {
		jest.spyOn(AJVHelper, "getAjvErrors").mockReturnValue([{} as ErrorObject]);
		jest.spyOn(AJVHelper, "getParsedErrors").mockReturnValue({});

		const wrapper = render(<CreateStudentDialog student={{} as Student} />);

		const createStudentButton = await wrapper.findByText("Crear Alumno");

		act(() => {
			userEvent.click(createStudentButton);
		});

		expect(wrapper).toMatchSnapshot();
	});

	it("should not render a dialog when create student button is clicked and no errors are found", async () => {
		jest.spyOn(AJVHelper, "getAjvErrors").mockReturnValue(null);
		jest.spyOn(AJVHelper, "getParsedErrors").mockReturnValue({});

		const wrapper = render(<CreateStudentDialog student={{} as Student} />);

		const createStudentButton = await wrapper.findByText("Crear Alumno");

		act(() => {
			userEvent.click(createStudentButton);
		});

		const successTitle = await wrapper.findByText("¬°Estudiante creado correctamente!");

		expect(successTitle).toBeVisible();
	});

	it("should not render a dialog with errors when create student button is clicked and no errors are found but fails creation", async () => {
		jest.spyOn(AJVHelper, "getAjvErrors").mockReturnValue(null);
		jest.spyOn(AJVHelper, "getParsedErrors").mockReturnValue({});
		jest.spyOn(API, "createStudent").mockResolvedValue({ success: false, error: "" });

		const wrapper = render(<CreateStudentDialog student={{} as Student} />);

		const createStudentButton = await wrapper.findByText("Crear Alumno");

		act(() => {
			userEvent.click(createStudentButton);
		});

		const failureAlert = await wrapper.findByText("No se pudo crear el alumno. Int√©ntelo de nuevo o corrija los errores.");

		expect(failureAlert).toBeVisible();
	});

	it("should not render a dialog when cancel button is clicked", async () => {
		jest.spyOn(AJVHelper, "getAjvErrors").mockReturnValue([{} as ErrorObject]);
		jest.spyOn(AJVHelper, "getParsedErrors").mockReturnValue({});

		const wrapper = render(<CreateStudentDialog student={{} as Student} />);

		const createStudentButton = await wrapper.findByText("Crear Alumno");

		act(() => {
			userEvent.click(createStudentButton);
		});

		const cancelButton = await wrapper.findByText("Cancelar");

		act(() => {
			userEvent.click(cancelButton);
		});

		expect(cancelButton).not.toBeVisible();

		expect(wrapper).toMatchSnapshot();
	});

	it("should render a success dialog on creation success", async () => {
		jest.spyOn(AJVHelper, "getAjvErrors").mockReturnValue([{} as ErrorObject]);
		jest.spyOn(AJVHelper, "getParsedErrors").mockReturnValue({});
		jest.spyOn(API, "createStudent").mockResolvedValue({ success: true, error: "" });

		const wrapper = render(<CreateStudentDialog student={{} as Student} />);

		const createStudentButton = await wrapper.findByText("Crear Alumno");

		act(() => {
			userEvent.click(createStudentButton);
		});

		const acceptButton = await wrapper.findByText("Aceptar");

		act(() => {
			userEvent.click(acceptButton);
		});

		const successTitle = await wrapper.findByText("¬°Estudiante creado correctamente!");

		expect(successTitle).toBeVisible();
	});

	it("should render a an alert on creation failure", async () => {
		jest.spyOn(AJVHelper, "getAjvErrors").mockReturnValue([{} as ErrorObject]);
		jest.spyOn(AJVHelper, "getParsedErrors").mockReturnValue({});
		jest.spyOn(API, "createStudent").mockResolvedValue({ success: false, error: "" });

		const wrapper = render(<CreateStudentDialog student={{} as Student} />);

		const createStudentButton = await wrapper.findByText("Crear Alumno");

		act(() => {
			userEvent.click(createStudentButton);
		});

		const acceptButton = await wrapper.findByText("Aceptar");

		act(() => {
			userEvent.click(acceptButton);
		});

		const failureAlert = await wrapper.findByText("No se pudo crear el alumno. Int√©ntelo de nuevo o corrija los errores.");
		const retryButton = await wrapper.findByText("Reintentar");

		expect(failureAlert).toBeVisible();
		expect(retryButton).toBeVisible();
	});

	describe("@editable mode", () => {
		beforeEach(() => {
			jest.spyOn(ErrorList, "default").mockReturnValue(<div>Error List</div>);
			jest.spyOn(API, "createStudent").mockResolvedValue({ success: true, error: "" });
		});

		it("should render an editable modal", async () => {
			jest.spyOn(AJVHelper, "getAjvErrors").mockReturnValue([{} as ErrorObject]);
			jest.spyOn(AJVHelper, "getParsedErrors").mockReturnValue({});

			const wrapper = render(<CreateStudentDialog student={{} as Student} mode={StudentPageMode.edit} />);

			const createStudentButton = await wrapper.findByText("Guardar");

			act(() => {
				userEvent.click(createStudentButton);
			});

			expect(wrapper).toMatchSnapshot();
		});
	});
});
