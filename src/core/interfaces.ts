import { NavigateOptions } from "react-router-dom";
import React from "react";

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

export enum UserRoleColor {
	Administrador = "rgb(71,148,40)",
	Administrativo = "rgb(59 , 96 , 144)",
	Adscripto = "rgb(148,40,131)",
	Director = "rgb(150,146,55)",
	Docente = "rgb(144,85,59)",
	Recepción = "rgb(144,59,92)",
}

export enum UserRole {
	Administrador = "Administrador",
	Administrativo = "Administrativo",
	Adscripto = "Adscripto",
	Director = "Director",
	Docente = "Docente",
	Recepcion = "Recepción",
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

export enum CreationState {
	idle = "idle",
	inProcess = "inProcess",
	success = "success",
	fail = "fail",
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
