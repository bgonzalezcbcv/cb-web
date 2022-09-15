export const initialStudentData = {
	question_categories: [
		{
			category: "categoria 1",
			questions: [
				{
					id: "1",
					question:
						"question 1 pero es mucho muchomuchomuchomucho muchomuchomuchomuchomucho muchomuchomuchomuchomuchomuchomucho muchomuchomuchomuchomuchomuchomuchomuchomucho mas larga para romper todo",
					answer: "answer 1a",
				},
				{
					id: "2",
					question: "question 2",
					answer: "answer 2",
				},
				{
					id: "3",
					question: "question 3",
					answer: "answer 3",
				},
			],
		},
		{
			category: "categoria 2",
			questions: [
				{
					id: "12",
					question: "question 12",
					answer: "answer 12",
				},
				{
					id: "22",
					question: "question 22",
					answer: "answer 22",
				},
				{
					id: "32",
					question: "question 32",
					answer: "answer 32",
				},
			],
		},
	],
};

export const expectedNewStudentData = {
	question_categories: [
		{
			category: "categoria 1",
			questions: [
				{
					id: "1",
					question:
						"question 1 pero es mucho muchomuchomuchomucho muchomuchomuchomuchomucho muchomuchomuchomuchomuchomuchomucho muchomuchomuchomuchomuchomuchomuchomuchomucho mas larga para romper todo",
					answer: "answer 1anew",
				},
				{
					id: "2",
					question: "question 2",
					answer: "answer 2",
				},
				{
					id: "3",
					question: "question 3",
					answer: "answer 3",
				},
			],
		},
		{
			category: "categoria 2",
			questions: [
				{
					id: "12",
					question: "question 12",
					answer: "answer 12",
				},
				{
					id: "22",
					question: "question 22",
					answer: "answer 22",
				},
				{
					id: "32",
					question: "question 32",
					answer: "answer 32",
				},
			],
		},
	],
};
