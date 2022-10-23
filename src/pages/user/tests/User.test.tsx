import React from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { render } from "@testing-library/react";

import * as API from "../../../core/ApiStore";
import { UserRole } from "../../../core/interfaces";
import { DocumentType, UserInfo } from "../../../core/Models";
import User from "../User";

const studentMock: UserInfo = {
	role: UserRole.Administrador,
	email: "test@test.com",
	name: "Testing",
	surname: "Tester",
	address: "Avenida Siempre viva 123",
	birthdate: "01-01-1999",
	ci: "11113334",
	phone: "22223333",
	token: "",
	complementary_info: {
		beginning_date: "01-03-1999",
		academic_training: [{ title: "Profesorado de Ingles", date: "01-01-1999", attachment: "" }],
	},
	absences: [
		{
			starting_date: "01-01-2022",
			ending_date: "05-01-2022",
			reason: "Covid",
			attachment: "",
		},
	],
	documents: [
		{
			type: DocumentType.Evaluation,
			attachment: "",
			upload_date: "01-05-2022",
		},
	],
};

describe("User", () => {
	it("should render the profile with an editable user", async () => {
		jest.spyOn(API, "fetchUser").mockResolvedValue({
			success: true,
			data: studentMock,
			error: "",
		});

		const wrapper = render(
			<MemoryRouter initialEntries={["/user/1"]}>
				<Routes>
					<Route path="/user/:id" element={<User editable={true} />} />
				</Routes>
			</MemoryRouter>
		);

		expect(await wrapper.findByText(`${studentMock.name} ${studentMock.surname}`)).toBeVisible();
		expect(wrapper).toMatchSnapshot();
	});

	it("should render the profile with a non editable user", async () => {
		jest.spyOn(API, "fetchUser").mockResolvedValue({
			success: true,
			data: studentMock,
			error: "",
		});

		const wrapper = render(
			<MemoryRouter initialEntries={["/user/1"]}>
				<Routes>
					<Route path="/user/:id" element={<User editable={false} />} />
				</Routes>
			</MemoryRouter>
		);

		expect(await wrapper.findByText(`${studentMock.name} ${studentMock.surname}`)).toBeVisible();
		expect(wrapper).toMatchSnapshot();
	});

	it("should render an alert on fail", async () => {
		jest.spyOn(API, "fetchUser").mockResolvedValue({
			success: false,
			data: studentMock,
			error: "",
		});

		const wrapper = render(
			<MemoryRouter initialEntries={["/user/1"]}>
				<Routes>
					<Route path="/user/:id" element={<User editable={false} />} />
				</Routes>
			</MemoryRouter>
		);

		expect(await wrapper.findByText(`No se pudo obtener el usuario. Haga click aquí para reintentar.`)).toBeVisible();
		expect(wrapper).toMatchSnapshot();
	});
});
