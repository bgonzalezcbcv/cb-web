describe("student", () => {
	//buttons
	const familyInfoButtonID = '[data-cy="familyInfoTab"]';
	const complementaryInfoButtonID = '[data-cy="complementaryInfoTab"]';
	const administrativeInfoButtonID = '[data-cy="administrativeInfoTab"]';
	//const editButtonID = '[data-cy="studentEditInfoButton"]';

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

	it("is enabled to edit on basicInfo", () => {
		cy.get(nameFieldID).should("not.be.disabled");
		cy.get(CIFieldID).should("not.be.disabled");
	});

	//it("is enabled to edit after edit button click", () => {
	//	cy.get(editButtonID).click();
	//
	//	cy.get(nameFieldID).should("be.enabled");
	//	cy.get(CIFieldID).should("be.enabled");
	//});

	it("loads page on family info button click", () => {
		cy.get(familyInfoButtonID).click();

		cy.get(familyCIID).should("be.visible");
	});

	// it("enables editing on family info after edit button click ", () => {
	// 	cy.get(familyInfoButtonID).click();
	// 	cy.get(editButtonID).click();

	// 	cy.get(familyCIID).should("be.enabled");
	// });

	it("loads page on complementary info button click", () => {
		cy.get(complementaryInfoButtonID).click();

		cy.get(".panel-item").should("contain.text", "Respuesta");
	});

	it("loads page on administrative info button click", () => {
		cy.get(administrativeInfoButtonID).click();

		cy.get(".administrative-info > :nth-child(1)").should("be.visible");
	});
});

export {};
