import React from "react";
import { act, getByText, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import * as UseDebounce from "../../../../hooks/useDebounce";
import EnrollmentQuestions from "./EnrollmentQuestions";
import { initialStudentData, expectedNewStudentData } from "./EnrollmentQuestions.fixture";

describe("EnrollmentQuestions", () => {
	beforeEach(() => {
		jest.useFakeTimers();
	});

	test("should render correctly", async () => {
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

		const answerTextField = getByText(wrapper.container, "answer 1a");

		act(() => {
			userEvent.type(answerTextField, "new");
		});

		expect(answerTextField.textContent).toBe("answer 1anew");

		expect(onChangeSpy).toHaveBeenCalledWith(expectedNewStudentData);
	});
});
