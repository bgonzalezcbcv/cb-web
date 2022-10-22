import _ from "lodash";
import axios from "axios";
import { reaction } from "mobx";

import { DocumentType, FamilyMember, Student, User, UserInfo } from "./Models";
import { DefaultApiResponse, UserRole } from "./interfaces";

import { DataStore } from "./DataStore";

const dataStore = DataStore.getInstance();

let baseConfig = {
	headers: {
		Authorization: `Bearer ${dataStore.loggedUser?.token}`,
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

		return Promise.reject();
	}
);

interface SignInResponseData {
	id: number;
	email: string;
	ci: string;
	name: string;
	surname: string;
	birthdate: string;
	address: string;
	role?: UserRole;
}

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

		const { name, surname }: SignInResponseData = response.data;

		const [bearer, token] = (response.headers["authorization"] ?? "").split(" ");

		if (bearer !== "Bearer") return errObject;

		return defaultResponse({ email, token, name, surname, role: UserRole.Administrativo });
		// eslint-disable-next-line
	} catch (error: any) {
		let err = "";
		if (!error?.response) {
			err = "El servidor no responde";
		} else if (error.response?.status === 400) {
			err = "Usuario o contraseña inválidos";
		} else if (error.response?.status === 401) {
			err = "No autorizado";
		} else {
			err = "Falló el inicio";
		}
		return defaultErrorResponse(err);
	}
}

// todo: will need the admin info and complementary info.
export async function fetchStudent(id: string): Promise<DefaultApiResponse<Student>> {
	try {
		const config = {
			...baseConfig,
			method: "get",
			url: `/api/students/${id}`,
		};

		const response = await axios(config);

		return defaultResponse(response.data.student);
		//eslint-disable-next-line
	} catch (error: any) {
		return defaultResponse(error.message);
	}
}

export async function fetchStudents(): Promise<{ success: boolean; data?: [Student]; err: string }> {
	try {
		const config = {
			...baseConfig,
			method: "get",
			url: `/api/students/`,
		};

		const response = await axios(config);

		if (![200, 304].includes(response.status) || response.data.students === undefined)
			return {
				success: false,
				err: "Unabled to fetch students",
			};

		return {
			success: true,
			data: response.data.students as [Student],
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
			data: JSON.stringify({
				student: studentToCreate,
			}),
		};

		const { id, family } = studentToCreate;

		const response = await axios(config);

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
		return defaultResponse({
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
		});
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
