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
