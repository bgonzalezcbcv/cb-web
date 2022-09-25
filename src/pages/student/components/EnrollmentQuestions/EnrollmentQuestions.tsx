import _ from "lodash";
import React, { useEffect, useState } from "react";

import { Question as QuestionModel, Student } from "../../../../core/Models";
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Box,
	Button,
	Container,
	Divider,
	FormControl,
	Grid,
	InputLabel,
	List,
	ListItem,
	MenuItem,
	Select,
	TextField,
	Typography,
} from "@mui/material";
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
	expanded: boolean;
	onChangeQuestion: (debouncedAnswerText: string) => void;
}): React.ReactElement {
	const { question, questionIndex, editable, onChangeQuestion, expanded } = props;

	const [answer, setAnswer] = useState(question.answer);
	const [expandMode, setExpandMode] = React.useState(expanded);
	const debouncedAnswer = useDebounce<string>(answer, 50);

	useEffect(() => {
		setExpandMode(expanded);
	}, [expanded]);

	useEffect(() => {
		onChangeQuestion(debouncedAnswer);
	}, [debouncedAnswer]);

	return (
		<Grid item sm={12} lg={12} xl={4} key={"question" + question.id + questionIndex}>
			<ListItem>
				<Accordion
					expanded={expandMode}
					onClick={() => setExpandMode(!expandMode)}
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

	const [categoryFilter, setCategoryFilter] = React.useState("");
	const [expandMode, setExpandMode] = React.useState(true);

	const onChangeHandler = (changedQuestionCategoryIndex: number, changedQuestionIndex: number, newAnswerValue: string): void => {
		const newStudentData: Student = _.cloneDeep(student);
		newStudentData.question_categories[changedQuestionCategoryIndex].questions[changedQuestionIndex].answer = newAnswerValue;

		onChange(newStudentData);
	};

	console.log(question_categories.map((q) => q.category));

	return (
		<Box display="flex" flexDirection="column" width="100%" height="100%">
			<FormControl variant="standard" sx={{ m: 1, width: "35%" }}>
				<InputLabel id="category-filter">Filtrar Categoría</InputLabel>
				<Select
					labelId="category-filter"
					id="select-category-filter"
					value={categoryFilter}
					// onChange={setCategoryFilter()}
					label="Filtrar Categoría">
					{question_categories.map((category, categoryIndex) => {
						return (
							<MenuItem key={"category-filter-" + categoryIndex} value={categoryIndex}>
								<Typography> {category.category} </Typography>
							</MenuItem>
						);
					})}
				</Select>
			</FormControl>
			<List>
				{question_categories.map((category, categoryIndex): React.ReactElement => {
					return (
						<Box display="flex" flexDirection="column" width="100%" height="100%" key={"category" + categoryIndex}>
							<Divider textAlign="left" sx={{ paddingTop: "20px" }}>
								<Typography> {category.category} </Typography>
							</Divider>

							<Box display="flex" flexDirection="row" justifyContent="flex-end">
								<Button
									variant="text"
									startIcon={expandMode ? <ExpandLessRoundedIcon /> : <ExpandMoreRoundedIcon />}
									onClick={() => setExpandMode(!expandMode)}>
									{expandMode ? "Colapsar" : "Expandir"}
								</Button>
							</Box>

							<Grid container spacing={2} sx={{ justifyContent: "space-between" }}>
								{category.questions.map(
									(question, questionIndex): React.ReactElement => (
										<Question
											key={`${category}-${categoryIndex}-question-${questionIndex}`}
											question={question}
											questionIndex={questionIndex}
											editable={editable}
											expanded={expandMode}
											onChangeQuestion={(newAnswer): void => onChangeHandler(categoryIndex, questionIndex, newAnswer)}
										/>
									)
								)}
							</Grid>
						</Box>
					);
				})}
			</List>
		</Box>
	);
}
