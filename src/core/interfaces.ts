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
	Administrador = "Administrador",
	Administrativo = "Administrativo",
	Adscripto = "Adscripto",
	Director = "Director",
	Docente = "Docente",
	Recepcion = "Recepción",
}

export enum UserRoleColor {
	Administrador = "red",
	Administrativo = "blue",
	Adscripto = "cyan",
	Director = "green",
	Docente = "yellow",
	Recepcion = "black",
}

export enum UserRole {
	Administrador,
	Administrativo,
	Adscripto,
	Director,
	Docente,
	Recepcion,
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

export interface Question {
	id: string;
	question: string;
	answer: string;
}

export interface QuestionCategories {
	category: string;
	questions: Question[];
}

export interface Student {
	question_categories: QuestionCategories[];
}
