import _ from "lodash";
import axios from "axios";
import { AxiosError } from "axios";
import { reaction } from "mobx";

import {
	CicleQuestions,
	Grade,
	Group,
	FamilyMember,
	FinalEvaluation,
	FinalReportCardRequest,
	InactiveStudentInfo,
	IntermediateEvaluation,
	IntermediateReportCardRequest,
	Discount,
	DiscountWithFiles,
	PaymentMethodOption,
	PaymentMethod,
	ReportApprovalState,
	ReportCard,
	Student,
	User,
	UserInfo,
	Question,
	Cicle,
	Answer,
	PaymentMethodWithFile,
	TypeScholarship,
	StudentTypeScholarship,
	Comment,
	Document,
	ComplementaryInfoWithFile,
	AbsencesWithFile,
	RelevantEvent,
	RelevantEventWithFile,
} from "./Models";
import { DefaultApiResponse, UserRole } from "./interfaces";
import { DataStore } from "./DataStore";
import { getFormDataFromObject, reverseDate, mergeQuestionsAndAnswers, setFinalReports, setIntermediateReports, getCicleFromGroup } from "./CoreHelper";

const dataStore = DataStore.getInstance();

let baseConfig = {
	headers: {
		Authorization: `Bearer ${dataStore.loggedUser?.token}`,
		"access-control-allow-origin": "*",
		"Content-Type": "application/json",
	},
	baseURL: process.env["REACT_APP_API_URL"] + ":3000",
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

export async function fetchDiscounts(studentId: number): Promise<DefaultApiResponse<Discount[]>> {
	try {
		const config = {
			...baseConfig,
			method: "get",
			url: `/api/students/${studentId}/discounts`,
		};

		const response = await axios(config);

		return defaultResponse(response.data.student.discounts);
		//eslint-disable-next-line
	} catch (error: any) {
		return defaultErrorResponse(error.message);
	}
}

export async function fetchPaymentMethodList(): Promise<DefaultApiResponse<PaymentMethodOption[]>> {
	try {
		const config = {
			...baseConfig,
			method: "get",
			url: `/api/payment_methods/`,
		};

		const response = await axios(config);

		return defaultResponse(response.data.payment_methods);
		//eslint-disable-next-line
	} catch (error: any) {
		return defaultErrorResponse(error.message);
	}
}

export async function fetchPaymentMethod(studentId: number | string): Promise<DefaultApiResponse<PaymentMethod[]>> {
	try {
		const config = {
			...baseConfig,
			method: "get",
			url: `/api/students/${studentId}/payment_methods/`,
		};

		const response = await axios(config);

		return defaultResponse(response.data.student.payment_methods);
		//eslint-disable-next-line
	} catch (error: any) {
		return defaultErrorResponse(error.message);
	}
}

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

export async function fetchCicles(): Promise<{ success: boolean; cicle_questions: CicleQuestions[] }> {
	try {
		const config = {
			...baseConfig,
			method: "get",
			url: "/api/cicles",
		};

		const response = await axios(config);

		const result = {
			success: [200, 304].includes(response.status),
			cicle_questions: response.data.cicles,
		};

		return result;
	} catch (e) {
		return { success: false, cicle_questions: [] };
	}
}

export async function fetchStudentAnswers(studentId: number): Promise<{ success: boolean; answers: Answer[] }> {
	try {
		const config = {
			...baseConfig,
			method: "get",
			url: `api/students/${studentId}/answers`,
		};

		const response = await axios(config);

		const result = {
			success: true,
			answers: response.data.student.answers,
		};

		return result;
	} catch (e) {
		return { success: false, answers: [] };
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

		const { success: fetchQuestionsSuccess, cicle_questions } = await fetchCicles();
		if (!fetchQuestionsSuccess) return defaultErrorResponse("No se pudo obtener el estudiante.");

		const { success: fetchAnswerSuccess, answers } = await fetchStudentAnswers(Number(id));
		if (!fetchAnswerSuccess) return defaultErrorResponse("No se pudo obtener el estudiante.");

		const merged_cicle_questions = mergeQuestionsAndAnswers(cicle_questions, answers);

		const group = response.data.student.group;
		let cicle = Cicle.None;
		if (group != null) {
			cicle = getCicleFromGroup(group);
		}

		const student: Student = {
			...response.data.student,
			id: response.data.student.id.toString(),
			family: _.uniqWith(familyMembers, _.isEqual),
			cicle: cicle,
			cicle_questions: _.uniqWith(merged_cicle_questions, _.isEqual),
			administrative_info: {
				inscription_date: reverseDate(response.data.student.inscription_date),
				starting_date: reverseDate(response.data.student.starting_date),
				scholarship_type: response.data.student.scholarship_type,
				enrollment_commitment_url: response.data.student.enrollment_commitment_url,
				comments: response.data.student.comments, //todo: And these?
				agreement_type: response.data.student.agreement_type, //todo: And these?
			},
			birthdate: reverseDate(response.data.student.birthdate),
			vaccine_expiration: reverseDate(response.data.student.vaccine_expiration),
		};
		student.family.forEach((element: FamilyMember) => {
			const date = reverseDate(element.birthdate);
			element.birthdate = date === null ? "" : date === undefined ? "" : date;
		});
		return defaultResponse(student);
		//eslint-disable-next-line
	} catch (error: any) {
		return defaultErrorResponse(error.message);
	}
}

export async function fetchStudents(id?: string, groupId?: string): Promise<DefaultApiResponse<Student[]>> {
	try {
		const config = {
			...baseConfig,
			method: "get",
			url: id !== undefined ? `api/me/students` : groupId !== undefined ? `/api/groups/${groupId}/students` : `/api/students/`,
		};

		const response = await axios(config);

		return defaultResponse(response.data.students);
		//eslint-disable-next-line
	} catch (error: any) {
		return defaultErrorResponse("No se pudieron listar los alumnos.");
	}
}

export async function fetchActiveStudents(): Promise<DefaultApiResponse<Student[]>> {
	try {
		const config = {
			...baseConfig,
			method: "get",
			url: `/api/students/active`,
		};

		const response = await axios(config);

		return defaultResponse(response.data.students);
		//eslint-disable-next-line
	} catch (error: any) {
		return defaultErrorResponse("No se pudieron listar los alumnos activos.");
	}
}

export async function fetchPendingStudents(): Promise<DefaultApiResponse<Student[]>> {
	try {
		const config = {
			...baseConfig,
			method: "get",
			url: `/api/students/pending/`,
		};

		const response = await axios(config);

		return defaultResponse(response.data.students);
		//eslint-disable-next-line
	} catch (error: any) {
		return defaultErrorResponse("No se pudieron listar los alumnos.");
	}
}

export async function fetchInactiveStudents(): Promise<DefaultApiResponse<InactiveStudentInfo[]>> {
	try {
		const config = {
			...baseConfig,
			method: "get",
			url: `/api/students/inactive`,
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

export async function sendAnswersEnrollmentQuestions(studentId: string, answer: Question): Promise<{ success: boolean; err: string }> {
	let method = "";
	let url = `api/students/${studentId}/answers`;
	answer.httpRequest === "PATCH" ? (method = "patch") : (method = "post");

	if (method === "patch") url += `/${answer.answerId}`;

	try {
		const config = {
			...baseConfig,
			method: method,
			url: url,
			data: JSON.stringify({
				answer: {
					answer: answer.answer,
					question_id: answer.id,
				},
			}),
		};

		await axios(config);

		return { success: true, err: "" };
	} catch (e) {
		return { success: false, err: "Error al enviar preguntas." };
	}
}

export async function createStudent(studentToCreate: Student): Promise<DefaultApiResponse<Student>> {
	try {
		const config = {
			...baseConfig,
			method: "post",
			url: "/api/students/",
			data: JSON.stringify({ ...studentToCreate, group_id: studentToCreate.group?.id }),
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

		const enrollmentQuestions = studentToCreate.cicle_questions.filter((c) => c.name === Cicle.None)[0];
		enrollmentQuestions.questions.forEach(async (question) => {
			const { success, err: errorEQ } = await sendAnswersEnrollmentQuestions(id, question);

			if (!success) error = error + "\n" + errorEQ;
		});

		return defaultResponse(response.data.student as Student, error);
	} catch (e) {
		return defaultErrorResponse("El alumno no ha podido ser creado.");
	}
}

export async function editStudent(studentToEdit: Student): Promise<DefaultApiResponse<Student>> {
	try {
		const formDataFromStudent = getFormDataFromObject({
			...studentToEdit,
			...studentToEdit.administrative_info,
			group_id: studentToEdit.group?.id,
		});

		const config = {
			...baseConfig,
			method: "patch",
			url: `/api/students/${studentToEdit.id}`,
			headers: {
				...baseConfig.headers,
				"Content-Type": "multipart/form-data",
			},
			data: formDataFromStudent,
		};

		const { id, family } = studentToEdit;

		const response = await axios(config);

		let error = "";
		for (const familyMember of family) {
			const { success, error: errorFM } = await createFamilyMember(Number(id), familyMember);

			if (!success) error = error + "\n" + errorFM;
		}

		const enrollmentQuestions = studentToEdit.cicle_questions.filter((c) => c.name === studentToEdit.cicle)[0];
		enrollmentQuestions.questions.forEach(async (question) => {
			const { success, err: errorEQ } = await sendAnswersEnrollmentQuestions(id, question);

			if (!success) error = error + "\n" + errorEQ;
		});

		return defaultResponse(response.data.student as Student);
	} catch (e) {
		return defaultErrorResponse("El alumno no ha podido ser editado.");
	}
}

export async function deactivateStudent(student: Student, motive: string, lastDay: string, description: string): Promise<DefaultApiResponse<Student>> {
	try {
		const config = {
			...baseConfig,
			method: "post",
			url: `api/students/${student.id}/deactivate`,
			data: JSON.stringify({
				motive: motive,
				last_day: lastDay,
				description: description,
			}),
		};

		const response = await axios(config);

		return defaultResponse(response.data.student);
	} catch (e) {
		return defaultErrorResponse("No se ha podido dar de baja el alumno.");
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

export async function updateUser(userToEdit: UserInfo): Promise<DefaultApiResponse<undefined>> {
	try {
		const strippedUser: Partial<UserInfo> = { ...userToEdit };

		delete strippedUser.role;
		delete strippedUser.absences;
		delete strippedUser.complementary_informations;
		delete strippedUser.documents;

		const config = {
			...baseConfig,
			method: "patch",
			url: `/api/users/${userToEdit.id}`,
			data: JSON.stringify({
				user: strippedUser,
			}),
		};

		await axios(config);

		return defaultResponse(undefined);
	} catch (e) {
		return defaultErrorResponse("No se ha podido crear el usuario.");
	}
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function fetchUser(id: string): Promise<DefaultApiResponse<UserInfo>> {
	try {
		const config = {
			...baseConfig,
			method: "get",
			url: `/api/users/${id}`,
		};

		const response = await axios(config);

		const user: UserInfo = response.data.user;

		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		return defaultResponse({
			...user,
			birthdate: user.birthdate ? reverseDate(user.birthdate) : null,
			starting_date: user.starting_date ? reverseDate(user.starting_date) : null,
		});

		//eslint-disable-next-line
	} catch (error: any) {
		return defaultErrorResponse(error.message);
	}
}

export async function fetchUsers(): Promise<DefaultApiResponse<UserInfo[]>> {
	try {
		const config = {
			...baseConfig,
			method: "get",
			url: `/api/users`,
		};

		const response = await axios(config);

		return defaultResponse(response.data.users);
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

export async function deleteReport(studentId: string, reportId: number, isFinal: boolean): Promise<{ success: boolean }> {
	let url = "";

	if (isFinal) {
		url = `/api/students/${studentId}/final_evaluations/${reportId}`;
	} else {
		url = `/api/students/${studentId}/intermediate_evaluations/${reportId}`;
	}

	try {
		const config = {
			...baseConfig,
			method: "delete",
			url: url,
		};

		await axios(config);

		return {
			success: true,
		};
	} catch (e) {
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
			url: `/api/students/${studentId}/final_evaluations`,
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
			url: `/api/students/${studentId}/intermediate_evaluations`,
			data: formData,
		};

		const response = await axios(config);
		return defaultResponse(response.data.intermediate_evaluation);
	} catch (e) {
		return defaultErrorResponse("No se ha podido crear el boletín.");
	}
}

export async function fetchTeachers(id?: number): Promise<DefaultApiResponse<UserInfo[]>> {
	try {
		const config = {
			...baseConfig,
			method: "get",
			url: id ? "api/me/teachers/" : "/api/teachers/",
		};

		const response = await axios(config);

		return defaultResponse(response.data.teachers);
	} catch (e) {
		return defaultErrorResponse("No se pudieron obtener los docentes.");
	}
}

export async function fetchPrincipals(): Promise<DefaultApiResponse<UserInfo[]>> {
	try {
		const config = {
			...baseConfig,
			method: "get",
			url: "/api/principals/",
		};

		const response = await axios(config);

		return defaultResponse(response.data.principals);
	} catch (e) {
		return defaultErrorResponse("No se pudieron obtener los directores.");
	}
}

export async function fetchSupportTeachers(): Promise<DefaultApiResponse<UserInfo[]>> {
	try {
		const config = {
			...baseConfig,
			method: "get",
			url: "/api/support_teachers/",
		};

		const response = await axios(config);

		return defaultResponse(response.data.support_teachers);
	} catch (e) {
		return defaultErrorResponse("No se pudieron obtener los adscriptos.");
	}
}

export async function fetchGroups(id?: string): Promise<DefaultApiResponse<Group[]>> {
	try {
		const config = {
			...baseConfig,
			method: "get",
			url: id ? `/api/me/groups/` : `/api/groups/`,
		};

		const response = await axios(config);

		return {
			success: true,
			data: response.data.groups,
			error: "",
		};

		//eslint-disable-next-line
	} catch (error: any) {
		return {
			success: false,
			error: error.message,
		};
	}
}

export async function createGroup(groupToCreate: { gradeId: string; groupName: string; groupYear: string }): Promise<boolean> {
	try {
		const config = {
			...baseConfig,
			method: "post",
			url: `/api/grades/${groupToCreate.gradeId}/groups`,
			data: JSON.stringify({
				group: {
					name: groupToCreate.groupName,
					year: groupToCreate.groupYear,
				},
			}),
		};

		const response = await axios(config);

		return response.status === 201;
	} catch (e) {
		return false;
	}
}

export async function fetchGrades(): Promise<{ success: boolean; data?: Grade[]; err: string }> {
	try {
		const config = {
			...baseConfig,
			method: "get",
			url: `/api/grades`,
		};

		const response = await axios(config);

		if (![200, 304].includes(response.status) || response.data.grades === undefined)
			return {
				success: false,
				err: "Unable to fetch grades",
			};

		return {
			success: true,
			data: response.data.grades as Grade[],
			err: "",
		};

		//eslint-disable-next-line
	} catch (error: any) {
		return {
			success: false,
			err: error.message,
		};
	}
}

export async function createDiscount(studentId: number, newDiscount: DiscountWithFiles): Promise<DefaultApiResponse<undefined>> {
	try {
		const config = {
			...baseConfig,
			method: "post",
			url: `/api/students/${studentId}/discounts`,
			headers: {
				...baseConfig.headers,
				"Content-Type": "multipart/form-data",
			},
			data: getFormDataFromObject(newDiscount),
		};

		await axios(config);

		return defaultResponse(undefined);
	} catch (error: unknown) {
		return defaultErrorResponse((error as AxiosError).message ?? "");
	}
}

export async function deleteDiscount(studentId: number, discountId: number): Promise<DefaultApiResponse<undefined>> {
	try {
		const config = {
			...baseConfig,
			method: "delete",
			url: `/api/students/${studentId}/discounts/${discountId}`,
			headers: {
				...baseConfig.headers,
				"Content-Type": "multipart/form-data",
			},
		};

		await axios(config);

		return defaultResponse(undefined);
	} catch (error: unknown) {
		return defaultErrorResponse((error as AxiosError).message ?? "");
	}
}

export async function createPaymentMethod(studentId: number, paymentMethod: PaymentMethodWithFile): Promise<DefaultApiResponse<undefined>> {
	try {
		const preprocPaymentMethod = {
			...paymentMethod,
			student_id: studentId,
		};

		const config = {
			...baseConfig,
			method: "post",
			url: `/api/student_payment_methods`,
			headers: {
				...baseConfig.headers,
				"Content-Type": "multipart/form-data",
			},
			data: getFormDataFromObject(preprocPaymentMethod),
		};

		await axios(config);

		return defaultResponse(undefined);
	} catch (error: unknown) {
		return defaultErrorResponse((error as AxiosError).message ?? "");
	}
}

export async function fetchTypeScholarships(): Promise<DefaultApiResponse<TypeScholarship[]>> {
	try {
		const config = {
			...baseConfig,
			method: "get",
			url: "/api/type_scholarships",
		};

		const response = await axios(config);

		return defaultResponse(response.data.type_scholarships);
	} catch (e) {
		return defaultErrorResponse("No se pudieron obtener los docentes.");
	}
}

export async function createTypeScholarship(newScholarship: TypeScholarship): Promise<DefaultApiResponse<undefined>> {
	try {
		const config = {
			...baseConfig,
			method: "post",
			url: `/api/type_scholarships`,
			data: JSON.stringify(newScholarship),
		};

		await axios(config);

		return defaultResponse(undefined);
	} catch (e) {
		return defaultErrorResponse("No se pudo crear el convenio.");
	}
}

export async function deleteTypeScholarship(idToDelete: number): Promise<DefaultApiResponse<undefined>> {
	try {
		const config = {
			...baseConfig,
			method: "delete",
			url: `/api/type_scholarships/${idToDelete}`,
		};

		await axios(config);

		return defaultResponse(undefined);
	} catch (e) {
		return defaultErrorResponse("No se pudo crear el convenio.");
	}
}

export async function fetchStudentTypeScholarships(id: number): Promise<DefaultApiResponse<StudentTypeScholarship[]>> {
	try {
		const config = {
			...baseConfig,
			method: "get",
			url: `/api/students/${id}/type_scholarships`,
		};

		const response = await axios(config);

		return defaultResponse(response.data.student.student_type_scholarships);
	} catch (e) {
		return defaultErrorResponse("No se pudieron obtener los docentes.");
	}
}

export async function createStudentTypeScholarship(studentTypeScholarship: StudentTypeScholarship): Promise<DefaultApiResponse<undefined>> {
	try {
		const config = {
			...baseConfig,
			method: "post",
			url: `/api/student_type_scholarships`,
			data: studentTypeScholarship,
		};

		await axios(config);

		return defaultResponse(undefined);
	} catch (error: unknown) {
		return defaultErrorResponse((error as AxiosError).message ?? "");
	}
}

export async function fetchComments(studentId: number): Promise<DefaultApiResponse<Comment[]>> {
	try {
		const config = {
			...baseConfig,
			method: "get",
			url: `/api/students/${studentId}/comments`,
		};

		const response = await axios(config);

		return defaultResponse(response.data.student.comments);
	} catch (e) {
		return defaultErrorResponse("No se pudieron obtener los docentes.");
	}
}

export async function createComment(studentId: number, text: string): Promise<DefaultApiResponse<Comment[]>> {
	try {
		const config = {
			...baseConfig,
			method: "post",
			url: `/api/students/${studentId}/comments`,
			data: JSON.stringify({
				comment: {
					text,
				},
			}),
		};

		await axios(config);

		return defaultResponse([]);
	} catch (e) {
		return defaultErrorResponse("No se pudo crear el comentario.");
	}
}
export async function addUserToGroup(user_id: string, group_id: string, role: UserRole): Promise<boolean> {
	try {
		const config = {
			...baseConfig,
			method: "post",
			url: `/api/user_groups`,
			data: JSON.stringify({
				user_group: {
					user_id: user_id,
					group_id: group_id,
					role: role,
				},
			}),
		};

		const response = await axios(config);

		return response.status === 201;
	} catch (e) {
		return false;
	}
}

export async function removeUserFromGroup(user_id: string, group_id: string, role: UserRole): Promise<boolean> {
	try {
		const config = {
			...baseConfig,
			method: "delete",
			url: `/api/user_groups`,
			data: JSON.stringify({
				user_group: {
					user_id: user_id,
					group_id: group_id,
					role: role,
				},
			}),
		};

		const response = await axios(config);

		return response.status === 201;
	} catch (e) {
		return false;
	}
}

export async function createDocument(userId: number, newDocument: Document): Promise<DefaultApiResponse<undefined>> {
	try {
		const config = {
			...baseConfig,
			method: "post",
			url: `/api/users/${userId}/documents`,
			headers: {
				...baseConfig.headers,
				"Content-Type": "multipart/form-data",
			},
			data: getFormDataFromObject(newDocument),
		};

		await axios(config);

		return defaultResponse(undefined);
	} catch (e) {
		return defaultErrorResponse("No se pudo crear el documento.");
	}
}

export async function deleteDocument(userId: number, documentId: number): Promise<DefaultApiResponse<undefined>> {
	try {
		const config = {
			...baseConfig,
			method: "delete",
			url: `/api/users/${userId}/documents/${documentId}`,
		};

		await axios(config);

		return defaultResponse(undefined);
	} catch (e) {
		return defaultErrorResponse("No se pudo eliminar el documento.");
	}
}

export async function createComplementaryInformation(userId: number, newCompInfo: ComplementaryInfoWithFile): Promise<DefaultApiResponse<undefined>> {
	try {
		const config = {
			...baseConfig,
			method: "post",
			url: `/api/users/${userId}/complementary_informations`,
			headers: {
				...baseConfig.headers,
				"Content-Type": "multipart/form-data",
			},
			data: getFormDataFromObject(newCompInfo),
		};

		await axios(config);

		return defaultResponse(undefined);
	} catch (e) {
		return defaultErrorResponse("No se pudo crear el documento.");
	}
}

export async function deleteComplementaryInformation(userId: number, complementaryInformationId: number): Promise<DefaultApiResponse<undefined>> {
	try {
		const config = {
			...baseConfig,
			method: "delete",
			url: `/api/users/${userId}/complementary_informations/${complementaryInformationId}`,
		};

		await axios(config);

		return defaultResponse(undefined);
	} catch (e) {
		return defaultErrorResponse("No se pudo eliminar la información complementaria.");
	}
}

export async function createAbsences(userId: number, newAbscence: AbsencesWithFile): Promise<DefaultApiResponse<undefined>> {
	try {
		const config = {
			...baseConfig,
			method: "post",
			url: `/api/users/${userId}/absences`,
			headers: {
				...baseConfig.headers,
				"Content-Type": "multipart/form-data",
			},
			data: getFormDataFromObject(newAbscence),
		};

		await axios(config);

		return defaultResponse(undefined);
	} catch (e) {
		return defaultErrorResponse("No se pudo crear la inasistencia.");
	}
}

export async function deleteAbsences(userId: number, absenceId: number): Promise<DefaultApiResponse<undefined>> {
	try {
		const config = {
			...baseConfig,
			method: "delete",
			url: `/api/users/${userId}/absences/${absenceId}`,
		};

		await axios(config);

		return defaultResponse(undefined);
	} catch (e) {
		return defaultErrorResponse("No se pudo eliminar la inasistencia.");
	}
}
export async function createRelevantEvent(studentId: number, newRelevantEvent: RelevantEventWithFile): Promise<DefaultApiResponse<undefined>> {
	try {
		const config = {
			...baseConfig,
			method: "post",
			url: `/api/students/${studentId}/relevant_events`,
			headers: {
				...baseConfig.headers,
				"Content-Type": "multipart/form-data",
			},
			data: getFormDataFromObject(newRelevantEvent),
		};

		await axios(config);

		return defaultResponse(undefined);
	} catch (error: unknown) {
		return defaultErrorResponse((error as AxiosError).message ?? "");
	}
}

export async function fetchRelevantEvents(studentId: number): Promise<DefaultApiResponse<RelevantEvent[]>> {
	try {
		const config = {
			...baseConfig,
			method: "get",
			url: `/api/students/${studentId}/relevant_events`,
		};

		const response = await axios(config);

		return defaultResponse(response.data.student.relevant_events);
	} catch (e) {
		return defaultErrorResponse("No se pudieron obtener los eventos relevantes.");
	}
}

export async function deleteRelevantEvent(studentId: number, id: number): Promise<DefaultApiResponse<undefined>> {
	try {
		const config = {
			...baseConfig,
			method: "delete",
			url: `/api/students/${studentId}/relevant_events/${id}`,
		};

		await axios(config);

		return defaultResponse(undefined);
	} catch (e) {
		return defaultErrorResponse("No se pudo borrar el evento.");
	}
}

export async function userChangePassword(oldPassword: string, newPassword: string, confirmPassword: string): Promise<{ success: boolean }> {
	try {
		const config = {
			...baseConfig,
			method: "patch",
			url: `/api/me/password`,
			data: JSON.stringify({
				user: {
					current_password: oldPassword,
					password: newPassword,
					password_confirmation: confirmPassword,
				},
			}),
		};

		await axios(config);

		return { success: true };
	} catch (e) {
		return defaultErrorResponse("No se pudo cambiar la contraseña.");
	}
}

export async function adminChangePassword(userId: number, newPassword: string): Promise<{ success: boolean }> {
	try {
		const config = {
			...baseConfig,
			method: "patch",
			url: `api/users/${userId}`,
			data: JSON.stringify({
				user: {
					password: newPassword,
				},
			}),
		};

		await axios(config);

		return { success: true };
	} catch (e) {
		return { success: false };
	}
}

export async function activateStudent(id: string, referenceNumber: string, tuition: string): Promise<DefaultApiResponse<Student>> {
	try {
		const config = {
			...baseConfig,
			method: "post",
			url: `/api/students/${id}/activate`,
			data: JSON.stringify({ student: { reference_number: referenceNumber, tuition: tuition } }),
		};

		const response = await axios(config);

		return defaultResponse(response.data.students);
	} catch (e) {
		return defaultErrorResponse("Algo salió mal al activar el alumno");
	}
}
