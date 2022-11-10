import _ from "lodash";
import React from "react";

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

import { Comment } from "../../../../../core/Models";

interface CommentHistoryProps {
	comments: Comment[];
}

export default function CommentHistory(props: CommentHistoryProps): React.ReactElement {
	const { comments } = props;

	const sortedComments = _.sortBy(comments, (row) => 0 - row.id);

	return (
		<TableContainer style={{ height: 240, fontWeight: 600 }}>
			<Table sx={{ width: "100%" }} stickyHeader>
				<TableHead>
					<TableRow hover>
						<TableCell>Comentario</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{sortedComments.map(({ text }, index) => (
						<TableRow hover key={"comment" + index}>
							<TableCell component="th" scope="row">
								{text}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}
