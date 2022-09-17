import _ from "lodash";
import React, { useEffect, useState } from "react";

import { Question, Student } from "../../../../core/interfaces";
import { Box, Divider, Grid, List, ListItem, TextField, Typography } from "@mui/material";
import useDebounce from "../../../../hooks/useDebounce";

export interface EnrollmentQuestionsProps {
	studentData: Student;
	editable: boolean;
	onChange: (newData: Student) => void;
}
function renderQuestion(
	onChangeQuestionCallback: (debouncedAnswerText: string) => void,
	question: Question,
	questionIndex: number,
	editable: boolean
): React.ReactElement {
	const [answer, setAnswer] = useState(question.answer);
	const debouncedAnswer = useDebounce<string>(answer, 500);

	useEffect(() => {
		onChangeQuestionCallback(debouncedAnswer);
	}, [debouncedAnswer]);

	return (
		<Grid item sm={12} lg={6} xl={4} key={"question" + question.id + questionIndex} sx={{ width: "100%" }}>
			<ListItem sx={{ flex: 1, height: "100%" }}>
				<Box
					sx={{
						flexDirection: "column",
						justifyContent: "space-between",
						display: "flex",
						flex: 1,
						height: "100%",
						alignContent: "center",
					}}>
					<Typography style={{ paddingRight: 20 }} gutterBottom variant="body2">
						{question.question}
					</Typography>
					<TextField
						multiline
						minRows={4}
						disabled={!editable}
						maxRows={4}
						fullWidth
						placeholder="Ingrese la respuesta"
						value={answer}
						onChange={(event): void => {
							setAnswer(event.target.value);
						}}
					/>
				</Box>
			</ListItem>
		</Grid>
	);
}

export function EnrollmentQuestions(props: EnrollmentQuestionsProps): React.ReactElement {
	const { studentData, editable, onChange } = props;
	const studentQuestionCategories = studentData.question_categories;

	const onChangeHandler = (changedQuestionCategoryIndex: number, changedQuestionIndex: number, newAnserValue: string): void => {
		const newStudentData: Student = _.cloneDeep(studentData);
		newStudentData.question_categories[changedQuestionCategoryIndex].questions[changedQuestionIndex].answer = newAnserValue;

		onChange(newStudentData);
	};

	return (
		<List>
			{studentQuestionCategories.map((category, categoryIndex): React.ReactElement => {
				return (
					<div key={"category" + categoryIndex}>
						<Typography variant="h4" gutterBottom>
							{category.category}
						</Typography>

						<Grid container spacing={2} sx={{ justifyContent: "space-between" }}>
							{category.questions.map((question, questionIndex): React.ReactElement => {
								const onChangeQuestionHandler = (debouncedAnswer: string): void => {
									onChangeHandler(categoryIndex, questionIndex, debouncedAnswer);
								};
								return renderQuestion(onChangeQuestionHandler, question, questionIndex, editable);
							})}
						</Grid>

						{categoryIndex < studentQuestionCategories.length - 1 && <Divider />}
					</div>
				);
			})}
		</List>
	);
}
