describe("Students", () => {
	//buttons
	const familyInfoButtonID = ".MuiTabs-flexContainer > :nth-child(2)";
	const editButtonID = ".css-zi9jgv > :nth-child(2) > :nth-child(2)";

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

	it("is disabled to edit", () => {
		cy.get(nameFieldID).should("be.disabled");
		cy.get(CIFieldID).should("be.disabled");
	});

	it("after edit button click is enabled to edit", () => {
		cy.get(editButtonID).click();
		cy.get(nameFieldID).should("be.enabled");
		cy.get(CIFieldID).should("be.enabled");
	});

	it("click on family info button loads page", () => {
		cy.get(familyInfoButtonID).click();
		cy.get(familyCIID).should("be.visible");
	});

	it("after edit button click is enabled to edit on family info", () => {
		cy.get(familyInfoButtonID).click();
		cy.get(editButtonID).click();
		cy.get(familyCIID).should("be.enabled");
	});
});

export {};
