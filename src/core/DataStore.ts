import _ from "lodash";
import { makeAutoObservable, action, reaction } from "mobx";

import { User, Teacher, UserRole } from "./interfaces";

export class DataStore {
	private static instance: DataStore;

	public loggedUser: User | null = null;

	public teachers: Teacher[] = [];

	private constructor() {
		const savedStateJson = localStorage.getItem("store");

		if (savedStateJson) {
			try {
				const savedState = JSON.parse(savedStateJson);

				const clonedState = _.cloneDeep(this);

				Object.keys(this).forEach((attribute) => (clonedState[attribute as keyof DataStore] = savedState[attribute]));

				Object.keys(this).forEach(
					(attribute) =>
						// eslint-disable-next-line
						// @ts-ignore
						(this[attribute as keyof DataStore] = clonedState[attribute])
				);
			} catch (err) {
				console.error(err);
			}
		}

		makeAutoObservable(this);
	}

	public static getInstance(): DataStore {
		if (!DataStore.instance) DataStore.instance = new DataStore();

		return this.instance;
	}

	// todo: need to implement this function.
	@action
	public logIn(): boolean {
		this.loggedUser = {
			email: "testingEmail@xmail.test",
			token: "notAToken",
			displayName: "Juan Prueba",
			role: UserRole.Administrativo,
		};

		return true;
	}

	@action
	public logOut(): void {
		this.loggedUser = null;
	}

	@action
	public addTeacher(teacher: Teacher): void {
		this.teachers = [...this.teachers, teacher];
	}

	@action
	public deleteTeacherByCi(ci: string): void {
		this.teachers = this.teachers.filter((teacher) => teacher.ci !== ci);
	}
}

reaction(
	() => JSON.stringify(DataStore.getInstance()),
	(json) => {
		localStorage.setItem("store", json);
	},
	{
		delay: 500,
	}
);
