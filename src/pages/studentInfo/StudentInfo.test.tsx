/* eslint-disable */

import React from "react";
import { BrowserRouter } from "react-router-dom";
import { act, fireEvent, render } from "@testing-library/react";

import StudentInfo, { Student } from "./StudentInfo";

describe.skip("EditStudentInfo", () => {
	const saveButtonRef = "#saveButton";
	const ciRef = "#ci-input";
	const fullName = "#fullName-input";

	test("Should not be able to edit when editable=false", async () => {
		const wrapper = render(
			<StudentInfo
				onChange={(): void => {
					return;
				}}
				student={null}
				editable={false}
			/>,
			{ wrapper: BrowserRouter }
		);

		const saveButton = wrapper.container.querySelector(saveButtonRef);
		expect(saveButton).toEqual(null);

		const ciField = wrapper.container.querySelector(ciRef);
		if (ciField === null) return;
		await act(async () => {
			fireEvent.change(ciField, { target: "51231343" });
		});
		expect(ciField?.textContent).toEqual("");
	});

	test("Edit and save student info when editable=true", async () => {
		let info = null;
		const wrapper = render(
			<StudentInfo
				onChange={(data: Student): void => {
					info = data;
					return;
				}}
				student={info}
				editable={true}
			/>,
			{ wrapper: BrowserRouter }
		);

		const saveButton = wrapper.container.querySelector(saveButtonRef);
		expect(saveButton).not.toEqual(null);

		const ciField = wrapper.container.querySelector(ciRef);
		if (ciField === null) return;
		await act(async () => {
			fireEvent.change(ciField, { target: "51231343" });
		});
		expect(ciField?.textContent).toEqual("51231343");

		const save = wrapper.container.querySelector(saveButtonRef);
		if (save === null) return;
		await act(async () => {
			fireEvent.click(save);
		});
		expect(info.ci).toEqual("51231343");
	});
	test("Shouldn't save with errprs in form", async () => {
		let info = null;
		const wrapper = render(
			<StudentInfo
				onChange={(data: Student): void => {
					info = data;
					return;
				}}
				student={info}
				editable={true}
			/>,
			{ wrapper: BrowserRouter }
		);

		const saveButton = wrapper.container.querySelector(saveButtonRef);
		expect(saveButton).not.toEqual(null);

		const save = wrapper.container.querySelector(saveButtonRef);
		expect(save).not.toEqual(null);
		if (save === null) return;
		await act(async () => {
			fireEvent.click(save);
		});
		expect(info.toEqual(null));
		const ciField = wrapper.container.querySelector(ciRef);
		if (ciField === null) return;
		await act(async () => {
			fireEvent.change(ciField, { target: "51231343" });
			fireEvent.click(save);
		});
		expect(info.toEqual(null));
	});
});
