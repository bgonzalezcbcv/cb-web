import _ from "lodash";
import React from "react";

import { Accordion, AccordionDetails, AccordionSummary, Box, FormControl, InputLabel, List, MenuItem, Select, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Question from "./components/Question";
import { Student, Cicle } from "../../../../core/Models";

export interface EnrollmentQuestionsProps {
	student: Student;
	editable: boolean;
	onChange: (newStudent: Student) => void;
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
