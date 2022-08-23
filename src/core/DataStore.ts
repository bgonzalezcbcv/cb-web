import { makeAutoObservable, action } from "mobx";

import { Teacher } from "./interfaces";

export class DataStore {
    private static instance: DataStore;

    public teachers: Teacher[] = [];

    private constructor() {
        makeAutoObservable(this)
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