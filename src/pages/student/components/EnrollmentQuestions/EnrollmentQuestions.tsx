import _ from "lodash";
import React, { useEffect, useState } from "react";

import { Box, FormControl, InputLabel, List, MenuItem, Select, SelectChangeEvent } from "@mui/material";

import { Student, Cicle } from "../../../../core/Models";
import Question from "./components/Question";

export interface EnrollmentQuestionsProps {
	student: Student;
	editable: boolean;
	onChange: (newStudent: Student, debounce?: boolean) => void;
}

export default function EnrollmentQuestions(props: EnrollmentQuestionsProps): React.ReactElement {
	const { student, editable, onChange } = props;

	const cicle_questions = _.cloneDeep(student.cicle_questions);

	const [selectedCicle, setSelectedCicle] = useState<Cicle>(Cicle.None);
	const [questions, setQuestions] = useState(cicle_questions[0].questions);
	const [error, setError] = useState<string | null>(null);

	const studentCicles = Object.keys(Cicle) as Array<keyof typeof Cicle>;
	const indexOfCicle = Object.values(Cicle).indexOf(student.cicle);
	const validCicles = studentCicles.splice(0, indexOfCicle + 1);

	useEffect(() => {
		console.log(student.cicle_questions[0].questions);
		setQuestions(student.cicle_questions[0].questions);
	}, [student.cicle_questions]);

	const onChangeHandler = (changedQuestionIndex: number, newAnswerValue: string): void => {
		const newStudentData: Student = _.cloneDeep(student);
		const newQuestion = newStudentData.cicle_questions.filter((q) => q.name == selectedCicle)[0].questions[changedQuestionIndex];
		newQuestion.answer = newAnswerValue;

		onChange(newStudentData);
	};

	useEffect(() => {
		if (error) window.setTimeout(() => setError(null), 3000);
	}, [error]);

	useEffect(() => {
		const selectedCicleIndex = Object.values(Cicle).indexOf(selectedCicle);
		setQuestions(cicle_questions[selectedCicleIndex].questions);
	}, [student.cicle_questions, selectedCicle]);

	const handleCicleChange = (event: SelectChangeEvent): void => {
		const cicleString = event.target.value;
		const cicleList = Object.keys(Cicle) as Array<keyof typeof Cicle>;
		const cicleIndex = Object.values(Cicle).indexOf(cicleString as Cicle);
		const cicleKey = cicleList[cicleIndex];
		const cicle = Cicle[cicleKey];

		setSelectedCicle(cicle);
	};

	return (
		<Box>
			<Box display="flex">
				<Box
					sx={{
						display: "flex",
						justifyContent: "flex-start",
						width: "50%",
					}}>
					<FormControl variant="standard" sx={{ width: "50%" }}>
						<InputLabel>Seleccionar Ciclo</InputLabel>
						<Select value={selectedCicle} onChange={handleCicleChange}>
							{validCicles.map((key: keyof typeof Cicle) => {
								return (
									<MenuItem key={key} value={Cicle[key]}>
										{Cicle[key]}
									</MenuItem>
								);
							})}
						</Select>
					</FormControl>
				</Box>
			</Box>
			<List>
				{questions.map(
					(question, questionIndex): React.ReactElement => (
						<Question
							key={`question-${question.id}`}
							question={question}
							questionIndex={questionIndex}
							editable={editable && student.cicle == selectedCicle}
							onChangeQuestion={(newAnswer): void => onChangeHandler(questionIndex, newAnswer)}
						/>
					)
				)}
			</List>
		</Box>
	);
}
