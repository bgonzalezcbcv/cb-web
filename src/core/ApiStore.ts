import axios, { Axios } from "axios";

import { Student, User as UserModel } from "./Models";
import { User, UserRole } from "./interfaces";

import { DataStore } from "./DataStore";
import { autorun } from "mobx";

const dataStore = DataStore.getInstance();

let baseConfig = {
	headers: {
		Authorization: `Bearer ${dataStore.loggedUser?.token}`,
		"Content-Type": "application/json",
	},
	baseURL: process.env["REACT_APP_API_URL"],
};

autorun(() => {
	baseConfig = {
		headers: {
			Authorization: `Bearer ${dataStore.loggedUser?.token}`,
			"Content-Type": "application/json",
		},
		baseURL: process.env["REACT_APP_API_URL"],
	};
});

// todo: use this instance in order to do a middleware.
//eslint-disable-next-line
const axiosInstance = new Axios(baseConfig);

// todo: create middleware in order to log out on 403.

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
//todo: make the logout.

export async function login(email: string, password: string): Promise<{ success: boolean; data?: User; err: string }> {
	try {
		const errObject = {
			success: false,
			err: "Error durante el inicio de sesión, volver a intentarlo.",
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

		return { success: true, data: { email, token, name, surname, role: UserRole.Administrativo }, err: "" };
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
		return { success: false, err };
	}
}

// todo: will need the admin info and complementary info.
export async function fetchStudent(id: string): Promise<{ success: boolean; data?: Student; err: string }> {
	try {
		const config = {
			...baseConfig,
			method: "get",
			url: `/api/students/${id}`,
		};

		const response = await axios(config);

		if (![200, 304].includes(response.status) || response.data.student === undefined)
			return {
				success: false,
				err: "Unabled to fetch student",
			};

		return {
			success: true,
			data: response.data.student as Student,
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

export async function createStudent(studentToCreate: Student): Promise<boolean> {
	try {
		const config = {
			...baseConfig,
			method: "post",
			url: "/api/students/",
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

export async function createUser(userToCreate: UserModel): Promise<boolean> {
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

		return response.status === 201;
	} catch (e) {
		return false;
	}
}
