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

	const fullNameErrorID = "#properties\\/full_name2 > .MuiFormHelperText-root.Mui-error";

	const CIInputID = "#properties\\/ci2-input";
	const CIErrorID = "#properties\\/ci2 > .MuiFormHelperText-root.Mui-error";

	const dateOfBirthInputID = "#properties\\/birthdate2-input";
	//TODO: encontrar una manera mejor de conseguir este campo
	const dateOfBirthID = ":nth-child(2) > .MuiGrid-container > :nth-child(1) > .MuiFormControl-root";

	const maritalStatusErrorID = "#properties\\/marital_status2 > .MuiFormHelperText-root.Mui-error";

	const cellphoneInputID = "#properties\\/cellphone2-input";
	const cellphoneErrorID = "#properties\\/cellphone2 > .MuiFormHelperText-root.Mui-error";

	const placeOfBirthErrorID = "#properties\\/birthplace2 > .MuiFormHelperText-root.Mui-error";
	const nationalityErrorID = "#properties\\/nationality2 > .MuiFormHelperText-root.Mui-error";
	const firstLanguageErrorID = "#properties\\/first_language2 > .MuiFormHelperText-root.Mui-error";

	const emailInputID = "#properties\\/email2-input";
	const emailErrorID = "#properties\\/email2 > .MuiFormHelperText-root.Mui-error";

	const addressErrorID = "#properties\\/address2 > .MuiFormHelperText-root.Mui-error";
	const neighborhoodErrorID = "#properties\\/neighbourhood2 > .MuiFormHelperText-root.Mui-error";
	const educationLevelInputID = "#properties\\/education_level2 > .MuiFormHelperText-root.Mui-error";
	const occupationErrorID = "#properties\\/occupation2 > .MuiFormHelperText-root.Mui-error";
	const workplaceErrorID = "#properties\\/workplace2 > .MuiFormHelperText-root.Mui-error";
	const workplaceAddressErrorID = "#properties\\/workplace_address2 > .MuiFormHelperText-root.Mui-error";
	const workplaceNeighborhoodErrorID = "#properties\\/workplace_neighbourhood2 > .MuiFormHelperText-root.Mui-error";

	const workPhoneInputID = "#properties\\/workplace_phone2-input";
	const workPhoneErrorID = "#properties\\/workplace_phone2 > .MuiFormHelperText-root.Mui-error";

	it("does not show error messages before inputting info on any field", () => {
		cy.get(familyInfoButtonID).click();

		cy.get(fullNameErrorID).should("not.exist");
		cy.get(CIErrorID).should("not.exist");
		cy.get(maritalStatusErrorID).should("not.exist");
		cy.get(cellphoneErrorID).should("not.exist");
		cy.get(placeOfBirthErrorID).should("not.exist");
		cy.get(nationalityErrorID).should("not.exist");
		cy.get(firstLanguageErrorID).should("not.exist");
		cy.get(emailErrorID).should("not.exist");
		cy.get(addressErrorID).should("not.exist");
		cy.get(neighborhoodErrorID).should("not.exist");
		cy.get(educationLevelInputID).should("not.exist");
		cy.get(occupationErrorID).should("not.exist");
		cy.get(workplaceErrorID).should("not.exist");
		cy.get(workplaceAddressErrorID).should("not.exist");
		cy.get(workplaceNeighborhoodErrorID).should("not.exist");
		cy.get(workPhoneErrorID).should("not.exist");
	});

	it("shows error message on fields that have restrictions with an incorrect input", () => {
		cy.get(familyInfoButtonID).click();
		cy.get(studentEditInfoButton).click();

		//check first family member
		cy.testInput(CIInputID, CIErrorID, "a", "50137758", "El campo de CI no puede estar vacío.");
		cy.testInput(dateOfBirthInputID, dateOfBirthID, "incorrecto", "10/5/1990", "");
		cy.testInput(cellphoneInputID, cellphoneErrorID, "error", "099099990", "Teléfono tiene que ser un número con largo mayor a 0");
		cy.testInput(emailInputID, emailErrorID, "error", "correcto@gmail.com", "Email incorrecto");
		cy.testInput(workPhoneInputID, workPhoneErrorID, "error", "24080808", "Teléfono tiene que ser un número con largo mayor a 0");

		//check second family member
		cy.get("#addFamilyMember").click();

		cy.testInput(CIInputID, CIErrorID, "a", "50137758", "El campo de CI no puede estar vacío.");
		cy.testInput(dateOfBirthInputID, dateOfBirthID, "incorrecto", "10/5/1990", "");
		cy.testInput(cellphoneInputID, cellphoneErrorID, "error", "099099990", "Teléfono tiene que ser un número con largo mayor a 0");
		cy.testInput(emailInputID, emailErrorID, "error", "correcto@gmail.com", "Email incorrecto");
		cy.testInput(workPhoneInputID, workPhoneErrorID, "error", "24080808", "Teléfono tiene que ser un número con largo mayor a 0");
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
