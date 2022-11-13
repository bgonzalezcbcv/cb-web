import { UserRole } from "./interfaces";

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
	neighborhood: string;
	education_level: string;
	occupation: string;
	workplace: string;
	workplace_address: string;
	workplace_neighbourhood: string;
	workplace_phone: string;
}

export enum ScholarshipType {
	bidding = "Licitación",
	subsidized = "Bonificada",
	agreement = "Convenio",
	special = "Especial",
}

export interface TypeScholarship {
	id: number;
	description: string;
	scholarship: string;
}

export interface StudentTypeScholarship {
	id: number;
	date: string;
	student_id: number;
	type_scholarship_id: number;
	description: string;
	scholarship: string;
}

export interface PaymentMethodOption {
	id: number;
	method: string;
}

export interface PaymentMethod {
	id: number;
	year: string;
	method: string;
	payment_method_id: PaymentMethodOption["id"];
	annual_payment_url: string;
}

export interface PaymentMethodWithFile extends PaymentMethod {
	annual_payment: File;
}

export enum DiscountType {
	Direction = "direction",
	SocialAssistant = "social_assistance",
}

export enum DiscountTypeName {
	direction = "Dirección",
	social_assistance = "Asistente social",
}

export enum DiscountExplanation {
	Sibling = "sibling",
	Resolution = "resolution",
}

export enum DiscountExplanationName {
	resolution = "Resolución",
	sibling = "Hermano",
}

export interface Discount {
	id: number | null;
	percentage: number;
	start_date: string;
	end_date: string;
	resolution_description: string;
	explanation: DiscountExplanation;
	administrative_type: DiscountType;
	resolution_url: string;
	administrative_info_url: string;
}

export interface DiscountWithFiles extends Discount {
	resolution?: File;
	administrative_info?: File;
}

export interface Comment {
	id: number;
	text: string;
}

export interface AdministrativeInfo {
	inscription_date: string;
	starting_date: string;
	enrollment_commitment_url: string;
	enrollment_commitment?: File;
	agreement_type: string;
}

export interface Student {
	id: string;
	ci: string;
	name: string;
	surname: string;
	schedule_start: string;
	schedule_end: string;
	tuition: string;
	reference_number: string;
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
	administrative_info: AdministrativeInfo;
	group?: StudentGroup;
}

export interface InactiveStudentInfo extends Student {
	last_motive_inactivate: InactiveMotive;
}

export interface InactiveMotive {
	id: string;
	motive: string;
	last_day: string;
	description: string;
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

export interface User {
	id: number;
	email: string;
	name: string;
	role: UserRole;
	surname: string;
	token: string;
}

export enum DocumentType {
	Evaluation = "evaluation",
	Project = "project",
}

export enum DocumentTypeLabel {
	evaluation = "Evaluación",
	project = "Proyecto",
}

export interface Document {
	document_type: DocumentType;
	certificate_url: string;
	upload_date: string;
}

export interface DocumentWithFile extends Document {
	certificate?: File;
}

export interface ComplementaryInfo {
	id: number;
	description: string;
	date: string;
	attachment_url: string;
}

export interface ComplementaryInfoWithFile {
	attachment?: File;
}

export interface Absences {
	id: number;
	start_date: string;
	end_date: string;
	reason: string;
	certificate_url: string;
}

export interface AbsencesWithFile extends Absences {
	certificate?: File;
}

export interface UserInfo extends User {
	id: number;
	address?: string;
	birthdate?: string;
	starting_date?: string;
	ci?: string;
	password?: string;
	phone?: string;
	complementary_informations?: ComplementaryInfo[];
	absences?: Absences[];
	documents?: Document[];
	groups?: Group[];
}

export enum ReportApprovalState {
	NA = "na",
	Pending = "pending",
	Approved = "approved",
	Failed = "failed",
}

export interface ReportCard {
	id: number;
	group: string;
	starting_month: Date;
	ending_month: Date;
	year: string;
	type: string;
	passed: ReportApprovalState;
	report_url: string;
}

export interface FinalReportCardRequest {
	group_id: string;
	student_id: string;
	status?: string;
	report_card: File;
}

export interface IntermediateReportCardRequest {
	group_id: string;
	starting_month: string;
	ending_month: string;
	report_card: File;
}

export interface FinalReportCardResponse {
	group_id: string;
	status: string;
	report_card_url: string;
}

export interface IntermediateReportCardResponse {
	group_id: string;
	starting_month: string;
	ending_month: string;
	report_card_url: string;
}

export interface FinalEvaluation {
	id: number;
	student_id: string;
	status: string;
	report_card_url: string;
	year: string;
	group: {
		id: number;
		name: string;
		year: string;
		grade_name: string;
	};
}

export interface IntermediateEvaluation {
	id: number;
	student_id: string;
	starting_month: string;
	ending_month: string;
	report_card_url: string;
	group: {
		id: number;
		name: string;
		year: number;
		grade_name: string;
	};
}

export interface Cycle {
	id: string;
	name: string;
}

export interface Grade {
	id: string;
	name: string;
}

export interface Group {
	id: string;
	name: string;
	year: string;
	grade: Grade;
}

export interface StudentGroup {
	id: string;
	name: string;
	year: string;
	grade_name: string;
}

export enum EventTypeName {
	event = "Evento",
}

export enum EventType {
	Event = "event",
}

export interface RelevantEvent {
	id: number;
	title: string;
	description: string;
	event_type: EventType;
	date: string;
	author: User;
	attachment_url: string;
}

export interface RelevantEventWithFile extends RelevantEvent {
	attachment?: File;
}
