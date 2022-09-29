/* eslint-disable max-statements */
describe("studentFamilyInfo", () => {
	beforeEach(() => {
		cy.login();

		cy.wait(300);

		cy.visit("/students");
	});

	const createStudentButtonID = '[data-cy="createStudentButton"]';

	const familyInfoButtonID = '[data-cy="familyInfoTab"]';
	const studentEditInfoButton = '[data-cy="studentEditInfoButton"]';

	const roleInputID = "#properties\\/role2-input";

	const CIInputID = "#properties\\/ci2-input";
	const CIID = "#properties\\/ci2";

	const dateOfBirthInputID = "#properties\\/birthdate2-input";
	//TODO: encontrar una manera mejor de conseguir este campo
	const dateOfBirthID = ":nth-child(2) > .MuiGrid-container > :nth-child(1) > .MuiFormControl-root";

	const cellphoneInputID = "#properties\\/cellphone2-input";
	const cellphoneID = "#properties\\/cellphone2";

	const emailInputID = "#properties\\/email2-input";
	const emailID = "#properties\\/email2";

	const workPhoneInputID = "#properties\\/workplace_phone2-input";
	const workPhoneID = "#properties\\/workplace_phone2";

	it("shows error message on fields that have restrictions with an incorrect input", () => {
		cy.get(familyInfoButtonID).click();
		cy.get(studentEditInfoButton).click();

		//check first family member
		cy.testInput(CIInputID, CIID, "a", "50137758", "El campo de CI no puede estar vacío.");
		cy.testInput(dateOfBirthInputID, dateOfBirthID, "incorrecto", "10/5/1990", "");
		cy.testInput(cellphoneInputID, cellphoneID, "error", "099099990", "Teléfono tiene que ser un número con largo mayor a 0");
		cy.testInput(emailInputID, emailID, "error", "correcto@gmail.com", "Email incorrecto");
		cy.testInput(workPhoneInputID, workPhoneID, "error", "24080808", "Teléfono tiene que ser un número con largo mayor a 0");

		//check second family member
		cy.get("#addFamilyMember").click();

		cy.testInput(CIInputID, CIID, "a", "50137758", "El campo de CI no puede estar vacío.");
		cy.testInput(dateOfBirthInputID, dateOfBirthID, "incorrecto", "10/5/1990", "");
		cy.testInput(cellphoneInputID, cellphoneID, "error", "099099990", "Teléfono tiene que ser un número con largo mayor a 0");
		cy.testInput(emailInputID, emailID, "error", "correcto@gmail.com", "Email incorrecto");
		cy.testInput(workPhoneInputID, workPhoneID, "error", "24080808", "Teléfono tiene que ser un número con largo mayor a 0");

		cy.get(workPhoneID).should("have.value", "-");
	});

	it("allows to create a student when all the required fields in the family info are complete", () => {
		const errorAlertDialogID = '[data-cy="errorAlertDialog"]';

		cy.get(studentEditInfoButton).click();

		cy.fillStudentBasicInfo();

		cy.get(familyInfoButtonID).click();

		cy.get(CIInputID).clear().type("50137758");
		cy.get(roleInputID).click().get(`[data-value=Padre]`).click();
		cy.get(cellphoneInputID).clear().type("099099099");
		cy.get(emailInputID).clear().type("correcto@gmail.com");
		cy.get(workPhoneInputID).clear().type("24001313");

		cy.get(createStudentButtonID).click();

		cy.get(errorAlertDialogID).should("not.exist");
	});
});

export {};
