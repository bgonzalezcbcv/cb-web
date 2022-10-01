import _ from "lodash";

import { Student, StudentCreationForm } from "./Models";
import { addLeadingZeroToDate } from "./CoreHelper";

export function parseFormToStudent(form: StudentCreationForm, student: Student): Student | null {
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
			vaccine_expiration: form["Fecha de vencimiento de vacunas:"],
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
					neighbourhood: form["Barrio residencia:"],
					education_level: form["Nivel educativo"],
					occupation: form["Ocupación o Profesión:"],
					workplace: form["Empresa o lugar de trabajo:"],
					workplace_address: form["Dirección de trabajo:"],
					workplace_neighbourhood: form["Barrio de trabajo:"],
					workplace_phone: form["Teléfono trabajo:"],
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
					neighbourhood: form["Barrio residencia:2"],
					education_level: form["Nivel educativo2"],
					occupation: form["Ocupación o Profesión:2"],
					workplace: form["Empresa o lugar de trabajo:2"],
					workplace_address: form["Dirección de trabajo:2"],
					workplace_neighbourhood: form["Barrio de trabajo:2"],
					workplace_phone: form["Teléfono trabajo:2"],
				},
			],
			question_categories: [
				{
					category: "new",
					questions: [
						{
							id: "1",
							question: "¿Con quién/quiénes vive el alumno/a?",
							answer: form["¿Con quién/quiénes vive el alumno/a?"],
						},
						{
							id: "2",
							question: "¿Tiene hermanos?",
							answer: form["¿Tiene hermanos?"],
						},
						{
							id: "3",
							question: "¿Concurren a nuestra Institución?",
							answer: form["¿Concurren a nuestra Institución?"],
						},
						{
							id: "4",
							question: "Ubicación del alumno/a a inscribir en el orden de los hermanos",
							answer: form["Ubicación del alumno/a a inscribir en el orden de los hermanos"].toString(),
						},
						{
							id: "5",
							question: "¿Cuántas laptops hay en la vivienda? (No incluir laptops de CEIBAL)",
							answer: form["¿Cuántas laptops hay en la vivienda? (No incluir laptops de CEIBAL)"],
						},
						{
							id: "6",
							question: "¿Cuántas pc fijas hay en la vivienda?",
							answer: form["¿Cuántas pc fijas hay en la vivienda?"],
						},
						{
							id: "7",
							question: "¿Cuántas tablets hay en la vivienda? (No incluir tablets de CEIBAL)",
							answer: form["¿Cuántas tablets hay en la vivienda? (No incluir tablets de CEIBAL)"],
						},
						{
							id: "8",
							question: "¿Cuántas laptop/tablet CEIBAL hay en la vivienda?",
							answer: form["¿Cuántas laptop/tablet CEIBAL hay en la vivienda?"],
						},
						{
							id: "9",
							question: "¿En el hogar hay acceso a internet?",
							answer: form["¿En el hogar hay acceso a internet?"],
						},
						{
							id: "10",
							question: "¿Tiene smartphone o celular inteligente con acceso a internet desde su hogar?",
							answer: form["¿Tiene smartphone o celular inteligente con acceso a internet desde su hogar?"],
						},
						{
							id: "11",
							question: "¿Asistió a Instituciones anteriores?",
							answer: form["¿Asistió a Instituciones anteriores?"],
						},
						{
							id: "12",
							question: "¿Desde qué edad?",
							answer: form["¿Desde qué edad?"],
						},
						{
							id: "13",
							question: "Nombre de instituciones anteriores:",
							answer: form["Nombre de instituciones anteriores:"],
						},
						{
							id: "14",
							question: "Escarlatina",
							answer: form.Escarlatina,
						},
						{
							id: "15",
							question: "Sarampión",
							answer: form.Sarampión,
						},
						{
							id: "16",
							question: "Varicela",
							answer: form.Varicela,
						},
						{
							id: "17",
							question: "Rubeola",
							answer: form.Rubeola,
						},
						{
							id: "18",
							question: "Paperas",
							answer: form.Paperas,
						},
						{
							id: "19",
							question: "Tos convulsa",
							answer: form["Tos convulsa"],
						},
						{
							id: "20",
							question: "¿Tuvo o tiene enfermedades importantes? ¿Cuáles?",
							answer: form["¿Tuvo o tiene enfermedades importantes? ¿Cuáles?"],
						},
						{
							id: "21",
							question: "¿Sufre enfermedades crónicas? ¿Cuáles?",
							answer: form["¿Sufre enfermedades crónicas? ¿Cuáles?"],
						},
						{
							id: "22",
							question: "¿Toma medicamentos regularmente? ¿Cuáles?",
							answer: form["¿Toma medicamentos regularmente? ¿Cuáles?"],
						},
						{
							id: "23",
							question: "¿Existen consecuencias de accidentes? ¿Cuáles?",
							answer: form["¿Existen consecuencias de accidentes? ¿Cuáles?"],
						},
						{
							id: "24",
							question: "Alergias o intolerancia a algún alimento:",
							answer: form["Alergias o intolerancia a algún alimento:"],
						},
						{
							id: "25",
							question: "Otra información que desee aclarar:",
							answer: form["Otra información que desee aclarar:"],
						},
						{
							id: "26",
							question: "Foniatra",
							answer: form.Foniatra,
						},
						{
							id: "27",
							question: "Psicomotricista",
							answer: form.Psicomotricista,
						},
						{
							id: "28",
							question: "Psicopedagogo",
							answer: form.Psicopedagogo,
						},
						{
							id: "29",
							question: "Psicólogo",
							answer: form.Psicólogo,
						},
						{
							id: "30",
							question: "Psiquiatra",
							answer: form.Psiquiatra,
						},
						{
							id: "31",
							question: "Neuropediatra",
							answer: form.Neuropediatra,
						},
						{
							id: "32",
							question: "¿Desea realizar algún comentario al respecto?",
							answer: form["¿Desea realizar algún comentario al respecto?"],
						},
						{
							id: "33",
							question: "¿Cómo llegó a conocer nuestra Institución?",
							answer: form["¿Cómo llegó a conocer nuestra Institución?"],
						},
						{
							id: "34",
							question:
								"¿Qué conocimientos, habilidades y/o actitudes fundamentales cree que deben desarrollarse en el proceso de aprendizaje de su hijo/a para lograr un alto desempeño en la complejidad y desafíos del mu...",
							answer: form[
								"¿Qué conocimientos, habilidades y/o actitudes fundamentales cree que deben desarrollarse en el proceso de aprendizaje de su hijo/a para lograr un alto desempeño en la complejidad y desafíos del mu..."
							],
						},
						{
							id: "35",
							question: "¿Porque considera importante una propuesta bilingüe en la formación de su hijo/a?",
							answer: form["¿Porque considera importante una propuesta bilingüe en la formación de su hijo/a?"],
						},
						{
							id: "36",
							question:
								"Detalle aquí otra información que crea importante y que pueda contribuir a una atención eficiente e integral del alumno/a:",
							answer: form[
								"Detalle aquí otra información que crea importante y que pueda contribuir a una atención eficiente e integral del alumno/a:"
							],
						},
					],
				},
			],
		};

		return _.mergeWith(student, formStudent, (obj, src) => {
			if (_.isArray(obj)) return src;
		});
	} catch (error) {
		console.log(error);
		return null;
	}
}
