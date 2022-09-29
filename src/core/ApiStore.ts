import axios from "axios";

import { Cycle, Student } from "./Models";

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

export async function getCycles(): Promise<{ success: boolean; cycles: Cycle[] }> {
	try {
		const config = {
			...baseConfig,
			method: "get",
			url: "api/cicles",
			headers: {
				"Content-Type": "application/json",
			},
		};

		const response = await axios(config);

		const result = {
			success: response.status === 200,
			cycles: response.data,
		};

		return result;
	} catch (e) {
		return { success: false, cycles: [] };
	}
}

// export async function setStudentCycle(): Promise<{ success: boolean, student: Student }> {

// }
