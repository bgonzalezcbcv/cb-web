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
