import _ from "lodash";

import { Cicle, CicleQuestions, Question, Student, StudentCreationForm } from "./Models";
import { addLeadingZeroToDate, normalizeText } from "./CoreHelper";
import * as API from "./ApiStore";

function fillAnswers(inscriptionQuestions: CicleQuestions, questionsKey: string[], form: StudentCreationForm): CicleQuestions {
	const questions = inscriptionQuestions.questions;
	const resultQuestions: Question[] = [];

	questionsKey.forEach((key: string) => {
		questions.forEach((q: Question) => {
			const normalizedText = normalizeText(q.text).replaceAll(" ", "");
			const normalizedKey = normalizeText(key).replaceAll(" ", "");
			const answer = form[key as keyof StudentCreationForm].toString();

			if (normalizedText === normalizedKey) {
				resultQuestions.push({
					id: q.id,
					text: q.text,
					answer: answer == "" ? "-" : answer,
					answerId: -1,
					httpRequest: "POST",
				});
			}
		});
	});

	const resultCicleQuestions = {
		id: inscriptionQuestions.id,
		name: inscriptionQuestions.name,
		questions: resultQuestions,
	};

	return resultCicleQuestions;
}

export async function parseFormToStudent(form: StudentCreationForm, student: Student): Promise<Student | null> {
	const getQuestionsResponse = await API.fetchCicles();

	if (!getQuestionsResponse.success) return null;

	const inscriptionQuestions: CicleQuestions = getQuestionsResponse.cicle_questions.filter((c) => c.name == Cicle.None)[0];

	const questionsKeys = Object.keys(form);

	try {
		const formStudent = {
			email: form.Email,
			name: form["Nombres:"],
			surname: form["Apellidos:"],
			birthdate: addLeadingZeroToDate(form["Fecha de nacimiento:"]),
			birthplace: form["Lugar de nacimiento:"],
			nationality: form["Nacionalidad:"],
			ci: form["Cédula de Identidad:"].replaceAll(".", "").replaceAll("-", ""),
			address: form["Dirección:"],
			neighborhood: form["Barrio:"],
			phone_number: form["Teléfono:"],
			first_language: form["Lengua materna:"],
			medical_assurance: form["Cobertura médica:"],
			emergency: form["Emergencia médica:"],
			vaccine_expiration: addLeadingZeroToDate(form["Fecha de vencimiento de vacunas:"]),
			family: [
				{
					role: form["Datos correspondientes a:"],
					full_name: form["Apellidos, nombre:"],
					birthdate: addLeadingZeroToDate(form["Fecha de nacimiento:2"]),
					birthplace: form["País de nacimiento:"],
					nationality: form["Nacionalidad:2"],
					first_language: form["Lengua materna:2"],
					ci: form["Cédula de identidad:2"].replaceAll(".", "").replaceAll("-", ""),
					marital_status: form["Estado Civil:"],
					cellphone: form["Celular:"],
					email: form["Mail personal:"],
					address: form["Dirección:2"],
					neighborhood: form["Barrio residencia:"],
					education_level: form["Nivel educativo"],
					occupation: form["Ocupación o Profesión:"],
					workplace: form["Empresa o lugar de trabajo:"],
					workplace_address: form["Dirección de trabajo:"],
					workplace_neighbourhood: form["Barrio de trabajo:"],
					workplace_phone: form["Teléfono trabajo:"].toString(),
				},
				{
					role: form["Datos correspondientes a:2"],
					full_name: form["Apellidos, nombre:2"],
					birthdate: addLeadingZeroToDate(form["Fecha de nacimiento:3"]),
					birthplace: form["País de nacimiento:2"],
					nationality: form["Nacionalidad:3"],
					first_language: form["Lengua materna:3"],
					ci: form["Cédula de identidad:3"].replaceAll(".", "").replaceAll("-", ""),
					marital_status: form["Estado Civil:2"],
					cellphone: form["Celular:2"],
					email: form["Mail personal:2"],
					address: form["Dirección:3"],
					neighborhood: form["Barrio residencia:2"],
					education_level: form["Nivel educativo2"],
					occupation: form["Ocupación o Profesión:2"],
					workplace: form["Empresa o lugar de trabajo:2"],
					workplace_address: form["Dirección de trabajo:2"],
					workplace_neighbourhood: form["Barrio de trabajo:2"],
					workplace_phone: form["Teléfono trabajo:2"].toString(),
				},
			],
			cicle: Cicle.None,
			cicle_questions: [fillAnswers(inscriptionQuestions, questionsKeys, form)],
		};

		return _.mergeWith(student, formStudent, (obj, src) => {
			if (_.isArray(obj)) return src;
		});
	} catch (error) {
		console.log(error);
		return null;
	}
}
