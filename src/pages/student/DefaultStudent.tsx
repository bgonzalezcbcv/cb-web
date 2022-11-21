import { Student, Cicle } from "../../core/Models";

export const defaultStudent: Student = {
	id: "",
	ci: "",
	name: "",
	surname: "",
	schedule_start: "",
	schedule_end: "",
	tuition: "",
	reference_number: "",
	birthplace: "",
	birthdate: "",
	nationality: "",
	first_language: "",
	office: "",
	status: "",
	address: "",
	neighborhood: "",
	medical_assurance: "",
	emergency: "",
	phone_number: "",
	vaccine_expiration: "",
	inscription_date: "",
	starting_date: "",
	contact: "",
	contact_phone: "",
	email: "",
	family: [
		{
			ci: "",
			role: "",
			full_name: "",
			birthdate: "",
			birthplace: "",
			nationality: "",
			first_language: "",
			marital_status: "",
			cellphone: "",
			email: "",
			address: "",
			neighborhood: "",
			education_level: "",
			occupation: "",
			workplace: "",
			workplace_address: "",
			workplace_neighbourhood: "",
			workplace_phone: "",
		},
	],
	cicle_questions: [
		{
			id: 1,
			name: Cicle.None,
			questions: [
				{
					id: 1,
					text: "Pregunta",
					answer: "Respuesta",
					answerId: 1,
					httpRequest: "POST",
				},
				{
					id: 2,
					text: "Pregunta",
					answer: "Respuesta",
					answerId: 2,
					httpRequest: "POST",
				},
				{
					id: 3,
					text: "Pregunta",
					answer: "Respuesta",
					answerId: 3,
					httpRequest: "POST",
				},
				{
					id: 4,
					text: "Pregunta",
					answer: "Respuesta",
					answerId: 4,
					httpRequest: "POST",
				},
				{
					id: 5,
					text: "Pregunta",
					answer: "Respuesta",
					answerId: 5,
					httpRequest: "POST",
				},
				{
					id: 6,
					text: "Pregunta",
					answer: "Respuesta",
					answerId: 6,
					httpRequest: "POST",
				},
			],
		},
	],
	administrative_info: {
		inscription_date: "01/02/2022",
		starting_date: "01/03/2022",
		enrollment_commitment_url: "",
		agreement_type: "Ninguno",
	},
	cicle: Cicle.None,
};

export const defaultStudents: [Student] = [defaultStudent];

export const emptyStudent: Student = {
	address: "",
	administrative_info: {
		inscription_date: "",
		starting_date: "",
		enrollment_commitment_url: "",
		agreement_type: "",
	},
	birthdate: "",
	birthplace: "",
	ci: "",
	contact: "",
	contact_phone: "",
	email: "",
	emergency: "",
	family: [],
	first_language: "",
	id: "",
	inscription_date: "",
	medical_assurance: "",
	name: "",
	nationality: "",
	neighborhood: "",
	office: "",
	phone_number: "",
	cicle_questions: [],
	reference_number: "",
	schedule_end: "",
	schedule_start: "",
	starting_date: "",
	status: "",
	surname: "",
	tuition: "",
	vaccine_expiration: "",
	cicle: Cicle.None,
};

export const emptyStudents: [Student] = [emptyStudent];
