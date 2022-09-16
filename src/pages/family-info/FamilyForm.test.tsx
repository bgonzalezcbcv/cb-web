import React from "react";
import { BrowserRouter } from "react-router-dom";
import { act, fireEvent, render } from "@testing-library/react";
import { Student } from "../../core/Models";

import FamilyForm from "./FamilyForm";

function EmptyStudentWithFamily(familyCount: number): Student {
	return { family: Array(familyCount).fill(null) } as Student;
}

describe("EditFamilyForm", () => {
	const saveButtonRef = "#saveButton";
	const addMemberRef = "#addFamilyMember";
	const ciRef = "#ci2-input";
	const fullNameRef = "#fullName2-input";
	const member1Ref = "#family0";
	const member2Ref = "#family1";
	const birthDateRef = "#birthDate2-input";

	test("Should not be able to edit when editable=false", async () => {
		const wrapper = render(
			<FamilyForm
				onChange={(): void => {
					return;
				}}
				student={EmptyStudentWithFamily(1)}
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
			fireEvent.change(ciField, { target: "11231231" });
		});

		expect(ciField?.textContent).toEqual("");
	});

	test("Edit and save family members when editable=true", async () => {
		let info = EmptyStudentWithFamily(2);
		const wrapper = render(
			<FamilyForm
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

		const plusButton = wrapper.container.querySelector(addMemberRef);
		expect(plusButton).toEqual(null);

		const ciField = wrapper.container.querySelector(ciRef);
		const member2 = wrapper.container.querySelector(member2Ref);
		if (member2 === null || ciField === null) return;
		await act(async () => {
			fireEvent.change(ciField, { target: "11231231" });
			fireEvent.click(member2);
		});
		expect(ciField?.textContent).toEqual("11231231");

		const ciField2 = wrapper.container.querySelector(ciRef);
		const save = wrapper.container.querySelector(saveButtonRef);
		if (save === null || ciField2 === null) return;
		await act(async () => {
			fireEvent.change(ciField2, { target: "4454567" });
			fireEvent.click(save);
		});
		expect(ciField2?.textContent).toEqual("4454567");

		expect(info.family[0].ci).toEqual("11231231");
		expect(info.family[1].ci).toEqual("4454567");
	});

	test("Shouldn't save with errors in form", async () => {
		let info = EmptyStudentWithFamily(1);
		const wrapper = render(
			<FamilyForm
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

		// plus button only available when editting and only one member
		const plusButton = wrapper.container.querySelector(addMemberRef);
		expect(plusButton).not.toEqual(null);

		const save = wrapper.container.querySelector(saveButtonRef);
		expect(save).not.toEqual(null);
		if (save === null) return;
		await act(async () => {
			fireEvent.click(save);
		});
		expect(info.family[0]).toEqual(null);
		const ciField = wrapper.container.querySelector(ciRef);
		if (ciField === null) return;
		await act(async () => {
			fireEvent.change(ciField, { target: "123aa" });
			fireEvent.click(save);
		});
		expect(info.family[0]).toEqual(null);
	});

	// eslint-disable-next-line max-statements
	test("Should add family member with + button", async () => {
		let info = EmptyStudentWithFamily(1);
		const wrapper = render(
			<FamilyForm
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

		// plus button only available when editting and only one member
		const plusButton = wrapper.container.querySelector(addMemberRef);
		expect(plusButton).not.toEqual(null);

		const ciField = wrapper.container.querySelector(ciRef);
		if (ciField === null || plusButton === null) return;
		await act(async () => {
			fireEvent.change(ciField, { target: "11231231" });
			fireEvent.click(plusButton);
		});

		const save = wrapper.container.querySelector(saveButtonRef);
		expect(save).not.toEqual(null);
		const ciField2 = wrapper.container.querySelector(ciRef);
		const member2 = wrapper.container.querySelector(member2Ref);
		expect(member2).not.toEqual(null);
		if (ciField2 === null || save === null || member2 === null) return;
		expect(member2.ariaPressed).toEqual("true");

		await act(async () => {
			fireEvent.change(ciField2, { target: "4454567" });
			fireEvent.click(save);
		});
		expect(ciField2?.textContent).toEqual("4454567");
		expect(info.family.length).toEqual(2);
	});

	test("Should change family member button to full name value", async () => {
		const wrapper = render(
			<FamilyForm
				onChange={(): void => {
					return;
				}}
				student={EmptyStudentWithFamily(1)}
				editable={true}
			/>,
			{ wrapper: BrowserRouter }
		);

		const member1 = wrapper.container.querySelector(member1Ref);
		expect(member1).not.toEqual(null);
		expect(member1?.textContent).toEqual("Familiar 1");
		const fullNameField = wrapper.container.querySelector(fullNameRef);
		if (fullNameField === null || member1 === null) return;

		await act(async () => {
			fireEvent.change(fullNameField, { target: "Name LastName" });
		});
		expect(member1?.textContent).toEqual("Name LastName");
	});

	test("Should save birthday correctly", async () => {
		let info = EmptyStudentWithFamily(1);
		const wrapper = render(
			<FamilyForm
				onChange={(data: Student): void => {
					info = data;
					return;
				}}
				student={EmptyStudentWithFamily(1)}
				editable={true}
			/>,
			{ wrapper: BrowserRouter }
		);

		const ciField = wrapper.container.querySelector(ciRef);
		const birthdateField = wrapper.container.querySelector(birthDateRef);
		const save = wrapper.container.querySelector(saveButtonRef);
		expect(save).not.toEqual(null);
		if (save === null || ciField === null || birthdateField === null) return;
		await act(async () => {
			fireEvent.change(ciField, { target: "11231231" });
			fireEvent.change(birthdateField, { target: "01/01/1999" });
			fireEvent.click(save);
		});

		expect(ciField?.textContent).toEqual("11231231");
		expect(birthdateField?.textContent).toEqual("01/01/1999");
		expect(info.family[0].birthdate).toEqual(new Date(1999, 1, 1));
	});
});
