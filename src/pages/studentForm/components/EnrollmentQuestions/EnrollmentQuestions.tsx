import React from "react";

import { JsonSchema } from "@jsonforms/core";
import { Divider, Grid, List, ListItem, TextField, Typography } from "@mui/material";

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
	studentData: QuestionCategories[];
	editable: boolean;
	onChange: () => void;
	userSchema?: JsonSchema;
}

export function EnrollmentQuestions(props: EnrollmentQuestionsProps): React.ReactElement {
	const { studentData, editable, onChange } = props;

	console.log(editable);
	onChange();

	return (
		<div>
			<List>
				{studentData.map((category): React.ReactElement => {
					return (
						<div key={"category" + category}>
							<Typography variant="h4" gutterBottom>
								{category.category}
							</Typography>

							{category.questions.map((question): React.ReactElement => {
								return (
									<div key={question.id}>
										<ListItem>
											<Grid container spacing={2} sx={{ justifyContent: "center" }}>
												<Grid item xs={4}>
													<div style={{ paddingRight: 20 }}>{question.question}</div>
												</Grid>

												<Grid item xs={4}>
													<TextField multiline maxRows={8} fullWidth />
												</Grid>
											</Grid>
										</ListItem>
									</div>
								);
							})}
							<Divider />
						</div>
					);
				})}
			</List>
		</div>
	);
}
