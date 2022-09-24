import _ from "lodash";
import React, { useEffect, useState } from "react";

import { Question as QuestionModel, Student } from "../../../../core/Models";
import { Accordion, AccordionDetails, AccordionSummary, Button, Container, Divider, Grid, List, ListItem, TextField, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import ExpandLessRoundedIcon from "@mui/icons-material/ExpandLessRounded";
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
		<Grid item sm={12} lg={12} xl={4} key={"question" + question.id + questionIndex}>
			<ListItem>
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
						<Typography style={{ paddingRight: 20 }} gutterBottom>
							{question.question}
						</Typography>
					</AccordionSummary>

					<AccordionDetails>
						<TextField
							multiline
							minRows={4}
							disabled={!editable}
							maxRows={4}
							fullWidth
							value={answer}
							variant="standard"
							onChange={(event): void => {
								setAnswer(event.target.value);
							}}
						/>
					</AccordionDetails>
				</Accordion>
			</ListItem>
		</Grid>
	);
}

export default function EnrollmentQuestions(props: EnrollmentQuestionsProps): React.ReactElement {
	const { student, editable, onChange } = props;
	const { question_categories } = student;
	const [expandMode, setExpandMode] = React.useState(true);

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
						{/* <CardContent> */}
						<Divider textAlign="left" variant="middle" sx={{ paddingTop: "20px" }}>
							<Typography> {category.category} </Typography>
						</Divider>

						<Button
							variant="text"
							startIcon={expandMode ? <ExpandMoreRoundedIcon /> : <ExpandLessRoundedIcon />}
							onClick={() => setExpandMode(!expandMode)}>
							{expandMode ? "Expandir" : "Colapsar"}
						</Button>

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
						{/* </CardContent> */}
					</div>
				);
			})}
		</List>
	);
}
