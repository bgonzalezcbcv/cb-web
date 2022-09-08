import { SidebarSection } from "../components/Sidebar/Sidebar";
import { User, UserRole } from "./interfaces";

export function userRoleToString(userRole?: UserRole): string {
	switch (userRole) {
		case UserRole.Administrador:
			return "Administrador";
		case UserRole.Administrativo:
			return "Administrativo";
		case UserRole.Adscripto:
			return "Adscripto";
		case UserRole.Director:
			return "Director";
		case UserRole.Docente:
			return "Docente";
		case UserRole.Recepcion:
			return "Recepción";
		default:
			return "error";
	}
}

export function getSidebarSectionsByUserRole(user: User | null): SidebarSection[] {
	switch (user?.role) {
		case UserRole.Administrador:
			return [
				{
					sectionTitle: "Grupos",
					items: [
						{
							title: "Crear grupo",
							navigationRoute: "/teachers",
						},
						{
							title: "Asignar director",
							navigationRoute: "/teachers",
						},
					],
				},
				{
					sectionTitle: "Usuarios",
					items: [
						{
							title: "Crear",
							navigationRoute: "/teachers",
						},
						{
							title: "Ver todos",
							navigationRoute: "/teachers",
						},
					],
				},
			];

		case UserRole.Administrativo:
			return [
				{
					sectionTitle: "Alumnos",
					items: [
						{
							title: "Activos",
							navigationRoute: "/teachers",
						},
						{
							title: "Pendientes",
							navigationRoute: "/teachers",
						},
						{
							title: "Inactivos",
							navigationRoute: "/teachers",
						},
						{
							title: "Dar de alta",
							navigationRoute: "/teachers",
						},
					],
				},
				{
					sectionTitle: "Grupos",
					items: [
						{
							title: "aa",
							navigationRoute: "/teachers",
						},
					],
				},
				{
					sectionTitle: "Docentes",
					items: [
						{
							title: "aa",
							navigationRoute: "/teachers",
						},
					],
				},
			];
		case UserRole.Adscripto:
			return [
				{
					sectionTitle: "Alumnos",
					items: [
						{
							title: "Mis alumnos",
							navigationRoute: "/teachers",
						},
						{
							title: "Pendientes",
							navigationRoute: "/teachers",
						},
					],
				},
				{
					sectionTitle: "Grupos",
					items: [
						{
							title: "aa",
							navigationRoute: "/teachers",
						},
					],
				},
				{
					sectionTitle: "Docentes",
					items: [
						{
							title: "aa",
							navigationRoute: "/teachers",
						},
					],
				},
				{
					sectionTitle: "Perfil",
					items: [
						{
							title: "aa",
							navigationRoute: "/teachers",
						},
					],
				},
			];
		case UserRole.Director:
			return [
				{
					sectionTitle: "Alumnos",
					items: [
						{
							title: "Mis alumnos",
							navigationRoute: "/teachers",
						},
						{
							title: "Pendientes",
							navigationRoute: "/teachers",
						},
					],
				},
				{
					sectionTitle: "Grupos",
					items: [
						{
							title: "aa",
							navigationRoute: "/teachers",
						},
					],
				},
				{
					sectionTitle: "Docentes",
					items: [
						{
							title: "aa",
							navigationRoute: "/teachers",
						},
					],
				},
				{
					sectionTitle: "Perfil",
					items: [
						{
							title: "aa",
							navigationRoute: "/teachers",
						},
					],
				},
			];
		case UserRole.Docente:
			return [
				{
					sectionTitle: "Alumnos",
					items: [
						{
							title: "aa",
							navigationRoute: "/teachers",
						},
					],
				},
				{
					sectionTitle: "Grupos",
					items: [],
				},
				{
					sectionTitle: "Perfil",
					items: [
						{
							title: "aa",
							navigationRoute: "/teachers",
						},
					],
				},
			];
		case UserRole.Recepcion:
			return [
				{
					sectionTitle: "Alumnos",
					items: [
						{
							title: "Activos",
							navigationRoute: "/teachers",
						},
						{
							title: "Pendientes",
							navigationRoute: "/teachers",
						},
						{
							title: "Inactivos",
							navigationRoute: "/teachers",
						},
					],
				},
				{
					sectionTitle: "Grupos",
					items: [
						{
							title: "aa",
							navigationRoute: "/teachers",
						},
					],
				},
				{
					sectionTitle: "Docentes",
					items: [
						{
							title: "aa",
							navigationRoute: "/teachers",
						},
					],
				},
			];
		default:
			return [];
	}
}
