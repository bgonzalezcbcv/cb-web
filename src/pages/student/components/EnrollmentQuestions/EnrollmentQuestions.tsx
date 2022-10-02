import _ from "lodash";
import React, { useCallback, useEffect, useState } from "react";

import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Box,
	Button,
	FormControl,
	InputLabel,
	List,
	MenuItem,
	Select,
	SelectChangeEvent,
	Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import * as API from "../../../../core/ApiStore";
import { Question as QuestionModel, Student, Cicle, QuestionCategories } from "../../../../core/Models";
import Question from "./components/Question";

export interface EnrollmentQuestionsProps {
	student: Student;
	editable: boolean;
	onChange: (newStudent: Student) => void;
	viewMode: string;
}

async function getCicleQuestions(cicle: string): Promise<QuestionCategories[] | null> {
	const cicleKey = Object.values(Cicle).indexOf(cicle as Cicle);
	const questionData = await API.getCicleQuestions(cicleKey);

	if (!questionData.success) return null;

	return questionData.questionCategories;
}

export default function EnrollmentQuestions(props: EnrollmentQuestionsProps): React.ReactElement {
	const { student, editable, onChange, viewMode } = props;

	const isViewMode = viewMode == "VIEW";

	// student.question_categories
	const [question_categories, setQuestionCategories] = useState(student.question_categories);
	const [selectedCicle, setSelectedCicle] = useState(isViewMode ? "" : "None");
	const [error, setError] = useState<string | null>(null);

	const studentCicles = Object.keys(Cicle) as Array<keyof typeof Cicle>;
	const indexOfCicle = Object.values(Cicle).indexOf(student.cicle);
	const validCicles = studentCicles.splice(0, indexOfCicle + 1);

	const onChangeHandler = (changedQuestionCategoryIndex: number, changedQuestionIndex: number, newAnswerValue: string): void => {
		const newStudentData: Student = _.cloneDeep(student);
		newStudentData.question_categories[changedQuestionCategoryIndex].questions[changedQuestionIndex].answer = newAnswerValue;

		onChange(newStudentData);
	};

	useEffect(() => {
		getCicleQuestions(selectedCicle).then((result) => {
			if (result == null) {
				setError("Error al cargar el archivo.");
				return;
			} else {
				setQuestionCategories(result);
			}
		});
	}, [setError, setQuestionCategories]);

	useEffect(() => {
		if (error) window.setTimeout(() => setError(null), 3000);
	}, [error]);

	const handleCicleChange = useCallback(
		async (event: SelectChangeEvent): Promise<void> => {
			const cicle = event.target.value;
			setSelectedCicle(cicle);

			const questions = await getCicleQuestions(cicle);

			if (questions == null) {
				setError("Error al cargar preguntas.");
				return;
			} else {
				setQuestionCategories(questions);
			}
		},
		[question_categories]
	);

	const sendAnswers = useCallback(async (): Promise<void> => {
		const answers: QuestionModel[] = [];
		for (const category of question_categories) {
			answers.concat(category.questions);
		}
		const sendAnswersResponse = await API.postAnswersEnrollmentQuestions(student.id, indexOfCicle, answers);

		if (!sendAnswersResponse) {
			setError("Error al enviar las respuestas.");
			return;
		}
	}, [question_categories]);

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
									<MenuItem key={key} value={key}>
										{Cicle[key]}
									</MenuItem>
								);
							})}
						</Select>
					</FormControl>
				</Box>
				<Box
					sx={{
						display: "flex",
						justifyContent: "flex-end",
						width: "50%",
					}}>
					<Button sx={{ display: isViewMode ? "" : "none" }} variant="outlined" onClick={(): unknown => sendAnswers}>
						Enviar Respuestas
					</Button>
				</Box>
			</Box>
			<List>
				{question_categories.map((category, categoryIndex): React.ReactElement => {
					return (
						<div key={"category" + categoryIndex}>
							<Accordion
								sx={{
									flexDirection: "column",
									justifyContent: "space-between",
									display: "flex",
									flex: 1,
									height: "100%",
									width: "100%",
									alignContent: "center",
								}}>
								<AccordionSummary expandIcon={<ExpandMoreIcon />}>
									<Typography> {category.category} </Typography>
								</AccordionSummary>

								<AccordionDetails>
									{category.questions.map(
										(question, questionIndex): React.ReactElement => (
											<Question
												key={`${category}-${categoryIndex}-question-${questionIndex}`}
												question={question}
												questionIndex={questionIndex}
												editable={editable}
												onChangeQuestion={(newAnswer): void => onChangeHandler(categoryIndex, questionIndex, newAnswer)}
											/>
										)
									)}
								</AccordionDetails>
							</Accordion>
						</div>
					);
				})}
			</List>
		</Box>
	);
}
