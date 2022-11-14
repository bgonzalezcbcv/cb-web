import React from "react";
import * as ReactRouter from "react-router";
import { render } from "@testing-library/react";

import * as ApiStore from "../../core/ApiStore";
import { StudentPageMode } from "../../core/interfaces";
import { mockRestrictionsComponent } from "../../core/TestHelper";
import Student from "./Student";
import { defaultStudent } from "./DefaultStudent";

describe("Student", () => {
	beforeEach(() => {
		jest.spyOn(ApiStore, "fetchStudent").mockResolvedValue({
			success: true,
			data: defaultStudent,
			error: "",
		});
		jest.spyOn(ApiStore, "fetchDiscounts").mockResolvedValue({
			success: true,
			data: [],
			error: "",
		});
		jest.spyOn(ApiStore, "fetchPaymentMethod").mockResolvedValue({
			success: true,
			data: undefined,
			error: "",
		});
		jest.spyOn(ApiStore, "fetchPaymentMethodList").mockResolvedValue({
			success: true,
			data: undefined,
			error: "",
		});
		jest.spyOn(ApiStore, "fetchRelevantEvents").mockResolvedValue({
			success: true,
			data: [],
			error: "",
		});
		jest.spyOn(ReactRouter, "useNavigate").mockImplementation(() => jest.fn);
		mockRestrictionsComponent();
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
