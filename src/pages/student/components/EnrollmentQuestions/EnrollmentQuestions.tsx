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
import { Question as QuestionModel, Student, Cicle } from "../../../../core/Models";
import Question from "./components/Question";

export interface EnrollmentQuestionsProps {
	student: Student;
	editable: boolean;
	onChange: (newStudent: Student) => void;
	viewMode: string;
}

export default function EnrollmentQuestions(props: EnrollmentQuestionsProps): React.ReactElement {
	const { student, editable, onChange, viewMode } = props;

	const isViewMode = viewMode == "VIEW";
	const cicleQuestionCategories = student.cicle_question_categories;

	const [selectedCicle, setSelectedCicle] = useState<Cicle>(Cicle.None);
	const [question_categories, setQuestionCategories] = useState(cicleQuestionCategories[0].question_categories);
	const [error, setError] = useState<string | null>(null);

	const studentCicles = Object.keys(Cicle) as Array<keyof typeof Cicle>;
	const indexOfCicle = Object.values(Cicle).indexOf(student.cicle);
	const validCicles = studentCicles.splice(0, indexOfCicle + 1);

	const onChangeHandler = (changedQuestionCategoryIndex: number, changedQuestionIndex: number, newAnswerValue: string): void => {
		const newStudentData: Student = _.cloneDeep(student);
		newStudentData.cicle_question_categories.filter((q) => q.cicle == selectedCicle)[0].question_categories[changedQuestionCategoryIndex].questions[
			changedQuestionIndex
		].answer = newAnswerValue;

		onChange(newStudentData);
	};

	useEffect(() => {
		if (error) window.setTimeout(() => setError(null), 3000);
	}, [error]);

	const handleCicleChange = (event: SelectChangeEvent): void => {
		const cicleString = event.target.value;
		const cicleList = Object.keys(Cicle) as Array<keyof typeof Cicle>;
		const cicleIndex = Object.values(Cicle).indexOf(cicleString as Cicle);
		const cicleKey = cicleList[cicleIndex];
		const cicle = Cicle[cicleKey];
		const cicleCategories = student.cicle_question_categories.filter((q) => q.cicle == cicle)[0].question_categories;

		setSelectedCicle(cicle);
		setQuestionCategories(cicleCategories);
	};

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
									<MenuItem key={key} value={Cicle[key]}>
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
												editable={editable && student.cicle == selectedCicle}
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
