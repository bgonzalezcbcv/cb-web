import _ from "lodash";
import React, { useEffect, useState } from "react";

import { Question as QuestionModel, Student } from "../../../../core/Models";
import { Box, Divider, Grid, List, ListItem, TextField, Typography } from "@mui/material";
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
					<Typography component={"span"} variant="body1" style={{ paddingRight: 20 }} gutterBottom>
						{question.question}
					</Typography>

					<TextField
						multiline
						minRows={4}
						disabled={!editable}
						maxRows={4}
						fullWidth
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

export default function EnrollmentQuestions(props: EnrollmentQuestionsProps): React.ReactElement {
	const { student, editable, onChange } = props;
	const { question_categories } = student;

	const onChangeHandler = (changedQuestionCategoryIndex: number, changedQuestionIndex: number, newAnswerValue: string): void => {
		const newStudentData: Student = _.cloneDeep(student);
		newStudentData.question_categories[changedQuestionCategoryIndex].questions[changedQuestionIndex].answer = newAnswerValue;

		onChange(newStudentData);
	};

	return (
		<List>
			{question_categories.map((category, categoryIndex): React.ReactElement => {
				return (
					<div key={"category" + categoryIndex}>
						<Typography component={"span"} variant="h4" gutterBottom>
							{category.category}
						</Typography>

						<Grid container spacing={2} sx={{ justifyContent: "space-between" }}>
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
						</Grid>

						{categoryIndex < question_categories.length - 1 && <Divider />}
					</div>
				);
			})}
		</List>
	);
}
