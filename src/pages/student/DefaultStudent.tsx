import { Agreement, AvailablePaymentMethods, DiscountExplanation, PaymentMethodsOptions, Scholarship, Student } from "../../core/Models";

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
		registration_commitment_url: "",
		scholarship_type: Scholarship.Bonificada,
		agreement_type: Agreement.None,
		comments: "",
		payment_methods: [
			{
				method: AvailablePaymentMethods.Card,
				option: PaymentMethodsOptions.Cash,
			},
		],
		discounts: [
			{
				starting_date: "",
				ending_date: "",
				explanation: DiscountExplanation.Brother,
				percentage: 2,
				type: "",
				report_url: "",
			},
		],
	},
};

console.log(defaultStudent);
