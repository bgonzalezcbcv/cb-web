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

	const roleInputID = "#properties\\/role2";

	const fullNameInputID = "#properties\\/full_name2-input";
	const fullNameErrorID = "#properties\\/full_name2 > :nth-child(3)";

	const CIInputID = "#properties\\/ci2-input";
	const CIErrorID = "#properties\\/ci2 > :nth-child(3)";

	//const dateOfBirthInputID = "#properties\\/birthdate2-input";
	//TODO: find a better way to find date fields
	//const dateOfBirthErrorID = ".MuiGrid-container > :nth-child(1) > :nth-child(2)";

	const dateOfBirthButton =
		'.MuiGrid-container > :nth-child(1) > .MuiFormControl-root > .MuiInputBase-root > .MuiInputAdornment-root > .MuiButtonBase-root > [data-testid="CalendarIcon"]';
	const dateOfBirthToday = ".MuiPickersDay-today";

	const maritalStatusInputID = "#properties\\/marital_status2-input";
	const maritalStatusErrorID = "#properties\\/marital_status2 > :nth-child(3)";

	const cellphoneInputID = "#properties\\/cellphone2-input";
	const cellphoneErrorID = "#properties\\/cellphone2 > :nth-child(3)";

	const placeOfBirthInputID = "#properties\\/birthplace2-input";
	const placeOfBirthErrorID = "#properties\\/birthplace2 > :nth-child(3)";

	const nationalityInputID = "#properties\\/nationality2-input";
	const nationalityErrorID = "#properties\\/nationality2 > :nth-child(3)";

	const firstLanguageInputID = "#properties\\/first_language2-input";
	const firstLanguageErrorID = "#properties\\/first_language2 > :nth-child(3)";

	const emailInputID = "#properties\\/email2-input";
	const emailErrorID = "#properties\\/email2 > :nth-child(3)";

	const addressInputID = "#properties\\/address2-input";
	const addressErrorID = "#properties\\/address2 > :nth-child(3)";

	const neighborhoodInputID = "#properties\\/neighbourhood2-input";
	const neighborhoodErrorID = "#properties\\/neighbourhood2 > :nth-child(3)";

	const educationLevelInputID = "#properties\\/education_level2";

	const occupationFieldID = "#properties\\/occupation2-input";
	const occupationErrorID = "#properties\\/occupation2 > :nth-child(3)";

	const workplaceFieldID = "#properties\\/workplace2-input";
	const workplaceErrorID = "#properties\\/workplace2 > :nth-child(3)";

	const workplaceAddressFieldID = "#properties\\/workplace_address2-input";
	const workplaceAddressErrorID = "#properties\\/workplace_address2 > :nth-child(3)";

	const workplaceNeighborhoodFieldID = "#properties\\/workplace_neighbourhood2-input";
	const workplaceNeighborhoodErrorID = "#properties\\/workplace_neighbourhood2 > :nth-child(3)";

	const workPhoneFieldID = "#properties\\/workplace_phone2-input";
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
		cy.testInput(CIInputID, CIErrorID, "", "50137758", "Este campo es requerido.");
		//cy.testInput(dateOfBirthInputID, dateOfBirthErrorID, "incorrecto", "10/05/1990", "Este campo es requerido.");
		cy.testInput(cellphoneInputID, cellphoneErrorID, "error", "099099990", "Debe ingresar un número de 9 dígitos.");
		cy.testInput(emailInputID, emailErrorID, "error", "correcto@gmail.com", "Debe ingresar un e-mail válido.");
		cy.testInput(workPhoneFieldID, workPhoneErrorID, "error", "24080808", "Debe ingresar un número de entre 8 a 9 dígitos.");

		//check second family member
		cy.get("#addFamilyMember").click();
		cy.wait(200);

		cy.testInput(CIInputID, CIErrorID, "", "50137758", "Este campo es requerido.");
		//cy.testInput(dateOfBirthInputID, dateOfBirthErrorID, "incorrecto", "10-05-1990", "Este campo es requerido.");
		cy.testInput(cellphoneInputID, cellphoneErrorID, "error", "099099990", "Debe ingresar un número de 9 dígitos.");
		cy.testInput(emailInputID, emailErrorID, "error", "correcto@gmail.com", "Debe ingresar un e-mail válido.");
		cy.testInput(workPhoneFieldID, workPhoneErrorID, "error", "24080808", "Debe ingresar un número de entre 8 a 9 dígitos.");
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
		cy.wait(500);

		cy.get(familyInfoButtonID).click();

		cy.get(fullNameInputID).clear().typeAndWait("Pedro");
		cy.get(CIInputID).clear().typeAndWait("50137758");
		cy.get(roleInputID).click().wait(500).get(`#properties\\/role2-option-0`).click().wait(200);
		//cy.get(dateOfBirthInputID).clear().typeAndWait("01/01/1990");
		cy.get(dateOfBirthButton).click().wait(200).get(dateOfBirthToday).click().wait(200);
		cy.get(maritalStatusInputID).clear().typeAndWait("Casado");
		cy.get(cellphoneInputID).clear().typeAndWait("099099099");
		cy.get(placeOfBirthInputID).clear().typeAndWait("Uruguay");
		cy.get(nationalityInputID).clear().typeAndWait("Uruguayo");
		cy.get(firstLanguageInputID).clear().typeAndWait("Español");
		cy.get(emailInputID).clear().typeAndWait("correcto@gmail.com");
		cy.get(addressInputID).clear().typeAndWait("Calle Falsa 2323");
		cy.get(neighborhoodInputID).clear().typeAndWait("Cerrito");
		cy.get(educationLevelInputID).click().wait(500).get(`#properties\\/education_level2-option-1`).click().wait(200);
		cy.get(occupationFieldID).clear().typeAndWait("Panadero");
		cy.get(workplaceFieldID).clear().typeAndWait("Panadería");
		cy.get(workplaceAddressFieldID).clear().typeAndWait("Calle Panadera 2222");
		cy.get(workplaceNeighborhoodFieldID).clear().typeAndWait("Barrio Panadero");
		cy.get(workPhoneFieldID).clear().typeAndWait("222200202");

		cy.get(createStudentButtonID).click();

		cy.get(errorAlertDialogID).should("not.be.visible");
	});
});

export {};
