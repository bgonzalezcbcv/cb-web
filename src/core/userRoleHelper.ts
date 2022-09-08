import { SidebarProps } from "../components/Sidebar/Sidebar";
import { UserRole } from "./interfaces";

export function getSidebarPropsByUserRole(role?: UserRole): SidebarProps {
	switch (role) {
		case UserRole.Administrador:
			return {
				sections: [
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
				],
			};
		case UserRole.Administrativo:
			return {
				sections: [
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
				],
			};
		case UserRole.Adscripto:
			return {
				sections: [
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
				],
			};
		case UserRole.Director:
			return {
				sections: [
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
				],
			};
		case UserRole.Docente:
			return {
				sections: [
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
				],
			};
		case UserRole.Recepcion:
			return {
				sections: [
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
				],
			};
		default:
			return {
				sections: [],
			};
	}
}
