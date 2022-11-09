import { Teacher } from "../../core/interfaces";

export const emptyTeacher: Teacher = {
	ci: "",
	firstName: "",
	lastName: "",
	subjects: [],
};

export const emptyTeachers: [Teacher] = [emptyTeacher];
