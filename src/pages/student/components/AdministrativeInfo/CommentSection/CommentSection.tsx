import React, { useState } from "react";

import { Alert, Box, Card, CardContent, CircularProgress, Divider, IconButton, Typography } from "@mui/material";

import { Comment, Student } from "../../../../../core/Models";
import useFetchFromAPI, { FetchStatus } from "../../../../../hooks/useFetchFromAPI";
import { fetchComments } from "../../../../../core/ApiStore";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AddComment from "./AddComment";
import CommentHistory from "./CommentHistory";

interface CommentSectionProps {
	student: Student;
	editable: boolean;
	onChange: (newStudent: Student, debounce?: boolean) => void;
}

function CommentSection(props: CommentSectionProps): React.ReactElement {
	const { student, editable } = props;

	const [comments, setComments] = useState<Comment[]>();
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);

	const { fetchStatus, refetch } = useFetchFromAPI(() => fetchComments(Number(student.id)), setComments);

	function handleCloseModal(commited = false): void {
		setIsAddModalOpen(false);

		if (commited) refetch();
	}

	if (fetchStatus === FetchStatus.Fetching) return <CircularProgress />;

	if (fetchStatus === FetchStatus.Error)
		return (
			<Alert variant="outlined" severity="error" style={{ cursor: "pointer" }} onClick={refetch}>
				<Typography>No se pudieron obtener los comentarios. Haga click aquí para reintentar.</Typography>
			</Alert>
		);

	return (
		<Card sx={{ display: "flex", width: "100%" }}>
			<CardContent sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
				<Box display="flex" flexGrow={1} padding="0px 0px 0px 10px" justifyContent="space-between">
					<Typography variant={"subtitle1"}>Comentarios</Typography>

					<Box>
						{editable && (
							<IconButton color="secondary" onClick={(): void => setIsAddModalOpen(true)}>
								<AddCircleOutlineIcon />
							</IconButton>
						)}
					</Box>

					<AddComment studentId={Number(student.id)} isOpen={isAddModalOpen} editable={editable} onClose={handleCloseModal} />
				</Box>

				<Divider />

				<CommentHistory comments={comments ?? []} />
			</CardContent>
		</Card>
	);
}

export default CommentSection;
