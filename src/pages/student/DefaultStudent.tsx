import { DiscountExplanation, DiscountType, PaymentMethodOption, ScholarshipType, Student } from "../../core/Models";

export const defaultStudent: Student = {
	id: "",
	ci: "",
	name: "",
	surname: "",
	schedule_start: "",
	schedule_end: "",
	tuition: "",
	reference_number: 0,
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
	question_categories: [
		{
			category: "Categoria",
			questions: [
				{
					id: "1",
					question: "Pregunta",
					answer: "Respuesta",
				},
				{
					id: "1",
					question: "Pregunta",
					answer: "Respuesta",
				},
				{
					id: "1",
					question: "Pregunta",
					answer: "Respuesta",
				},
				{
					id: "1",
					question: "Pregunta",
					answer: "Respuesta",
				},
				{
					id: "1",
					question: "Pregunta",
					answer: "Respuesta",
				},
				{
					id: "1",
					question: "Pregunta",
					answer: "Respuesta",
				},
			],
		},
	],
	administrative_info: {
		enrollment_date: "01/02/2022",
		starting_date: "01/03/2022",
		registration_commitment_url: "",
		scholarship_type: ScholarshipType.Subsidized,
		agreement_type: "Ninguno",
		comments: "",
		payment_methods: [
			{
				year: 2022,
				method: PaymentMethodOption.Cash,
				yearly_payment_url: "",
			},
		],
		discounts: [
			{
				percentage: 10,
				starting_date: new Date("1/3/2022"),
				ending_date: new Date("10/8/2022"),
				type: DiscountType.Direction,
				resolution_url: "",
				explanation: DiscountExplanation.Sibling,
				report_url: "",
				description: "",
			},
		],
	},
	report_card: [
		{
			id: 1,
			grade: "Primero",
			starting_month: "Marzo",
			ending_month: "Abril",
			type: "Intermedio",
			passed: false,
		},
		{
			id: 2,
			grade: "Primero",
			starting_month: "2022",
			ending_month: "",
			type: "Final",
			passed: true,
		},
	],
};

export const defaultStudents: [Student] = [defaultStudent];

export const emptyStudent: Student = {
	address: "",
	administrative_info: {
		enrollment_date: "",
		starting_date: "",
		registration_commitment_url: "",
		scholarship_type: ScholarshipType.Agreement,
		agreement_type: "",
		comments: "",
		payment_methods: [],
		discounts: [],
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
	question_categories: [],
	reference_number: 0,
	schedule_end: "",
	schedule_start: "",
	starting_date: "",
	status: "",
	surname: "",
	tuition: "",
	vaccine_expiration: "",
	report_card: [],
};

export const emptyStudents: [Student] = [emptyStudent];
