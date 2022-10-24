describe("studentFamilyInfo", () => {
	beforeEach(() => {
		cy.login();

		cy.wait(300);

		cy.visit("/student");
	});

	//BUTTONS
	const administrativeInfoButtonID = '[data-cy="administrativeInfoTab"]';
	const studentEditInfoButton = '[data-cy="studentEditInfoButton"]';

	const addPaymentMethodButtonId = ".MuiContainer-root > .MuiBox-root > .MuiButtonBase-root";

	const discountButtonId = ":nth-child(3) > .MuiPaper-root > .MuiCardContent-root > .payment-header > .MuiBox-root > .MuiButtonBase-root";

	const createStudentButtonID = '[data-cy="createStudentButton"]';

	//------------------------------------------------------------------------------------------------------------------------------------------------

	const errorAlertDialogID = '[data-cy="errorAlertDialog"]';

	//------------------------------------------------------------------------------------------------------------------------------------------------
	//DATE FORM
	const dateOfEnrollmentInputID = "#\\:r9\\:";
	const dateOfStartingInputID = "#\\:rb\\:";
	const dateOfEnrollmentErrorID = "#\\:r9\\:-helper-text";
	const dateOfStartingErrorID = "#\\:rb\\:-helper-text";

	//------------------------------------------------------------------------------------------------------------------------------------------------
	//PAYMENT METHODS SUBFORM
	const yearInputID = "#\\:r1n\\:";
	//const yearErrorID = "#\\:r1n\\:-helper-text";
	const methodID = "#\\#\\/properties\\/method2";
	//const methodErrorID = ".MuiGrid-container > :nth-child(2) > :nth-child(2)"
	const acceptPaymentMethodButtonID = ".MuiButton-contained";

	//------------------------------------------------------------------------------------------------------------------------------------------------
	//COMENTS FORM
	const commentInputID = "#\\:rd\\:";
	//------------------------------------------------------------------------------------------------------------------------------------------------
	//DISCOUNTS SUB FORM
	const percentageInputID = "#\\:r1v\\:";
	// const percentageErrorID = "#\\:r1v\\:-helper-text";
	const explanationInputID = "#\\#\\/properties\\/explanation2";
	// const explanationErrorID = ".MuiGrid-container > :nth-child(2) > :nth-child(2)";
	// const resolutionID = "#\\/properties\\/explanation3-option-1"
	const startingDiscountDateInputID = "#\\:rt\\:";
	const startingDiscountDateErrorID = "#\\:rt\\:-helper-text";
	const endingDiscountDateInputID = "#\\:rv\\:";
	const endingDiscountDateErrorID = "#\\:rv\\:-helper-text";
	const acceptDiscountButtonID = ".MuiButton-contained";
	//------------------------------------------------------------------------------------------------------------------------------------------------
	//DATE FORMATS
	it("shows error message when entrollment date format is invalid", () => {
		cy.get(administrativeInfoButtonID).click();
		cy.get(studentEditInfoButton).click();

		cy.get(dateOfEnrollmentInputID).type("1");
		cy.get(dateOfEnrollmentErrorID).should("be.visible");
	});

	it("shows error message when starting date format is invalid", () => {
		cy.get(administrativeInfoButtonID).click();
		cy.get(studentEditInfoButton).click();

		cy.get(dateOfStartingInputID).type("1");
		cy.get(dateOfStartingErrorID).should("be.visible");
	});

	it("shows error message when starting discount date format is invalid", () => {
		cy.get(administrativeInfoButtonID).click();
		cy.get(studentEditInfoButton).click();

		cy.get(discountButtonId).click();
		cy.get(explanationInputID).type("Resolución").type("{enter}");

		cy.get(startingDiscountDateInputID).type("1");
		cy.get(startingDiscountDateErrorID).should("be.visible");
	});

	it("shows error message when ending discount date format is invalid", () => {
		cy.get(administrativeInfoButtonID).click();
		cy.get(studentEditInfoButton).click();

		cy.get(discountButtonId).click();
		cy.get(explanationInputID).type("Resolución").type("{enter}");

		cy.get(endingDiscountDateInputID).type("1");
		cy.get(endingDiscountDateErrorID).should("be.visible");
	});
	//------------------------------------------------------------------------------------------------------------------------------------------------
	//DATE ORDER
	it("shows error message when enrollment date is minor than starting date", () => {
		cy.get(studentEditInfoButton).click();

		cy.fillStudentBasicInfo();

		cy.fillStudentFamilyInfo();

		cy.get(administrativeInfoButtonID).click();

		cy.get(dateOfEnrollmentInputID).type("");
		cy.get(dateOfStartingInputID).type("");

		cy.get(createStudentButtonID).click();
		cy.get(errorAlertDialogID).should("be.visible");
	});

	it("shows error message when discount starting date is minor than discount ending date", () => {
		cy.get(studentEditInfoButton).click();

		cy.fillStudentBasicInfo();

		cy.fillStudentFamilyInfo();

		cy.get(administrativeInfoButtonID).click();

		cy.get(discountButtonId).click();
		cy.get(explanationInputID).type("Resolución").type("{enter}");

		cy.get(startingDiscountDateInputID).type("");
		cy.get(endingDiscountDateInputID).type("");

		cy.get(createStudentButtonID).click();
		cy.get(errorAlertDialogID).should("be.visible");
	});
	//------------------------------------------------------------------------------------------------------------------------------------------------
	//DISABLE ACCEPT BUTTONS
	it("disable accept button if year and payment method entries are empty", () => {
		cy.get(administrativeInfoButtonID).click();
		cy.get(studentEditInfoButton).click();
		cy.get(addPaymentMethodButtonId).click();

		cy.get(acceptPaymentMethodButtonID).should("be.disabled");
	});

	it("disable accept button if date and resolution entries are empty", () => {
		cy.get(administrativeInfoButtonID).click();
		cy.get(studentEditInfoButton).click();
		cy.get(addPaymentMethodButtonId).click();

		cy.get(acceptPaymentMethodButtonID).should("be.disabled");
	});
	//------------------------------------------------------------------------------------------------------------------------------------------------
	//ALL OK
	it("allows to create a student when all the required fields in the family info are complete", () => {
		cy.get(studentEditInfoButton).click();

		cy.fillStudentBasicInfo();

		cy.fillStudentFamilyInfo();

		cy.get(administrativeInfoButtonID).click();

		cy.get(dateOfEnrollmentInputID).type("05/10/2022");
		cy.get(dateOfStartingInputID).type("05/03/2023");

		cy.get(addPaymentMethodButtonId).click();
		cy.get(yearInputID).type("2022");
		cy.get(methodID).type("Financiación").type("{enter}");
		cy.get(acceptPaymentMethodButtonID).click();

		cy.get(commentInputID).type("Sin comentarios");

		cy.get(discountButtonId).click();
		cy.get(percentageInputID).type("35");
		cy.get(explanationInputID).type("Resolución").type("{enter}");
		cy.get(startingDiscountDateInputID).type("05/10/2022");
		cy.get(endingDiscountDateInputID).type("05/10/2023");
		cy.get(acceptDiscountButtonID).click();

		cy.get(createStudentButtonID).click();

		cy.get(errorAlertDialogID).should("not.be.visible");
	});
});

export {};
