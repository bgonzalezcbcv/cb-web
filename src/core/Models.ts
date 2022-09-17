export type Question = {
	id: string;
	question: string;
	answer: string;
};

export interface QuestionCategories {
	category: string;
	questions: Question[];
}

export interface FamilyMember {
	role: string;
	full_name: string;
	birthdate: string;
	birthplace: string;
	nationality: string;
	first_language: string;
	ci: string;
	marital_status: string;
	cellphone: string;
	email: string;
	address: string;
	neighbourhood: string;
	education_level: string;
	occupation: string;
	workplace: string;
	workplace_address: string;
	workplace_neighbourhood: string;
	workplace_phone: string;
}

export enum ScholarshipType {
	Bidding = "licitación",
	Subsidized = "bonificada",
	Agreement = "convenio",
	Special = "especial",
}

export enum PaymentMethodOption {
	Cash = "contado",
	Financing = "financiacion",
	Bidding = "licitacion",
}

export enum AgreementType { //TODO: Estos son agregados por el admin del sistema
	None = "ninguno",
}

export enum DiscountType {
	Direction = "dirección",
	SocialAssistant = "asistente social",
}

export enum DiscountExplanation {
	Sibling = "hermano",
	Resolution = "resolución",
}

interface PaymentMethod {
	year: number;
	method: PaymentMethodOption;
	yearly_payment_url: string;
}

interface Discount {
	percentage: number;
	starting_date: Date;
	ending_date: Date;
	type: DiscountType;
	resolution_url: string;
	explanation: DiscountExplanation;
	report_url: string;
	description: string;
}

export interface AdministrativeInfo {
	enrollment_date: Date;
	starting_date: Date;
	registration_commitment_url: string;
	scholarship_type: ScholarshipType;
	agreement_type: AgreementType;
	comments: string;
	payment_methods: PaymentMethod[];
	discounts: Discount[];
}

export interface Student {
	id: string;
	ci: string;
	name: string;
	surname: string;
	schedule_start: string;
	schedule_end: string;
	tuition: string;
	reference_number: number;
	birthplace: string;
	birthdate: string;
	nationality: string;
	first_language: string;
	office: string;
	status: string;
	address: string;
	neighborhood: string;
	medical_assurance: string;
	emergency: string;
	phone_number: string;
	vaccine_expiration: string;
	inscription_date: string;
	starting_date: string;
	contact: string;
	contact_phone: string;
	email: string;
	family: FamilyMember[];
	question_categories: QuestionCategories[];
	administrative_info?: AdministrativeInfo;
}

export interface StudentCreationForm {
	Email: string;
	"Apellidos:": string;
	"Nombres:": string;
	"Fecha de nacimiento:": string;
	"Lugar de nacimiento:": string;
	"Nacionalidad:": string;
	"Cédula de Identidad:": string;
	"Dirección:": string;
	"Barrio:": string;
	"Teléfono:": string;
	"Lengua materna:": string;
	"Cobertura médica:": string;
	"Emergencia médica:": string;
	"Fecha de vencimiento de vacunas:": string;
	"Datos correspondientes a:": string;
	"Apellidos, nombre:": string;
	"Fecha de nacimiento:2": string;
	"País de nacimiento:": string;
	"Nacionalidad:2": string;
	"Lengua materna:2": string;
	"Cédula de identidad:2": string;
	"Estado Civil:": string;
	"Celular:": string;
	"Mail personal:": string;
	"Dirección:2": string;
	"Barrio residencia:": string;
	"Nivel educativo": string;
	"Ocupación o Profesión:": string;
	"Empresa o lugar de trabajo:": string;
	"Dirección de trabajo:": string;
	"Barrio de trabajo:": string;
	"Teléfono trabajo:": string;
	"Datos correspondientes a:2": string;
	"Apellidos, nombre:2": string;
	"Fecha de nacimiento:3": string;
	"País de nacimiento:2": string;
	"Nacionalidad:3": string;
	"Lengua materna:3": string;
	"Cédula de identidad:3": string;
	"Estado Civil:2": string;
	"Celular:2": string;
	"Mail personal:2": string;
	"Dirección:3": string;
	"Barrio residencia:2": string;
	"Nivel educativo2": string;
	"Ocupación o Profesión:2": string;
	"Empresa o lugar de trabajo:2": string;
	"Dirección de trabajo:2": string;
	"Barrio de trabajo:2": string;
	"Teléfono trabajo:2": string;
	"¿Con quién/quiénes vive el alumno/a?": string;
	"¿Tiene hermanos?": string;
	"¿Concurren a nuestra Institución?": string;
	"Ubicación del alumno/a a inscribir en el orden de los hermanos": number;
	"¿Cuántas laptops hay en la vivienda? (No incluir laptops de CEIBAL)": string;
	"¿Cuántas pc fijas hay en la vivienda?": string;
	"¿Cuántas tablets hay en la vivienda? (No incluir tablets de CEIBAL)": string;
	"¿Cuántas laptop/tablet CEIBAL hay en la vivienda?": string;
	"¿En el hogar hay acceso a internet?": string;
	"¿Tiene smartphone o celular inteligente con acceso a internet desde su hogar?": string;
	"¿Asistió a Instituciones anteriores?": string;
	"¿Desde qué edad?": string;
	"Nombre de instituciones anteriores:": string;
	Escarlatina: string;
	Sarampión: string;
	Varicela: string;
	Rubeola: string;
	Paperas: string;
	"Tos convulsa": string;
	"¿Tuvo o tiene enfermedades importantes? ¿Cuáles?": string;
	"¿Sufre enfermedades crónicas? ¿Cuáles?": string;
	"¿Toma medicamentos regularmente? ¿Cuáles?": string;
	"¿Existen consecuencias de accidentes? ¿Cuáles?": string;
	"Alergias o intolerancia a algún alimento:": string;
	"Otra información que desee aclarar:": string;
	Foniatra: string;
	Psicomotricista: string;
	Psicopedagogo: string;
	Psicólogo: string;
	Psiquiatra: string;
	Neuropediatra: string;
	"¿Desea realizar algún comentario al respecto?": string;
	"¿Cómo llegó a conocer nuestra Institución?": string;
	"¿Qué conocimientos, habilidades y/o actitudes fundamentales cree que deben desarrollarse en el proceso de aprendizaje de su hijo/a para lograr un alto desempeño en la complejidad y desafíos del mu...": string;
	"¿Porque considera importante una propuesta bilingüe en la formación de su hijo/a?": string;
	"Detalle aquí otra información que crea importante y que pueda contribuir a una atención eficiente e integral del alumno/a:": string;
}
