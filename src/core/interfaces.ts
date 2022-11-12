import { NavigateOptions } from "react-router-dom";

export interface VisualComponent {
	width?: string;
	height?: string;
}

export interface Teacher {
	ci: string;
	firstName: string;
	lastName: string;
	subjects: string[];
}

export enum UserRoleName {
	administrator = "Administrador",
	administrative = "Administrativo",
	support_teacher = "Adscripto",
	principal = "Director",
	teacher = "Docente",
	reception = "Recepción",
}

export enum UserRoleColor {
	administrator = "rgb(71,148,40)",
	administrative = "rgb(93, 150, 222)",
	support_teacher = "rgb(148,40,131)",
	principal = "rgb(150,146,55)",
	teacher = "rgb(144,85,59)",
	reception = "rgb(144,59,92)",
}

export enum UserRole {
	Administrador = "administrator",
	Administrativo = "administrative",
	Adscripto = "support_teacher",
	Director = "principal",
	Docente = "teacher",
	Recepcion = "reception",
}

export interface SidebarItem {
	title: string;
	navigationRoute: string;
	navigationParams?: NavigateOptions;
}

export interface SidebarSection {
	sectionTitle: string;
	items: SidebarItem[];
}

export enum StudentPageMode {
	create = "CREATE",
	edit = "EDIT",
	view = "VIEW",
}

export interface ProfileCardItem {
	label: string;
	value: string | React.ReactNode;
}

export interface DefaultApiResponse<DataType> {
	success: boolean;
	data?: DataType | undefined;
	error: string;
}

export enum FetchState {
	initial = "initial",
	loading = "loading",
	failure = "failure",
}
