import { DiscountExplanation, DiscountType, PaymentMethodOption, ScholarshipType, Student, Cicle } from "../../core/Models";

export const defaultStudent: Student = {
	id: "asdf",
	ci: "asdf",
	name: "asdf",
	surname: "asda",
	schedule_start: "asdf",
	schedule_end: "asdf",
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
	cicle: Cicle.None,
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
			neighbourhood: "",
			education_level: "",
			occupation: "",
			workplace: "",
			workplace_address: "",
			workplace_neighbourhood: "",
			workplace_phone: "",
		},
	],
	cicle_question_categories: [
		{
			cicle: Cicle.None,
			question_categories: [
				{
					name: "Categoria",
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
};

console.log(defaultStudent);
