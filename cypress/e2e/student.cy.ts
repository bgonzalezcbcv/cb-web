describe("student", () => {
	//buttons
	const familyInfoButtonID = '[data-cy="familyInfoTab"]';
	const editButtonID = '[data-cy="studentEditInfoButton"]';

	//student
	const nameFieldID = "#\\#\\/properties\\/name2-input";
	const CIFieldID = "#\\#\\/properties\\/ci2-input";

	//family
	const familyCIID = "#properties\\/ci2-input";

	beforeEach(() => {
		cy.login();

		cy.wait(300);

		cy.visit("/student");
	});

	it("loads page", () => {
		cy.get(nameFieldID).should("be.visible");
	});

	it("is disabled to edit on basicInfo", () => {
		cy.get(nameFieldID).should("be.disabled");
		cy.get(CIFieldID).should("be.disabled");
	});

	it("is enabled to edit after edit button click", () => {
		cy.get(editButtonID).click();

		cy.get(nameFieldID).should("be.enabled");
		cy.get(CIFieldID).should("be.enabled");
	});

	it("loads page on family info button click", () => {
		cy.get(familyInfoButtonID).click();

		cy.get(familyCIID).should("be.visible");
	});

	it("enables editing on family info after edit button click ", () => {
		cy.get(familyInfoButtonID).click();
		cy.get(editButtonID).click();

		cy.get(familyCIID).should("be.enabled");
	});
});

export {};
