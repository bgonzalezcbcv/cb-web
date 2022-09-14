import React, { useEffect, useState } from "react";
import _ from "lodash";

import { Divider, Grid, List, ListItem, TextField, Typography } from "@mui/material";

import useDebounce from "../../../../hooks/useDebounce";

export type Question = {
	id: string;
	question: string;
	answer: string;
};

export interface QuestionCategories {
	category: string;
	questions: Question[];
}

export interface EnrollmentQuestionsProps {
	studentQuestionCategories: QuestionCategories[];
	editable: boolean;
	onChange: (newData: QuestionCategories[]) => void;
}

export function EnrollmentQuestions(props: EnrollmentQuestionsProps): React.ReactElement {
	const { studentQuestionCategories, editable, onChange } = props;

	const onChangeHandler = (changedQuestionCategoryIndex: number, changedQuestionIndex: number, newAnserValue: string): void => {
		const newQuestionCategories: QuestionCategories[] = _.cloneDeep(studentQuestionCategories);
		newQuestionCategories[changedQuestionCategoryIndex].questions[changedQuestionIndex].answer = newAnserValue;
		onChange(newQuestionCategories);
	};

	console.log(editable);

	return (
		<div>
			<List>
				{studentQuestionCategories.map((category, categoryIndex): React.ReactElement => {
					return (
						<div key={"category" + categoryIndex}>
							<Typography variant="h4" gutterBottom>
								{category.category}
							</Typography>

							{category.questions.map((question, questionIndex): React.ReactElement => {
								const [answer, setAnswer] = useState(question.answer);
								const debouncedAnswer = useDebounce<string>(answer, 500);

								useEffect(() => {
									onChangeHandler(categoryIndex, questionIndex, debouncedAnswer);
								}, [debouncedAnswer]);

								return (
									<div key={"question" + question.id + questionIndex}>
										<ListItem>
											<Grid container spacing={2} sx={{ justifyContent: "space-between" }}>
												<Grid item xs={4}>
													<div style={{ paddingRight: 20 }}>{question.question}</div>
												</Grid>

												<Grid item xs={6}>
													<TextField
														multiline
														maxRows={8}
														fullWidth
														value={answer}
														onChange={(e): void => {
															setAnswer(e.target.value);
														}}
													/>
												</Grid>
											</Grid>
										</ListItem>
										<Divider />
									</div>
								);
							})}
							{categoryIndex < studentQuestionCategories.length - 1 && <Divider />}
						</div>
					);
				})}
			</List>
		</div>
	);
}
