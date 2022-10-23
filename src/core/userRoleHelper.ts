import { UserRole, SidebarSection, UserRoleColor, UserRoleName } from "./interfaces";
import { User } from "./Models";
import { DataStore } from "./DataStore";

export function getColorByUserRole(userRole?: UserRole): string {
	if (!userRole) return "black";

	return UserRoleColor[userRole];
}

export function getRoleNameByUserRole(userRole?: UserRole): string {
	if (!userRole) return "";

	return UserRoleName[userRole];
}

export function restrictEditionTo(roles: UserRole[], editable = true): boolean {
	const role = DataStore.getInstance().loggedUser?.role;

	if (!role) return false;

	return editable && roles.includes(role);
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
						{
							title: "Asignar director",
							navigationRoute: "/teachers",
						},
					],
				},
				{
					sectionTitle: "Convenios",
					items: [
						{
							title: "Ver todos",
							navigationRoute: "/scholarship",
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
				{
					sectionTitle: "Grupos",
					items: [
						{
							title: "Ver Todos",
							navigationRoute: "/groups",
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
							title: "Mis grupos",
							navigationRoute: `/groups/${id}`,
						},
					],
				},
				{
					sectionTitle: "Docentes",
					items: [
						{
							title: "Mis docentes",
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
							title: "Mis grupos",
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
							title: "Mis alumnos",
							navigationRoute: `/students/${id}`,
						},
					],
				},
				{
					sectionTitle: "Grupos",
					items: [
						{
							title: "Mis grupos",
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
							navigationRoute: "/groups",
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
