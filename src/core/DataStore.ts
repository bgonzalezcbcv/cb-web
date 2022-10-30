import _ from "lodash";
import { makeAutoObservable, action, reaction } from "mobx";

import { Teacher, UserRole } from "./interfaces";
import { User } from "./Models";

export class DataStore {
	private static instance: DataStore;

	public loggedUser: User | null = null;

	public teachers: Teacher[] = [];

	public agreementTypes: string[] = ["Ninguno"];

	public isDrawerOpen = false;

	private constructor() {
		const savedStateJson = sessionStorage.getItem("store");

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
	public logIn(id: number, email: string, token: string, name: string, surname: string, role: UserRole): boolean {
		this.loggedUser = {
			id,
			email,
			name,
			surname,
			token,
			role,
		};

		return true;
	}

	@action
	public logOut(): void {
		this.loggedUser = null;
		this.isDrawerOpen = false;
	}

	@action
	public addTeacher(teacher: Teacher): void {
		this.teachers = [...this.teachers, teacher];
	}

	@action
	public deleteTeacherByCi(ci: string): void {
		this.teachers = this.teachers.filter((teacher) => teacher.ci !== ci);
	}

	@action
	public addAgreementType(agreementType: string): void {
		if (!this.agreementTypes.includes(agreementType)) this.agreementTypes = [...this.agreementTypes, agreementType];
	}

	@action
	public setIsDrawerOpen(newValue?: boolean): void {
		this.isDrawerOpen = newValue ?? !this.isDrawerOpen;
	}
}

reaction(
	() => JSON.stringify(DataStore.getInstance()),
	(json) => {
		sessionStorage.setItem("store", json);
	},
	{
		delay: 100,
	}
);
