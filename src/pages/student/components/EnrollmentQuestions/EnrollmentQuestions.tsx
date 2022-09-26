import _ from "lodash";
import React, { useEffect, useState } from "react";

import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Box,
	Button,
	Divider,
	FormControl,
	Grid,
	IconButton,
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
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import ExpandLessRoundedIcon from "@mui/icons-material/ExpandLessRounded";
import ClearIcon from "@mui/icons-material/Clear";

import { Question as QuestionModel, Student } from "../../../../core/Models";
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
		<Box key={"question" + question.id + questionIndex}>
			<ListItem>
				<Accordion
					expanded={expandMode}
					sx={{
						flexDirection: "column",
						justifyContent: "space-between",
						display: "flex",
						flex: 1,
						height: "100%",
						width: "100%",
						alignContent: "center",
					}}>
					<AccordionSummary expandIcon={<ExpandMoreIcon />} onClick={() => setExpandMode(!expandMode)}>
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
		</Box>
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

	const handleCategoryChange = (event: SelectChangeEvent): void => {
		setCategoryFilter(event.target.value as string);
	};

	return (
		<Box display="flex" flexDirection="column" width="100%" height="100%">
			<FormControl variant="standard" sx={{ m: 1, width: "35%" }}>
				<InputLabel id="category-filter">Filtrar Categoría</InputLabel>
				<Select labelId="category-filter" id="select-category-filter" value={categoryFilter} onChange={handleCategoryChange} label="Filtrar Categoría">
					<MenuItem value={250}>kjasdlfkajsdf</MenuItem>
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
				{question_categories
					.filter((q) => categoryFilter == "" || q.category == categoryFilter)
					.map((category, categoryIndex): React.ReactElement => {
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
							</Box>
						);
					})}
			</List>
		</Box>
	);
}
