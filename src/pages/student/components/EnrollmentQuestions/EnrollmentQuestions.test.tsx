import React from "react";
import { act, getByText, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import * as UseDebounce from "../../../../hooks/useDebounce";
import EnrollmentQuestions from "./EnrollmentQuestions";
import { initialStudentData, expectedNewStudentData } from "./EnrollmentQuestions.fixture";
import * as API from "../../../../core/ApiStore";

describe("EnrollmentQuestions", () => {
	beforeEach(() => {
		jest.spyOn(API, "getCicleQuestions").mockResolvedValue({
			success: true,
			questionCategories: [
				{
					category: "Categoria",
					questions: [
						{
							id: "1",
							question: "Pregunta1",
							answer: "Respuesta1",
						},
						{
							id: "2",
							question: "Pregunta2",
							answer: "Respuesta2",
						},
						{
							id: "3",
							question: "Pregunta3",
							answer: "Respuesta3",
						},
					],
				},
			],
		});
		jest.spyOn(API, "postAnswersEnrollmentQuestions").mockResolvedValue(true);
		jest.useFakeTimers();
	});

	test("should render correctly view mode", async () => {
		const wrapper = render(
			<EnrollmentQuestions //
				student={initialStudentData}
				editable
				onChange={jest.fn}
				viewMode={"VIEW"}
			/>
		);

		const container = wrapper.container;

		expect(container).toMatchSnapshot();
	});

	test("should render correctly create mode", async () => {
		const wrapper = render(
			<EnrollmentQuestions //
				student={initialStudentData}
				editable
				onChange={jest.fn}
				viewMode={"CREATE"}
			/>
		);

		const container = wrapper.container;

		expect(container).toMatchSnapshot();
	});

	test("should call onChange with answer", async () => {
		jest.spyOn(UseDebounce, "default").mockImplementation((answer: unknown): unknown => {
			return answer;
		});

		const onChangeSpy = jest.fn((): void => {
			return;
		});

		const wrapper = render(
			<EnrollmentQuestions //
				student={initialStudentData}
				editable
				onChange={onChangeSpy}
				viewMode={"VIEW"}
			/>
		);

		const categoryAccordion = getByText(wrapper.container, "categoria 1");
		const answerTextField = getByText(wrapper.container, "answer 1a");
		const sendAnswers = getByText(wrapper.container, "Enviar Respuestas");

		act(() => {
			userEvent.click(categoryAccordion);
			userEvent.type(answerTextField, "new");
			userEvent.click(sendAnswers);
		});

		expect(answerTextField.textContent).toBe("answer 1anew");
		expect(onChangeSpy).toHaveBeenCalledWith(expectedNewStudentData);
	});
});
