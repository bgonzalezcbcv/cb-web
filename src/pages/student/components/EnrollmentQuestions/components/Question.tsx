import React, { useEffect, useState } from "react";

import { Box, ListItem, TextField, Typography } from "@mui/material";

import { Question as QuestionModel } from "../../../../../core/Models";
import useDebounce from "../../../../../hooks/useDebounce";

export default function Question(props: {
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
