describe("studentFamilyInfo", () => {
	beforeEach(() => {
		cy.login();

		cy.wait(300);

		cy.visit("/students");
	});

	//BUTTONS
	const AdministrativeInfoButtonID = '[data-cy="administrativeInfoTab"]';
	const studentEditInfoButton = '[data-cy="studentEditInfoButton"]';

	const addPaymentMethodButtonId = ".MuiContainer-root > .MuiBox-root > .MuiButtonBase-root";
	const discountButtonId = ":nth-child(3) > .MuiPaper-root > .MuiCardContent-root > .payment-header > .MuiBox-root > .MuiButtonBase-root";
	//:nth-child(3) > .MuiPaper-root > .MuiCardContent-root > .payment-header > .MuiBox-root
	const createStudentButtonID = '[data-cy="createStudentButton"]';

	//------------------------------------------------------------------------------------------------------------------------------------------------
	const errorAlertDialogID = '[data-cy="errorAlertDialog"]';

	const roleInputID = "#properties\\/role2-input";

	//------------------------------------------------------------------------------------------------------------------------------------------------
	//DATE FORM
	const dateOfEnrollmentInputID = "##/properties/administrative_info/properties/enrollment_date2-input";
	const dateOfStartingInputID = "##/properties/administrative_info/properties/starting_date2-input";
	//const dateOfEnrollmentErrorID = "";
	//const dateOfStartingErrorID = "";

	//------------------------------------------------------------------------------------------------------------------------------------------------
	//PAYMENT METHODS SUBFORM
	const yearInputID = "##/properties/administrative_info/properties/year2-input";
	const methodID = "##/properties/administrative_info/properties/method";
	const anualPaymentInputID = "#:r13:";
	const acceptPaymentMethodButtonID = ".MuiButton-contained";

	//------------------------------------------------------------------------------------------------------------------------------------------------
	//COMENTS FORM
	const commentInputId = ".MuiCardContent-root > .MuiFormControl-root";

	//------------------------------------------------------------------------------------------------------------------------------------------------
	//DISCOUNTS SUB FORM
	const percentageInputID = "##/properties/percentage2-input";
	const explanationInputID = "##/properties/explanation2-input";
	const startingDateInputID = "##/properties/starting_date2-input";
	const endingDateInputID = "##/properties/ending_date2-input";

	it("shows error when date format is invalid", () => {});

	it("shows error when enrollment date is minor than starting date", () => {});
});

export {};
