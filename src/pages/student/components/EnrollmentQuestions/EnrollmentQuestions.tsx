import _, { indexOf } from "lodash";
import React, { useEffect, useState } from "react";

import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Box,
	FormControl,
	InputLabel,
	List,
	ListItem,
	MenuItem,
	Select,
	TextField,
	Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { Question as QuestionModel, Student, Cicle } from "../../../../core/Models";
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
	const { question_categories } = student;

	const studentCicles = Object.keys(Cicle) as Array<keyof typeof Cicle>;
	const indexOfCicle = Object.values(Cicle).indexOf(student.cicle);
	const validCicles = studentCicles.splice(0, indexOfCicle + 1);

	const onChangeHandler = (changedQuestionCategoryIndex: number, changedQuestionIndex: number, newAnswerValue: string): void => {
		const newStudentData: Student = _.cloneDeep(student);
		newStudentData.question_categories[changedQuestionCategoryIndex].questions[changedQuestionIndex].answer = newAnswerValue;

		onChange(newStudentData);
	};

	return (
		<Box>
			<Box width={"25%"}>
				<FormControl variant="standard" fullWidth>
					<InputLabel>Seleccionar Ciclo</InputLabel>
					<Select>
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
