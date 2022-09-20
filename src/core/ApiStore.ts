import axios from "axios";

import { Student } from "./Models";

const baseConfig = {
	baseURL: process.env["REACT_APP_API_URL"],
};

export async function createStudent(studentToCreate: Student): Promise<boolean> {
	try {
		const config = {
			...baseConfig,
			method: "post",
			url: "/api/students/",
			headers: {
				"Content-Type": "application/json",
			},
			data: JSON.stringify({
				student: studentToCreate,
			}),
		};

		const response = await axios(config);

		return response.status === 201;
	} catch (e) {
		return false;
	}
}
