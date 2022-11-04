import { UserRole } from "./interfaces";
import { DocumentType, UserInfo } from "./Models";

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
	complementary_info: {
		beginning_date: "01-03-1999",
		academic_training: [{ title: "Profesorado de Ingles", date: "01-01-1999", attachment: "" }],
	},
	absences: [
		{
			starting_date: "01-01-2022",
			ending_date: "05-01-2022",
			reason: "Covid",
			attachment: "",
		},
	],
	documents: [
		{
			type: DocumentType.Evaluation,
			attachment: "",
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
				{ id: "1", name: "3A", year: "2022" },
				{ id: "2", name: "4B", year: "2022" },
			],
		})
	);
