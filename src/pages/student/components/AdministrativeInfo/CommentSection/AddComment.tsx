import React, { useCallback, useState } from "react";

import { Alert, CircularProgress, Container, TextField } from "@mui/material";

import { createComment } from "../../../../../core/ApiStore";
import Modal from "../../../../../components/modal/Modal";
import { FetchStatus } from "../../../../../hooks/useFetchFromAPI";

interface AddCommentProps {
	studentId: number;
	isOpen: boolean;
	editable: boolean;
	onClose: (commited?: boolean) => void;
}

function AddComment(props: AddCommentProps): JSX.Element {
	const { studentId, isOpen, editable, onClose } = props;

	const [newComment, setNewComment] = useState<string>();
	const [creationState, setCreationState] = useState<FetchStatus>(FetchStatus.Initial);

	const handleCommentsChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>): void => {
		setNewComment(event.target.value);
	}, []);

	const handleDismiss = useCallback(
		(commit = false) => {
			if (commit) onClose(true);
			else onClose();
		},
		[onClose]
	);

	async function handleAccept(): Promise<void> {
		setCreationState(FetchStatus.Fetching);

		const response = await createComment(studentId, newComment?.trim() ?? "");

		console.log(response);
		if (response.success) handleDismiss(true);
		else {
			setCreationState(FetchStatus.Error);

			setTimeout(() => setCreationState(FetchStatus.Initial), 5000);
		}
	}

	function creationIndicator(): React.ReactElement | null {
		switch (creationState) {
			case FetchStatus.Error:
				return (
					<Alert severity="error" variant="outlined">
						No se pudo registar el comentario. Intente de nuevo.
					</Alert>
				);
			case FetchStatus.Fetching:
				return <CircularProgress />;
			case FetchStatus.Initial:
			default:
				return null;
		}
	}

	return (
		<Modal show={isOpen} title={"Agregar un nuevo comentario"} onClose={handleDismiss} onAccept={handleAccept} acceptEnabled={newComment?.trim() !== ""}>
			<Container>
				<TextField
					className="comments"
					label={"Comentarios"}
					disabled={!editable}
					value={newComment}
					onChange={handleCommentsChange}
					variant="standard"
					multiline
					rows={3}
					fullWidth
				/>

				{creationIndicator()}
			</Container>
		</Modal>
	);
}

export default AddComment;
