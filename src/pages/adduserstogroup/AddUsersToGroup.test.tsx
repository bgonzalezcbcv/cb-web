import React from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { render } from "@testing-library/react";

import * as API from "../../core/ApiStore";
import { teachersMock } from "../../core/ApiMocks";
import AddUsersToGroup from "./AddUsersToGroup";

describe("Teachers", () => {
	it("should render the list", async () => {
		jest.spyOn(API, "fetchTeachers").mockResolvedValue({
			success: true,
			data: teachersMock,
			error: "",
		});

		const wrapper = render(
			<MemoryRouter initialEntries={["/addUsers/teacher/1"]}>
				<Routes>
					<Route path="/addUsers/:role/:id" element={<AddUsersToGroup />} />
				</Routes>
			</MemoryRouter>
		);

		expect(await wrapper.findByText("Agregar docentes")).toBeVisible();
		expect(await wrapper.findByPlaceholderText(`Buscar...`)).toBeVisible();
		expect(wrapper).toMatchSnapshot(); //TODO que ande
	});

	it("should render an alert on fail", async () => {
		jest.spyOn(API, "fetchTeachers").mockResolvedValue({
			success: false,
			data: teachersMock,
			error: "",
		});

		const wrapper = render(
			<MemoryRouter initialEntries={["/addUsers/teacher/1"]}>
				<Routes>
					<Route path="/addUsers/:role/:id" element={<AddUsersToGroup />} />
				</Routes>
			</MemoryRouter>
		);

		expect(await wrapper.findByText(`Falló la carga de docentes. Clickear aquí para reintentar.`)).toBeVisible();
		expect(wrapper).toMatchSnapshot();
	});
});
