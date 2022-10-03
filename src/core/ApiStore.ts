import axios from "axios";

import { Cicle, CicleQuestionCategories, Question, QuestionCategories, Student } from "./Models";

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

export async function getCicles(): Promise<{ success: boolean; cicles: Cicle[] }> {
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
			cicles: response.data,
		};

		return result;
	} catch (e) {
		return { success: false, cicles: [] };
	}
}

export async function getStudentQuestions(studentId?: string): Promise<{ success: boolean; cicle_question_categories: CicleQuestionCategories[] }> {
	try {
		const config = {
			...baseConfig,
			method: "get",
			url: `api/TODO`,
			headers: {
				"Content-Type": "application/json",
			},
			params: {
				student_id: studentId ?? null,
			},
		};

		const response = await axios(config);

		const result = {
			success: response.status === 200,
			cicle_question_categories: response.data.cicle_question_categories,
		};

		return result;
	} catch (e) {
		return { success: false, cicle_question_categories: [] };
	}
}

export async function postAnswersEnrollmentQuestions(studentID: string, cicleID: number, answers: Question[]): Promise<boolean> {
	try {
		const config = {
			...baseConfig,
			method: "post",
			url: "/api/answers",
			headers: {
				"Content-Type": "application/json",
			},
			data: JSON.stringify({
				studentID: studentID,
				cicleID: cicleID,
				answers: answers,
			}),
		};

		const response = await axios(config);

		return response.status === 201;
	} catch (e) {
		return false;
	}
}
