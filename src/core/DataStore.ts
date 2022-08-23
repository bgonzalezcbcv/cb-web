import { makeAutoObservable, action, reaction } from "mobx";

import { Teacher } from "./interfaces";

export class DataStore {
    private static instance: DataStore;

    public teachers: Teacher[] = [];

    private constructor() {
        const savedStateJson = localStorage.getItem('store');

        if (savedStateJson) {
            try {
                const savedState = JSON.parse(savedStateJson);
                Object.keys(this).forEach((attribute) =>
                    this[attribute as keyof DataStore] = savedState[attribute]
                )
            } catch (err) {
                console.error(err);
            }
        }

        makeAutoObservable(this);
    }

    public static getInstance() {
        if (!DataStore.instance) DataStore.instance = new DataStore();

        return this.instance;
    }

    @action
    public addTeacher(teacher: Teacher) {
        this.teachers = [...this.teachers, teacher]
    }

    @action
    public deleteTeacherByCi(ci: string) {
        this.teachers = this.teachers.filter((teacher) => teacher.ci !== ci);
    }
}

reaction(() => JSON.stringify(DataStore.getInstance()), json => {
    localStorage.setItem('store', json);
}, {
    delay: 500,
});