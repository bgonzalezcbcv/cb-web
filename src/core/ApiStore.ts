import _ from "lodash";
import axios from "axios";
import { reaction } from "mobx";

import {
	DocumentType,
	FamilyMember,
	FinalEvaluation,
	FinalReportCardRequest,
	IntermediateEvaluation,
	IntermediateReportCardRequest,
	ReportApprovalState,
	ReportCard,
	Student,
	User,
	UserInfo,
} from "./Models";
import { DefaultApiResponse, UserRole } from "./interfaces";

import { DataStore } from "./DataStore";
import { teachersMock } from "./ApiMocks";
import { setFinalReports, setIntermediateReports } from "./CoreHelper";

const dataStore = DataStore.getInstance();

let baseConfig = {
	headers: {
		Authorization: `Bearer ${dataStore.loggedUser?.token}`,
		"access-control-allow-origin": "*",
		"Content-Type": "application/json",
	},
	baseURL: process.env["REACT_APP_API_URL"],
};

reaction(
	() => dataStore.loggedUser?.token,
	(token) => {
		baseConfig = _.merge(baseConfig, {
			headers: { Authorization: `Bearer ${token}` },
		});
	}
);

axios.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response.state === 403 && error.response.config.baseURL === baseConfig.baseURL) dataStore.logOut();

		return Promise.reject(error);
	}
);

function defaultResponse<DataType>(data: DataType, error = ""): DefaultApiResponse<DataType> {
	return {
		success: true,
		data,
		error,
	};
}

function defaultErrorResponse<DataType>(error: string): DefaultApiResponse<DataType> {
	return {
		success: false,
		error: error,
	};
}

export async function login(email: string, password: string): Promise<DefaultApiResponse<User>> {
	try {
		const errObject = {
			success: false,
			error: "Error durante el inicio de sesión, volver a intentarlo.",
		};

		const config = {
			...baseConfig,
			method: "post",
			url: "/api/sign_in/",
			headers: {
				"Content-Type": "application/json",
			},
			data: JSON.stringify({
				email,
				password,
			}),
		};

		const response = await axios(config);

		if (!(response.data && response.headers)) return errObject;

		const { id, name, surname, role } = response.data.user;

		const [bearer, token] = (response.headers["authorization"] ?? "").split(" ");

		if (bearer !== "Bearer") return errObject;

		return defaultResponse({ id, email, token, name, surname, role });
		// eslint-disable-next-line
	} catch (error: any) {
		switch (error?.response?.status as number | undefined) {
			case 401:
				return defaultErrorResponse("Usuario o contraseña inválidos");
			default:
				return defaultErrorResponse("El servidor no responde");
		}
	}
}

// todo: will need the admin info and complementary info.
export async function fetchFamilyMembers(studentId: number): Promise<DefaultApiResponse<FamilyMember[]>> {
	try {
		const config = {
			...baseConfig,
			method: "get",
			url: `/api/students/${studentId}/family_members`,
		};

		const response = await axios(config);

		return defaultResponse(response.data.student.family_members);
		//eslint-disable-next-line
	} catch (error: any) {
		return defaultErrorResponse(error.message);
	}
}

export async function fetchStudent(id: string): Promise<DefaultApiResponse<Student>> {
	try {
		const config = {
			...baseConfig,
			method: "get",
			url: `/api/students/${id}`,
		};

		const response = await axios(config);

		const { success: fetchFamilySuccess, data: familyMembers } = await fetchFamilyMembers(Number(id));

		if (!fetchFamilySuccess) return defaultErrorResponse("No se pudo obtener el estudiante.");

		const student = {
			...response.data.student,
			id: response.data.student.id.toString(),
			family: _.uniqWith(familyMembers, _.isEqual),
		};

		return defaultResponse(student);
		//eslint-disable-next-line
	} catch (error: any) {
		return defaultErrorResponse(error.message);
	}
}

export async function fetchStudents(): Promise<DefaultApiResponse<Student[]>> {
	try {
		const config = {
			...baseConfig,
			method: "get",
			url: `/api/students/`,
		};

		const response = await axios(config);

		return defaultResponse(response.data.students);
		//eslint-disable-next-line
	} catch (error: any) {
		return defaultErrorResponse("No se pudieron listar los alumnos.");
	}
}

export async function createFamilyMember(studentId: number, family_member: FamilyMember): Promise<DefaultApiResponse<FamilyMember>> {
	try {
		const config = {
			...baseConfig,
			method: "post",
			url: `/api/students/${studentId}/family_members`,
			data: JSON.stringify({
				family_member,
			}),
		};

		const response = await axios(config);

		return defaultResponse(response.data);
	} catch (e) {
		return defaultErrorResponse(`Familiar con ci ${family_member.ci} no pudo ser creado.`);
	}
}

export async function createStudent(studentToCreate: Student): Promise<DefaultApiResponse<Student>> {
	try {
		const config = {
			...baseConfig,
			method: "post",
			url: "/api/students/",
			data: JSON.stringify(studentToCreate),
		};
		const { family: unfilteredFamily } = studentToCreate;
		const familyCIs: string[] = [];

		const family = unfilteredFamily.filter((member) => {
			if (!familyCIs.includes(member.ci)) return familyCIs.push(member.ci);
			else return false;
		});

		const response = await axios(config);

		const { id } = response.data.student;

		let error = "";
		for (const familyMember of family) {
			const { success, error: errorFM } = await createFamilyMember(Number(id), familyMember);

			//todo: ver de marcar estos errors de alguna forma.
			if (!success) error = error + "\n" + errorFM;
		}

		return defaultResponse(response.data.student as Student, error);
	} catch (e) {
		return defaultErrorResponse("El alumno no ha podido ser creado.");
	}
}

export async function editStudent(studentToEdit: Student): Promise<DefaultApiResponse<Student>> {
	try {
		const config = {
			...baseConfig,
			method: "patch",
			url: `/api/students/${studentToEdit.id}`,
			data: JSON.stringify({
				student: studentToEdit,
			}),
		};

		const { id, family } = studentToEdit;

		const response = await axios(config);

		let error = "";
		for (const familyMember of family) {
			const { success, error: errorFM } = await createFamilyMember(Number(id), familyMember);

			if (!success) error = error + "\n" + errorFM;
		}

		return defaultResponse(response.data.student as Student);
	} catch (e) {
		return defaultErrorResponse("El alumno no ha podido ser editado.");
	}
}

export async function createUser(userToCreate: UserInfo): Promise<DefaultApiResponse<User>> {
	try {
		const config = {
			...baseConfig,
			method: "post",
			url: "/api/users",
			data: JSON.stringify({
				user: userToCreate,
			}),
		};

		const response = await axios(config);

		return defaultResponse(response.data.user);
	} catch (e) {
		return defaultErrorResponse("No se ha podido crear el usuario.");
	}
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function fetchUser(id: string): Promise<DefaultApiResponse<UserInfo>> {
	try {
		const fetchUserMockResponse: UserInfo = {
			id: 1,
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
			groups: [],
			password: "",
		};

		return defaultResponse(fetchUserMockResponse);
		//
		// const config = {
		// 	...baseConfig,
		// 	method: "get",
		// 	url: `/api/users/${id}`,
		// };
		//
		// const response = await axios(config);
		//
		// if (![200, 304].includes(response.status) || response.data.user === undefined)
		// 	return {
		// 		success: false,
		// 		err: "Unabled to fetch user",
		// 	};
		//
		// return {
		// 	success: true,
		// 	data: response.data.user as UserInfo,
		// 	err: "",
		// };

		//eslint-disable-next-line
	} catch (error: any) {
		return defaultErrorResponse(error.message);
	}
}

export async function fetchReports(studentId: string): Promise<{ success: boolean; data?: ReportCard[]; err: string }> {
	try {
		const config = {
			...baseConfig,
			method: "get",
			url: `/api/students/${studentId}/evaluations`,
		};

		const response = await axios(config);

		const data = response.data;
		const final_evaluations: FinalEvaluation[] = data.student.final_evaluations;
		const intermediate_evaluations: IntermediateEvaluation[] = data.student.intermediate_evaluations;

		const finalReports = setFinalReports(final_evaluations);
		const intermediateReports = setIntermediateReports(intermediate_evaluations);
		const reports = finalReports.concat(intermediateReports);

		return {
			success: true,
			data: reports,
			err: "",
		};

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		return {
			success: false,
			err: error?.message,
		};
	}
}

export async function deleteReport(studentId: string, reportId: number): Promise<{ success: boolean }> {
	try {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const config = {
			...baseConfig,
			method: "delete",
			url: `/api/reports/${reportId}`,
		};

		// const response = await axios(config);

		// const response = {
		// 	status: 200,
		// };

		return {
			success: true,
		};

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		return {
			success: false,
		};
	}
}

export async function setReportApprovalState(studentId: string, reportId: number, approvalState: ReportApprovalState): Promise<{ success: boolean }> {
	try {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const config = {
			...baseConfig,
			method: "put",
			url: `/api/reports/${studentId}`,
			parameters: {
				approvalState: approvalState,
			},
		};

		// const response = await axios(config);

		// const response = {
		// 	status: 200,
		// };

		return {
			success: true,
		};
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		return {
			success: false,
		};
	}
}
export async function createFinalReportCard(finalReport: FinalReportCardRequest, studentId: string): Promise<DefaultApiResponse<FinalEvaluation>> {
	try {
		const formData = new FormData();

		formData.set("report_card", finalReport.report_card);
		formData.set("group_id", finalReport.group_id);
		formData.set("student_id", finalReport.student_id);
		formData.set("status", "pending");

		const config = {
			..._.set(baseConfig, "headers.Content-Type", "multipart/form-data"),
			method: "post",
			url: `/api/students/${studentId}/final_evaluation`,
			data: finalReport,
		};

		const response = await axios(config);
		return defaultResponse(response.data.final_evaluation);
	} catch (e) {
		return defaultErrorResponse("No se ha podido crear el boletín.");
	}
}

export async function createIntermediateReportCard(
	finalReport: IntermediateReportCardRequest,
	studentId: string
): Promise<DefaultApiResponse<IntermediateEvaluation>> {
	try {
		const formData = new FormData();

		formData.set("ending_month", finalReport.ending_month);
		formData.set("starting_month", finalReport.starting_month);
		formData.set("report_card", finalReport.report_card);
		formData.set("group_id", finalReport.group_id);

		const config = {
			..._.set(baseConfig, "headers.Content-Type", "multipart/form-data"),
			method: "post",
			url: `/api/students/${studentId}/intermediate_evaluation`,
			data: formData,
		};

		const response = await axios(config);
		return defaultResponse(response.data.intermediate_evaluation);
	} catch (e) {
		return defaultErrorResponse("No se ha podido crear el boletín.");
	}
}

export async function fetchTeachers(id?: number, mock = false): Promise<DefaultApiResponse<UserInfo[]>> {
	try {
		if (mock) return defaultResponse(teachersMock);

		const config = {
			...baseConfig,
			method: "get",
			url: id ? `/api/teachers/${id}` : "/api/teachers/",
		};

		const response = await axios(config);

		return defaultResponse(response.data.students);
	} catch (e) {
		return defaultErrorResponse("No se pudieron obtener los docentes.");
	}
}
