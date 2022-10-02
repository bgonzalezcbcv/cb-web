import _, { indexOf } from "lodash";
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
	ListItem,
	MenuItem,
	Select,
	SelectChangeEvent,
	TextField,
	Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import * as API from "../../../../core/ApiStore";
import { Question as QuestionModel, Student, Cicle, QuestionCategories } from "../../../../core/Models";
import useDebounce from "../../../../hooks/useDebounce";

export interface EnrollmentQuestionsProps {
	student: Student;
	editable: boolean;
	onChange: (newStudent: Student) => void;
}

function Question(props: {
	question: QuestionModel;
	questionIndex: number;
	editable: boolean;
	onChangeQuestion: (debouncedAnswerText: string) => void;
}): React.ReactElement {
	const { question, questionIndex, editable, onChangeQuestion } = props;

	const [answer, setAnswer] = useState(question.answer);
	const debouncedAnswer = useDebounce<string>(answer, 50);

	useEffect(() => {
		onChangeQuestion(debouncedAnswer);
	}, [debouncedAnswer]);

	return (
		<Box key={"question" + question.id + questionIndex}>
			<ListItem>
				<Box
					sx={{
						flexDirection: "column",
						justifyContent: "space-between",
						display: "flex",
						flex: 1,
						height: "100%",
						alignContent: "center",
					}}>
					<Typography style={{ paddingRight: 20 }} gutterBottom>
						{question.question}
					</Typography>

					<TextField
						multiline
						minRows={1}
						disabled={!editable}
						maxRows={4}
						fullWidth
						value={answer}
						variant="standard"
						onChange={(event): void => {
							setAnswer(event.target.value);
						}}
					/>
				</Box>
			</ListItem>
		</Box>
	);
}

export default function EnrollmentQuestions(props: EnrollmentQuestionsProps): React.ReactElement {
	const { student, editable, onChange } = props;
	const [question_categories, setQuestionCategories] = useState(Array<QuestionCategories>);
	const [selectedCicle, setSelectedCicle] = useState("");

	const studentCicles = Object.keys(Cicle) as Array<keyof typeof Cicle>;
	const indexOfCicle = Object.values(Cicle).indexOf(student.cicle);
	const validCicles = studentCicles.splice(0, indexOfCicle + 1);

	const onChangeHandler = (changedQuestionCategoryIndex: number, changedQuestionIndex: number, newAnswerValue: string): void => {
		const newStudentData: Student = _.cloneDeep(student);
		newStudentData.question_categories[changedQuestionCategoryIndex].questions[changedQuestionIndex].answer = newAnswerValue;

		onChange(newStudentData);
	};

	const handleCicleChange = useCallback(
		async (event: SelectChangeEvent): Promise<void> => {
			const cicle = event.target.value;
			setSelectedCicle(cicle);
			const cicleKey = Object.values(Cicle).indexOf(cicle as Cicle);

			const questionData = await API.getCicleQuestions(cicleKey);

			setQuestionCategories(questionData.questionCategories);
		},
		[question_categories]
	);

	const sendAnswers = useCallback(async (): Promise<void> => {
		const answers: QuestionModel[] = [];
		for (const category of question_categories) {
			answers.concat(category.questions);
		}

		const sendAnswersResponse = await API.postAnswersEnrollmentQuestions(student.id, indexOfCicle, answers);
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
					<Button variant="outlined" onClick={() => sendAnswers}>
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
												editable={editable && selectedCicle === student.cicle}
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
