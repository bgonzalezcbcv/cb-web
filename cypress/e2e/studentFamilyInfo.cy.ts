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

	const errorAlertDialogID = '[data-cy="errorAlertDialog"]';

	const roleInputID = "#properties\\/role2-input";

	const fullNameErrorID = "#properties\\/full_name2 > :nth-child(3)";

	const CIInputID = "#properties\\/ci2-input";
	const CIErrorID = "#properties\\/ci2 > :nth-child(3)";

	const dateOfBirthInputID = "#properties\\/birthdate2-input";
	//TODO: find a better way to find date fields
	const dateOfBirthID = ":nth-child(2) > .MuiGrid-container > :nth-child(1) > .MuiFormControl-root";

	const maritalStatusErrorID = "#properties\\/marital_status2 > :nth-child(3)";

	const cellphoneInputID = "#properties\\/cellphone2-input";
	const cellphoneErrorID = "#properties\\/cellphone2 > :nth-child(3)";

	const placeOfBirthErrorID = "#properties\\/birthplace2 > :nth-child(3)";
	const nationalityErrorID = "#properties\\/nationality2 > :nth-child(3)";
	const firstLanguageErrorID = "#properties\\/first_language2 > :nth-child(3)";

	const emailInputID = "#properties\\/email2-input";
	const emailErrorID = "#properties\\/email2 > :nth-child(3)";

	const addressErrorID = "#properties\\/address2 > :nth-child(3)";
	const neighborhoodErrorID = "#properties\\/neighbourhood2 > :nth-child(3)";
	const occupationErrorID = "#properties\\/occupation2 > :nth-child(3)";
	const workplaceErrorID = "#properties\\/workplace2 > :nth-child(3)";
	const workplaceAddressErrorID = "#properties\\/workplace_address2 > :nth-child(3)";
	const workplaceNeighborhoodErrorID = "#properties\\/workplace_neighbourhood2 > :nth-child(3)";

	const workPhoneInputID = "#properties\\/workplace_phone2-input";
	const workPhoneErrorID = "#properties\\/workplace_phone2 > :nth-child(3)";

	it("does not show error messages before inputting info on any field", () => {
		cy.get(familyInfoButtonID).click();

		cy.get(CIInputID);
		cy.get(cellphoneInputID);

		cy.get(fullNameErrorID).should("not.be.visible");
		cy.get(CIErrorID).should("not.be.visible");
		cy.get(maritalStatusErrorID).should("not.be.visible");
		cy.get(cellphoneErrorID).should("not.be.visible");
		cy.get(placeOfBirthErrorID).should("not.be.visible");
		cy.get(nationalityErrorID).should("not.be.visible");
		cy.get(firstLanguageErrorID).should("not.be.visible");
		cy.get(emailErrorID).should("not.be.visible");
		cy.get(addressErrorID).should("not.be.visible");
		cy.get(neighborhoodErrorID).should("not.be.visible");
		cy.get(occupationErrorID).should("not.be.visible");
		cy.get(workplaceErrorID).should("not.be.visible");
		cy.get(workplaceAddressErrorID).should("not.be.visible");
		cy.get(workplaceNeighborhoodErrorID).should("not.be.visible");
		cy.get(workPhoneErrorID).should("not.be.visible");
	});

	it("shows error message on fields that have restrictions with an incorrect input", () => {
		cy.get(familyInfoButtonID).click();
		cy.get(studentEditInfoButton).click();

		//check first family member
		cy.testInput(CIInputID, CIErrorID, "", "50137758", "Se deben ingresar solo los números, sin puntos ni guiones y no puede quedar vacía");
		cy.testInput(dateOfBirthInputID, dateOfBirthID, "incorrecto", "10/5/1990", "");
		cy.testInput(cellphoneInputID, cellphoneErrorID, "error", "099099990", "Tiene que ser un número de 9 dígitos.");
		cy.testInput(emailInputID, emailErrorID, "error", "correcto@gmail.com", "Tiene que ser E-mail válido.");
		cy.testInput(workPhoneInputID, workPhoneErrorID, "error", "24080808", "Tiene que ser un número de entre 8 a 9 dígitos.");

		//check second family member
		cy.get("#addFamilyMember").click();
		cy.wait(200);

		cy.testInput(CIInputID, CIErrorID, "", "50137758", "Se deben ingresar solo los números, sin puntos ni guiones y no puede quedar vacía");
		cy.testInput(dateOfBirthInputID, dateOfBirthID, "incorrecto", "10/5/1990", "");
		cy.testInput(cellphoneInputID, cellphoneErrorID, "error", "099099990", "Tiene que ser un número de 9 dígitos.");
		cy.testInput(emailInputID, emailErrorID, "error", "correcto@gmail.com", "Tiene que ser E-mail válido.");
		cy.testInput(workPhoneInputID, workPhoneErrorID, "error", "24080808", "Tiene que ser un número de entre 8 a 9 dígitos.");
	});

	it("shows error when creating student if there is an error on some family info field", () => {
		cy.get(studentEditInfoButton).click();

		cy.fillStudentBasicInfo();

		cy.get(familyInfoButtonID).click();

		cy.get(CIInputID);
		cy.get(cellphoneInputID);

		cy.get(CIInputID).should("be.empty");

		cy.get(createStudentButtonID).click();
		cy.get(errorAlertDialogID).should("be.visible");
	});

	it("allows to create a student when all the required fields in the family info are complete", () => {
		cy.get(studentEditInfoButton).click();

		cy.fillStudentBasicInfo();

		cy.get(familyInfoButtonID).click();

		cy.get(CIInputID).clear().type("50137758");
		cy.get(roleInputID).click().get(`[data-value=Padre]`).click();
		cy.get(cellphoneInputID).clear().type("099099099");
		cy.get(emailInputID).clear().type("correcto@gmail.com");
		cy.get(workPhoneInputID).clear().type("24001313");

		cy.get(createStudentButtonID).click();

		cy.get(errorAlertDialogID).should("not.be.visible");
	});
});

export {};
