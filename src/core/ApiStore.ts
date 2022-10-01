import axios from "axios";

import { Student } from "./Models";
import { User, UserRole } from "./interfaces";

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

// export async function login(user: string, pass: string): Promise <{success:boolean, data?:User, err:string}>{
// 	try{
// 		const config = {
// 			...baseConfig,
// 			method: "post",
// 			url: "/api/login/",
// 			headers: {
// 				"Content-Type": "application/json",
// 			},
// 			data: JSON.stringify({
// 				user,
// 				pass
// 			}),
// 		};
// 		const response = await axios(config);

// 		const email = response?.data?.email;
// 		const token = response?.data?.token;
// 		const displayName = response?.data?.displayName;
// 		const role = response?.data?.role;

// 		return {success:true, data:{email, token, displayName, role}, err:""}
// 	} catch (error:any){
// 		let err = "";
// 		if (!error?.response){
// 			err = "El servidor no responde";
// 		} else if (error.response?.status === 400) {
// 			err = "Usuario o contraseña inválidos";
// 		} else if (error.response?.status === 401) {
// 			err = "No autorizado";
// 		} else {
// 			err = "Falló el inicio"
// 		}
// 		return {success: false, err}
// 	}
// }

// eslint-disable-next-line
export async function login(user: string, pass: string): Promise<{ success: boolean; data?: User; err: string }> {
	return { success: true, data: { email: "pepe@gmail.com", name: "Pepe Bolsilludo", role: UserRole.Administrador, token: "Bolsilludo" }, err: "" };
}
