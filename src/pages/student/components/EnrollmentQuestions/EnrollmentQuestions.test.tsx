import React from "react";
import { act, getByText, render } from "@testing-library/react";
import { EnrollmentQuestions } from "./EnrollmentQuestions";
import userEvent from "@testing-library/user-event";
import { initialStudentData, expectedNewStudentData } from "./EnrollmentQuestions.fixture";
import * as UseDebounce from "../../../../hooks/useDebounce";

describe("EnrollmentQuestions", () => {
	beforeEach(() => {
		jest.useFakeTimers();
	});

	test("should render correctly", async () => {
		const wrapper = render(
			<EnrollmentQuestions //
				studentData={initialStudentData}
				editable
				onChange={(changedData): void => {
					console.log(changedData);
				}}
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
				studentData={initialStudentData}
				editable
				onChange={onChangeSpy}
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
