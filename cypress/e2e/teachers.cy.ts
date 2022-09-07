describe("Teachers", () => {
	const teacherFirstNameInputID = "#\\#\\/properties\\/firstName2-input";
	const teacherLastNameInputID = "#\\#\\/properties\\/lastName2-input";
	const addSubjectButtonID = ".MuiTableCell-alignRight > .MuiButtonBase-root";
	const newSubjectNameInputID = ".MuiTableBody-root > :nth-child(1) > :nth-child(1) > .MuiInputBase-root > .MuiInputBase-input";
	const deleteSubjectButtonID =
		':nth-child(1) > [style="width: 50px; height: 50px; padding-left: 0px; padding-right: 0px; text-align: center;"] > .MuiGrid-container > .MuiGrid-root > .MuiButtonBase-root';
	const addNewTeacherButtonID = ".MuiPaper-root > .MuiButton-root";
	const tableFirstNameAt0ID = '[data-id="0"] > [data-field="firstName"]';
	const tableLastNameAt0ID = '[data-id="0"] > [data-field="lastName"]';
	const tableSubjectsAt0ID = '[data-id="0"] > [data-field="subjects"]';

	beforeEach(() => {
		cy.login();

		cy.wait(500);

		cy.visit("/teachers");
	});

	it("loads page", () => {
		cy.get(teacherFirstNameInputID).should("be.visible");
	});

	it("can type on fields and add subject", () => {
		cy.get(teacherFirstNameInputID).type("lelelle");
		cy.get(teacherLastNameInputID).type("lululu");
		cy.get(addSubjectButtonID).click();
		cy.get(newSubjectNameInputID).type("jasldj");
		cy.get(deleteSubjectButtonID).click();
	});

	it("can add teacher successfully and it is added to the list", () => {
		cy.get(teacherFirstNameInputID).type("Roberto Rigoberto");
		cy.get(teacherLastNameInputID).type("Rodriguez Ramos");
		cy.get(addSubjectButtonID).click();
		cy.get(newSubjectNameInputID).type("Matemáticas");
		//TODO: the next wait is needed so that the state has been updated and the subjects are added. There should be another way of doing this
		cy.wait(500);
		cy.get(addNewTeacherButtonID).click();

		cy.get(tableFirstNameAt0ID).contains("Roberto Rigoberto");
		cy.get(tableLastNameAt0ID).contains("Rodriguez Ramos");
		cy.get(tableSubjectsAt0ID).contains("Matemáticas");
	});
});

export {};
