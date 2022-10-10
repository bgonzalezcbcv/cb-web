import React from "react";
import { render } from "@testing-library/react";

import * as ApiStore from "../../core/ApiStore";
import Student from "./Student";
import { defaultStudent } from "./DefaultStudent";
import { StudentPageMode } from "../../core/interfaces";

describe("Student", () => {
	beforeEach(() => {
		jest.spyOn(ApiStore, "fetchStudent").mockResolvedValue({
			success: true,
			data: defaultStudent,
			err: "",
		});
	});

	it("should render the create page on default", () => {
		const wrapper = render(<Student />);

		expect(wrapper).toMatchSnapshot();
	});

	it("should render edit page", () => {
		const wrapper = render(<Student mode={StudentPageMode.edit} />);

		expect(wrapper).toMatchSnapshot();
	});

	it("should render view page", () => {
		const wrapper = render(<Student mode={StudentPageMode.view} />);

		expect(wrapper).toMatchSnapshot();
	});
});
