/* eslint-disable max-statements */
describe("studentsBasicInfo", () => {
	const basicInfoButtonID = '[data-cy="basicInfoTab"]';
	const errorAlertDialogID = '[data-cy="errorAlertDialog"]';

	const nameFieldID = "#\\#\\/properties\\/name2-input";
	const nameFieldErrorID = "#\\#\\/properties\\/name2 > :nth-child(3)";

	const surnameFieldID = "#\\#\\/properties\\/surname2-input";
	const surnameFieldErrorID = "#\\#\\/properties\\/surname2> :nth-child(3)";

	const CIFieldID = "#\\#\\/properties\\/ci2-input";
	const CIFieldErrorID = "#\\#\\/properties\\/ci2> :nth-child(3)";

	const statusFieldID = "#\\#\\/properties\\/status2-input";
	const statusFieldErrorID = "#\\#\\/properties\\/status2> :nth-child(3)";

	const tuitionFieldID = "#\\#\\/properties\\/tuition2-input";
	const tuitionFieldErrorID = "#\\#\\/properties\\/tuition2> :nth-child(3)";

	const GroupFieldID = "#\\#\\/properties\\/group2-input";
	const GroupFieldErrorID = "#\\#\\/properties\\/group2> :nth-child(3)";

	const SubGroupFieldID = "#\\#\\/properties\\/subgroup2-input";
	const SubGroupFieldErrorID = "#\\#\\/properties\\/subgroup2> :nth-child(3)";

	//const referenceNumberFieldID = "#\\#\\/properties\\/reference_number2-input";
	//const referenceNumberFieldErrorID = "#\\#\\/properties\\/reference_number2> :nth-child(3)";

	const placeOfBirthFieldID = "#\\#\\/properties\\/birthplace2-input";
	const placeOfBirthFieldErrorID = "#\\#\\/properties\\/birthplace2> :nth-child(3)";

	//const dateOfBirthInputID = "#\\#\\/properties\\/birthdate2-input";
	//TODO: find a better way to find date fields
	//const dateOfBirthErrorID = ".MuiGrid-container > :nth-child(1) > :nth-child(2)";

	const dateOfBirthButton =
		":nth-child(4) > .MuiGrid-container > :nth-child(1) > .MuiFormControl-root > .MuiInputBase-root > .MuiInputAdornment-root > .MuiButtonBase-root";
	const dateOfBirthToday = ".MuiPickersDay-today";

	const nationalityFieldID = "#\\#\\/properties\\/nationality2-input";
	const nationalityFieldErrorID = "#\\#\\/properties\\/nationality2> :nth-child(3)";

	const firstLanguageFieldID = "#\\#\\/properties\\/first_language2-input";
	const firstLanguageFieldErrorID = "#\\#\\/properties\\/first_language2> :nth-child(3)";

	const neighborhoodFieldID = "#\\#\\/properties\\/neighborhood2-input";
	const neighborhoodFieldErrorID = "#\\#\\/properties\\/neighborhood2> :nth-child(3)";

	const addressFieldID = "#\\#\\/properties\\/address2-input";
	const addressFieldErrorID = "#\\#\\/properties\\/address2> :nth-child(3)";

	const phoneNumberFieldID = "#\\#\\/properties\\/phone_number2-input";
	const phoneNumberFieldErrorID = "#\\#\\/properties\\/phone_number2> :nth-child(3)";

	const medicalAssuranceFieldID = "#\\#\\/properties\\/medical_assurance2-input";
	const medicalAssuranceFieldErrorID = "#\\#\\/properties\\/medical_assurance2> :nth-child(3)";

	const emergencyFieldID = "#\\#\\/properties\\/emergency2-input";
	const emergencyFieldErrorID = "#\\#\\/properties\\/emergency2> :nth-child(3)";

	const vaccineExpirationInputID = "#\\#\\/properties\\/vaccine_expiration2-input";
	//TODO: find a better way to find date fields
	//const vaccineExpirationErrorID = ".MuiGrid-container > :nth-child(3) > :nth-child(2)";
	const vaccineExpirationButton =
		':nth-child(3) > .MuiFormControl-root > .MuiInputBase-root > .MuiInputAdornment-root > .MuiButtonBase-root > [data-testid="CalendarIcon"]';
	const vaccineExpirationToday = ".MuiPickersDay-today";

	const createButtonID = '[data-cy="createStudentButton"]';

	beforeEach(() => {
		cy.login();

		cy.wait(300);

		cy.visit("/student");
	});

	it("does not show error messages before inputting info on any field", () => {
		cy.get(basicInfoButtonID).click();

		cy.get(nameFieldErrorID).should("not.be.visible");
		cy.get(surnameFieldErrorID).should("not.be.visible");
		cy.get(CIFieldErrorID).should("not.be.visible");
		cy.get(statusFieldErrorID).should("not.be.visible");
		cy.get(tuitionFieldErrorID).should("not.be.visible");
		cy.get(GroupFieldErrorID).should("not.be.visible");
		cy.get(SubGroupFieldErrorID).should("not.be.visible");
		cy.get(placeOfBirthFieldErrorID).should("not.be.visible");
		cy.get(nationalityFieldErrorID).should("not.be.visible");
		cy.get(firstLanguageFieldErrorID).should("not.be.visible");
		cy.get(neighborhoodFieldErrorID).should("not.be.visible");
		cy.get(addressFieldErrorID).should("not.be.visible");
		cy.get(medicalAssuranceFieldErrorID).should("not.be.visible");
		cy.get(emergencyFieldErrorID).should("not.be.visible");
	});

	it("shows error message on fields that have restrictions with an incorrect input", () => {
		cy.get(basicInfoButtonID).click();

		//check basic data
		cy.testInput(nameFieldID, nameFieldErrorID, "", "Adam", "Este campo es requerido.");
		cy.testInput(surnameFieldID, surnameFieldErrorID, "", "Sandler", "Este campo es requerido.");
		cy.testInput(CIFieldID, CIFieldErrorID, "", "50137758", "Este campo es requerido.");
		//cy.testInput(referenceNumberFieldID, referenceNumberFieldErrorID, "e", "32", "");
		cy.testInput(placeOfBirthFieldID, placeOfBirthFieldErrorID, "", "Artigas", "Este campo es requerido.");
		//cy.testInput(dateOfBirthInputID, dateOfBirthErrorID, "", "10/5/1990", "Debe ser una fecha válida.", 0);
		cy.testInput(nationalityFieldID, nationalityFieldErrorID, "", "Uruguayo", "Este campo es requerido.");
		cy.testInput(firstLanguageFieldID, firstLanguageFieldErrorID, "", "Esperanto", "Este campo es requerido.");
		cy.testInput(neighborhoodFieldID, neighborhoodFieldErrorID, "", "La Teja", "Este campo es requerido.");
		cy.testInput(addressFieldID, addressFieldErrorID, "", "Rincón del Chorro 1212", "Este campo es requerido.");
		cy.testInput(phoneNumberFieldID, phoneNumberFieldErrorID, "error", "099123123", "Se deben ingresar 8 o 9 dígitos.");
		cy.testInput(medicalAssuranceFieldID, medicalAssuranceFieldErrorID, "", "Española", "Este campo es requerido.");
		//cy.testInput(vaccineExpirationInputID, vaccineExpirationErrorID, "incorrecto", "10/5/2022", "");
	});

	it("allows to create a student when all the required fields in the basic info are complete", () => {
		cy.get(basicInfoButtonID).click();

		cy.get(nameFieldID).clear().typeAndWait("Adam");
		cy.get(surnameFieldID).clear().typeAndWait("Sandler");
		cy.get(CIFieldID).clear().typeAndWait("11111111");
		cy.get(statusFieldID).clear().typeAndWait("Pendiente");
		cy.get(tuitionFieldID).clear().typeAndWait("Matricula buena");
		cy.get(GroupFieldID).clear().typeAndWait("3");
		cy.get(SubGroupFieldID).clear().typeAndWait("A");
		//cy.get(referenceNumberFieldID).clear().typeAndWait("42");
		cy.get(placeOfBirthFieldID).clear().typeAndWait("Asociacion Española");
		//cy.get(dateOfBirthInputID).clear().typeAndWait("01/09/2000");
		cy.get(dateOfBirthButton).click().wait(200).get(dateOfBirthToday).click().wait(200);
		cy.get(nationalityFieldID).clear().typeAndWait("Uruguayo");
		cy.get(firstLanguageFieldID).clear().typeAndWait("Español");
		cy.get(neighborhoodFieldID).clear().typeAndWait("Cordon");
		cy.get(addressFieldID).clear().typeAndWait("Guayabo 1729");
		cy.get(phoneNumberFieldID).clear().typeAndWait("25008080");
		cy.get(medicalAssuranceFieldID).clear().typeAndWait("Si tiene es la A23BVJ");
		cy.get(emergencyFieldID).clear().typeAndWait("Cooperativa ABC123XYZ");
		//cy.get(vaccineExpirationInputID).clear().typeAndWait("03/03/2019");
		cy.get(vaccineExpirationButton).click().wait(200).get(vaccineExpirationToday).click().wait(200);

		cy.fillStudentFamilyInfo();

		cy.wait(300);

		cy.get(createButtonID).click();

		cy.get(errorAlertDialogID).should("not.be.visible");
	});
});

export {};
