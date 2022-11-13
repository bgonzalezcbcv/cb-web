import { UserRole } from "./interfaces";
import { DocumentType, UserInfo, Grade } from "./Models";

export const mockUser: UserInfo = {
	id: 1,
	role: UserRole.Administrador,
	email: "test@test.com",
	name: "Testing",
	surname: "Tester",
	address: "Avenida Siempre viva 123",
	birthdate: "01-01-1999",
	ci: "11113334",
	phone: "22223333",
	token: "",
	complementary_informations: [{ id: 1, description: "Profesorado de Ingles", date: "01-01-1999", attachment_url: "" }],
	absences: [
		{
			id: 1,
			start_date: "01-01-2022",
			end_date: "05-01-2022",
			reason: "Covid",
			certificate_url: "",
		},
	],
	documents: [
		{
			document_type: DocumentType.Evaluation,
			certificate_url: "",
			upload_date: "01-05-2022",
		},
	],
};

export const teachersMock = new Array<UserInfo>(10) //
	.fill(mockUser)
	.map(
		(user, id): UserInfo => ({
			...user,
			id: id,
			groups: [
				{ id: "1", grade: { id: "1", name: "3ro" } as Grade, name: "A", year: "2022" },
				{ id: "2", grade: { id: "2", name: "4to" } as Grade, name: "B", year: "2022" },
			],
		})
	);
