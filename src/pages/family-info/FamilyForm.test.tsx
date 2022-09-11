import React from "react";
import { BrowserRouter } from "react-router-dom";
import { act, fireEvent, render } from "@testing-library/react";

import FamilyForm, { FamilyMember } from "./FamilyForm";

describe("EditFamilyForm", () => {
	const saveButtonRef = "#saveButton";
	const addMemberRef = "#addFamilyMember";
	const ciRef = "#ci2-input";
	const fullNameRef = "#fullName2-input";
	const member1Ref = "#family0";
	const member2Ref = "#family1";

	test("Should not be able to edit when editable=false", async () => {
		const wrapper = render(
			<FamilyForm
				onChange={(): void => {
					return;
				}}
				family={Array(1).fill(null)}
				editable={false}
			/>,
			{ wrapper: BrowserRouter }
		);

		const saveButton = wrapper.container.querySelector(saveButtonRef);
		expect(saveButton).toEqual(null);

		const plusButton = wrapper.container.querySelector(addMemberRef);
		expect(plusButton).toEqual(null);

		const ciField = wrapper.container.querySelector(ciRef);
		if (ciField === null) return;
		await act(async () => {
			fireEvent.change(ciField, { target: "1.123.123-1" });
		});

		expect(ciField?.textContent).toEqual("");
	});

	test("Edit and save family members when editable=true", async () => {
		let info = Array(2).fill(null);
		const wrapper = render(
			<FamilyForm
				onChange={(data: FamilyMember[]): void => {
					info = data;
					return;
				}}
				family={info}
				editable={true}
			/>,
			{ wrapper: BrowserRouter }
		);

		const saveButton = wrapper.container.querySelector(saveButtonRef);
		expect(saveButton).not.toEqual(null);

		const plusButton = wrapper.container.querySelector(addMemberRef);
		expect(plusButton).toEqual(null);

		const ciField = wrapper.container.querySelector(ciRef);
		if (ciField === null) return;
		const member2 = wrapper.container.querySelector(member2Ref);
		if (member2 === null) return;
		await act(async () => {
			fireEvent.change(ciField, { target: "1.123.123-1" });
			fireEvent.click(member2);
		});
		expect(ciField?.textContent).toEqual("1.123.123-1");

		const ciField2 = wrapper.container.querySelector(ciRef);
		const save = wrapper.container.querySelector(saveButtonRef);
		if (ciField2 === null) return;
		if (save === null) return;
		await act(async () => {
			fireEvent.change(ciField2, { target: "4.456.456-7" });
			fireEvent.click(save);
		});
		expect(ciField2?.textContent).toEqual("4.456.456-7");

		expect(info[0].ci).toEqual("1.123.123-1");
		expect(info[1].ci).toEqual("4.456.456-7");
	});

	test("Shouldn't save with errors in form", async () => {
		let info = Array(1).fill(null);
		const wrapper = render(
			<FamilyForm
				onChange={(data: FamilyMember[]): void => {
					info = data;
					return;
				}}
				family={info}
				editable={true}
			/>,
			{ wrapper: BrowserRouter }
		);

		const saveButton = wrapper.container.querySelector(saveButtonRef);
		expect(saveButton).not.toEqual(null);

		// plus button only available when editting and only one member
		const plusButton = wrapper.container.querySelector(addMemberRef);
		expect(plusButton).not.toEqual(null);

		const save = wrapper.container.querySelector(saveButtonRef);
		expect(save).not.toEqual(null);
		if (save === null) return;
		await act(async () => {
			fireEvent.click(save);
		});
		expect(info[0]).toEqual(null);
		const ciField = wrapper.container.querySelector(ciRef);
		if (ciField === null) return;
		await act(async () => {
			fireEvent.change(ciField, { target: "123aa" });
			fireEvent.click(save);
		});
		expect(info[0]).toEqual(null);
	});

	// eslint-disable-next-line max-statements
	test("Should add family member with + button", async () => {
		let info = Array(1).fill(null);
		const wrapper = render(
			<FamilyForm
				onChange={(data: FamilyMember[]): void => {
					info = data;
					return;
				}}
				family={info}
				editable={true}
			/>,
			{ wrapper: BrowserRouter }
		);

		const saveButton = wrapper.container.querySelector(saveButtonRef);
		expect(saveButton).not.toEqual(null);

		// plus button only available when editting and only one member
		const plusButton = wrapper.container.querySelector(addMemberRef);
		expect(plusButton).not.toEqual(null);
		if (plusButton === null) return;

		const ciField = wrapper.container.querySelector(ciRef);
		if (ciField === null) return;
		await act(async () => {
			fireEvent.change(ciField, { target: "1.123.123-1" });
			fireEvent.click(plusButton);
		});

		const save = wrapper.container.querySelector(saveButtonRef);
		expect(save).not.toEqual(null);
		if (save === null) return;

		const ciField2 = wrapper.container.querySelector(ciRef);
		if (ciField2 === null) return;

		await act(async () => {
			fireEvent.change(ciField2, { target: "4.456.456-7" });
			fireEvent.click(save);
		});
		expect(ciField2?.textContent).toEqual("4.456.456-7");
		expect(info.length).toEqual(2);
	});

	test("Should change family member button to full name value", async () => {
		const wrapper = render(
			<FamilyForm
				onChange={(): void => {
					return;
				}}
				family={Array(1).fill(null)}
				editable={true}
			/>,
			{ wrapper: BrowserRouter }
		);

		const member1 = wrapper.container.querySelector(member1Ref);
		expect(member1).not.toEqual(null);
		if (member1 === null) return;
		expect(member1?.textContent).toEqual("Familiar 1");
		const fullNameField = wrapper.container.querySelector(fullNameRef);
		if (fullNameField === null) return;

		await act(async () => {
			fireEvent.change(fullNameField, { target: "Name LastName" });
		});
		expect(member1?.textContent).toEqual("Name LastName");
	});
});
