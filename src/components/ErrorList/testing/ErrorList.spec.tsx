import React from "react";
import { render } from "@testing-library/react";

import ErrorList from "../ErrorList";

import data from "./testingData.json";
import schema from "./testingDataSchema.json";

describe("ErrorList", () => {
	it("should render a correct list", () => {
		const wrapper = render(<ErrorList path="" schema={schema} value={data} />);

		expect(wrapper).toMatchSnapshot();
	});
});
