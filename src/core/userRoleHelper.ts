import { UserRole, SidebarSection, UserRoleColor } from "./interfaces";
import { User } from "./Models";

export function getColorByUserRole(userRole?: UserRole): string {
	if (!userRole) return "black";

	return UserRoleColor[userRole];
}

export function getSidebarSectionsByUser(user: User | null): SidebarSection[] {
	const { Administrador, Administrativo, Docente, Director, Recepcion, Adscripto } = UserRole;

	if (!user) return [];

	const { id, role } = user;

	switch (role) {
		case Administrador:
			return [
				{
					sectionTitle: "Usuarios",
					items: [
						{
							title: "Ver todos",
							navigationRoute: "/users",
						},
						{
							title: "Crear",
							navigationRoute: "/createuser",
						},
					],
				},
				{
					sectionTitle: "Grupos",
					items: [
						{
							title: "Ver todos",
							navigationRoute: "/groups",
						},
						{
							title: "Crear grupo",
							navigationRoute: "/group",
						},
					],
				},
				{
					sectionTitle: "Convenios",
					items: [
						{
							title: "Ver todos",
							navigationRoute: "/groups",
						},
					],
				},
			];
		case Administrativo:
			return [
				{
					sectionTitle: "Alumnos",
					items: [
						{
							title: "Activos",
							navigationRoute: `/students/active`,
						},
						{
							title: "Pendientes",
							navigationRoute: `/students/pending`,
						},
						{
							title: "Inactivos",
							navigationRoute: `/students/inactive`,
						},
						{
							title: "Ver todos",
							navigationRoute: `/students`,
						},
						{
							title: "Dar de alta",
							navigationRoute: "/student",
						},
					],
				},
				{
					sectionTitle: "Grupos",
					items: [
						{
							title: "Ver todos",
							navigationRoute: `/groups`,
						},
					],
				},
				{
					sectionTitle: "Docentes",
					items: [
						{
							title: "Ver todos",
							navigationRoute: `/teachers`,
						},
					],
				},
			];
		case Adscripto:
			return [
				{
					sectionTitle: "Alumnos",
					items: [
						{
							title: "Mis alumnos",
							navigationRoute: `/students/${id}`,
						},
						{
							title: "Pendientes",
							navigationRoute: `/students/${id}/pending`,
						},
					],
				},
				{
					sectionTitle: "Grupos",
					items: [
						{
							title: "Ver mis grupos",
							navigationRoute: `/groups/${id}`,
						},
					],
				},
				{
					sectionTitle: "Docentes",
					items: [
						{
							title: "Ver mis docentes",
							navigationRoute: `/teachers/${id}`,
						},
					],
				},
			];
		case Director:
			return [
				{
					sectionTitle: "Alumnos",
					items: [
						{
							title: "Ver mis alumnos",
							navigationRoute: `/students/${id}`,
						},
						{
							title: "Pendientes",
							navigationRoute: `/students/${id}/pending`,
						},
					],
				},
				{
					sectionTitle: "Grupos",
					items: [
						{
							title: "Ver mis grupos",
							navigationRoute: `/groups/${id}`,
						},
					],
				},
				{
					sectionTitle: "Docentes",
					items: [
						{
							title: "Ver mis docentes",
							navigationRoute: `/teachers/${id}`,
						},
					],
				},
			];
		case Docente:
			return [
				{
					sectionTitle: "Alumnos",
					items: [
						{
							title: "Ver mis alumnos",
							navigationRoute: `/students/${id}`,
						},
					],
				},
				{
					sectionTitle: "Grupos",
					items: [
						{
							title: "Ver mis grupos",
							navigationRoute: `/groups/${id}`,
						},
					],
				},
			];
		case Recepcion:
			return [
				{
					sectionTitle: "Alumnos",
					items: [
						{
							title: "Activos",
							navigationRoute: `/students/active`,
						},
						{
							title: "Pendientes",
							navigationRoute: `/students/pending`,
						},
					],
				},
				{
					sectionTitle: "Grupos",
					items: [
						{
							title: "Ver todos",
							navigationRoute: `/groups`,
						},
					],
				},
				{
					sectionTitle: "Docentes",
					items: [
						{
							title: "Ver todos",
							navigationRoute: `/teachers`,
						},
					],
				},
			];
		default:
			return [];
	}
}
