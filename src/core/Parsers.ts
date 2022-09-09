import { StudentCreationForm, StudentToCreate } from "./Models";

export function parseFormToStudent(form: StudentCreationForm): StudentToCreate | null {
	try {
		return {
			id: undefined,
			address: form["Dirección:"],
			birthdate: new Date(form["Fecha de nacimiento:"]),
			birthplace: form["Lugar de nacimiento:"],
			ci: form["Cédula de Identidad:"],
			email: form.Email,
			emergency: form["Emergencia médica:"],
			first_language: form["Lengua materna:"],
			first_name: form["Nombres:"],
			medical_assurance: form["Cobertura médica:"],
			middle_name: undefined,
			nationality: form["Nacionalidad:"],
			neighborhood: form["Barrio:"],
			office: undefined, // que es office?
			phone_number: form["Teléfono:"],
			reference_number: undefined,
			scheduler_end: undefined,
			scheduler_start: undefined,
			second_surname: undefined,
			state: undefined,
			surname: form["Apellidos:"],
			tuition: undefined,
		};
	} catch (error) {
		return null;
	}
}
