import axios, { AxiosRequestConfig } from "axios";

import { Student } from "./Models";

const axiosConfigs: AxiosRequestConfig<unknown> = {
	baseURL: process.env["REACT_APP_API_URL"],
	headers: {
		"Access-Control-Allow-Origin": "*",
	},
};

const axiosInstance = axios.create(axiosConfigs);

export async function createStudent(studentToCreate: Student): Promise<boolean> {
	try {
		await axiosInstance.post("/api/students", { student: studentToCreate });

		return true;
	} catch (e) {
		return false;
	}
}
