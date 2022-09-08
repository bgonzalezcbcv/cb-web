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

export enum UserRole {
	Administrador = "Administrador",
	Administrativo = "Administrativo",
	Adscripto = "Adscripto",
	Director = "Director",
	Docente = "Docente",
	Recepcion = "Recepción",
}

export interface User {
	email: string;
	token: string;
	displayName: string;
	role: UserRole;
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
