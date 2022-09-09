import {
	DiscountExplanation,
	DiscountType,
	PaymentMethodOption,
	ScholarshipType,
	Student
} from "../../core/Models";

const defaultStudent: Student = {
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
			neighbourhood: "",
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
			category: "",
			questions: [
				{
					id: "a",
					question: "",
					answer: "",
				},
			],
		},
	],
	administrative_info: {
		enrollment_date: new Date("1/2/2022"),
		starting_date: new Date("1/3/2022"),
		registration_commitment_url: "",
		scholarship_type: ScholarshipType.Subsidized,
		agreement_type: "Ninguno",
		comments: "",
		payment_methods: [
			{
				year: 2022,
				method: PaymentMethodOption.Cash,
				yearly_payment_url: ""
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