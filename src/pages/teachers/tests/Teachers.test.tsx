import React from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { render } from "@testing-library/react";

import * as API from "../../../core/ApiStore";
import Teachers from "../Teachers";
import { teachersMock } from "../../../core/ApiMocks";

describe("Teachers", () => {
	it("should render the profile with an editable user", async () => {
		jest.spyOn(API, "fetchTeachers").mockResolvedValue({
			success: true,
			data: teachersMock,
			error: "",
		});

		const wrapper = render(
			<MemoryRouter initialEntries={["/user/1"]}>
				<Routes>
					<Route path="/user/:id" element={<Teachers editable={true} canAdd canDelete />} />
				</Routes>
			</MemoryRouter>
		);

		expect(await wrapper.findByText(`Docentes`)).toBeVisible();
		expect(await wrapper.findByPlaceholderText(`Buscar...`)).toBeVisible();
		expect(wrapper).toMatchSnapshot();
	});

	it("should render the profile with a non editable user", async () => {
		jest.spyOn(API, "fetchTeachers").mockResolvedValue({
			success: true,
			data: teachersMock,
			error: "",
		});

		const wrapper = render(
			<MemoryRouter initialEntries={["/user/1"]}>
				<Routes>
					<Route path="/user/:id" element={<Teachers editable={false} canAdd canDelete />} />
				</Routes>
			</MemoryRouter>
		);

		expect(await wrapper.findByText(`Docentes`)).toBeVisible();
		expect(wrapper).toMatchSnapshot();
	});

	it("should render an alert on fail", async () => {
		jest.spyOn(API, "fetchTeachers").mockResolvedValue({
			success: false,
			data: teachersMock,
			error: "",
		});

		const wrapper = render(
			<MemoryRouter initialEntries={["/user/1"]}>
				<Routes>
					<Route path="/user/:id" element={<Teachers editable={false} canAdd canDelete />} />
				</Routes>
			</MemoryRouter>
		);

		expect(await wrapper.findByText(`No se pudieron obtener los docentes. Haga click aquí para reintentar.`)).toBeVisible();
		expect(wrapper).toMatchSnapshot();
	});
});
