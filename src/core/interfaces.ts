export interface VisualComponent {
	width?: string;
	height?: string;
}

export interface Teacher {
	ci: string;
	firstName: string;
	lastName: string;
	subjects: string[];
}

export interface User {
	email: string;
	token: string;
}

export interface Question {
	id: string;
	question: string;
	answer: string;
}

export interface QuestionCategories {
	category: string;
	questions: Question[];
}

export interface Student {
	question_categories: QuestionCategories[];
}
