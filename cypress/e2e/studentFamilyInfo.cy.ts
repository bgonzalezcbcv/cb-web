/* eslint-disable max-statements */
describe("studentFamilyInfo", () => {
	beforeEach(() => {
		cy.login();

		cy.wait(300);

		cy.visit("/student");
	});

	const createStudentButtonID = '[data-cy="createStudentButton"]';

	const familyInfoButtonID = '[data-cy="familyInfoTab"]';

	const errorAlertDialogID = '[data-cy="errorAlertDialog"]';

	const roleInputID = "#properties\\/role2";
	const roleErrorID = ":nth-child(1) > .MuiGrid-container > :nth-child(1) > :nth-child(2)";

	const fullNameInputID = "#properties\\/full_name2-input";
	const fullNameErrorID = "#properties\\/full_name2 > :nth-child(3)";

	const CIInputID = "#properties\\/ci2-input";
	const CIErrorID = "#properties\\/ci2 > :nth-child(3)";

	//const dateOfBirthInputID = "#properties\\/birthdate2-input";
	//TODO: find a better way to find date fields
	const dateOfBirthErrorID = ":nth-child(2) > .MuiGrid-container > :nth-child(1) > :nth-child(2)";

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

	const neighborhoodInputID = "#properties\\/neighborhood2-input";
	const neighborhoodErrorID = "#properties\\/neighborhood2 > :nth-child(3)";

	const educationLevelInputID = "#properties\\/education_level2";
	const educationLevelErrorID = ":nth-child(5) > .MuiGrid-container > :nth-child(1) > :nth-child(2)";

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

		//check first family member
		cy.get(roleInputID).click().wait(1000).get(`#properties\\/role2-option-0`).click().wait(500);
		cy.get(roleErrorID).should("not.be.visible");
		cy.testInput(fullNameInputID, fullNameErrorID, "", "Jos??", "Este campo es requerido.");
		cy.testInput(CIInputID, CIErrorID, "", "50137758", "Este campo es requerido.");
		//cy.testInput(dateOfBirthInputID, dateOfBirthErrorID, "incorrecto", "10/05/1990", "Este campo es requerido.");
		cy.get(dateOfBirthButton).click().wait(1000).get(dateOfBirthToday).click().wait(500);
		cy.get(dateOfBirthErrorID).should("not.be.visible");
		cy.testInput(maritalStatusInputID, maritalStatusErrorID, "", "Abigeato", "Este campo es requerido.");
		cy.testInput(cellphoneInputID, cellphoneErrorID, "error", "099099990", "Debe ingresar un n??mero de 9 d??gitos.");
		cy.testInput(placeOfBirthInputID, placeOfBirthErrorID, "", "Ant??rtica", "Este campo es requerido.");
		cy.testInput(nationalityInputID, nationalityErrorID, "", "Antarticano", "Este campo es requerido.");
		cy.testInput(firstLanguageInputID, firstLanguageErrorID, "", "Ping??ino", "Este campo es requerido.");
		cy.testInput(emailInputID, emailErrorID, "error", "correcto@gmail.com", "Debe ingresar un e-mail v??lido.");
		cy.testInput(addressInputID, addressErrorID, "", "Igl?? n?? 5", "Este campo es requerido.");
		cy.testInput(neighborhoodInputID, neighborhoodErrorID, "", "Punta Nieve", "Este campo es requerido.");
		cy.get(educationLevelInputID).click().wait(1000).get(`#properties\\/education_level2-option-1`).click().wait(500);
		cy.get(educationLevelErrorID).should("not.be.visible");
		cy.testInput(occupationFieldID, occupationErrorID, "", "Catador de helados", "Este campo es requerido.");
		cy.testInput(workplaceFieldID, workplaceErrorID, "", "CRUFI", "Este campo es requerido.");
		cy.testInput(workplaceAddressFieldID, workplaceAddressErrorID, "", "Calle CRUFI 123", "Este campo es requerido.");
		cy.testInput(workplaceNeighborhoodFieldID, workplaceNeighborhoodErrorID, "", "Barrio CRUFI");

		//check second family member
		cy.get("#addFamilyMember").click();
		cy.wait(200);

		cy.get(roleInputID).click().wait(1000).get(`#properties\\/role2-option-0`).click().wait(500);
		cy.get(roleErrorID).should("not.be.visible");
		cy.testInput(fullNameInputID, fullNameErrorID, "", "Jos??", "Este campo es requerido.");
		cy.testInput(CIInputID, CIErrorID, "", "50137758", "Este campo es requerido.");
		//cy.testInput(dateOfBirthInputID, dateOfBirthErrorID, "incorrecto", "10/05/1990", "Este campo es requerido.");
		cy.get(dateOfBirthButton).click().wait(1000).get(dateOfBirthToday).click().wait(500);
		cy.get(dateOfBirthErrorID).should("not.be.visible");
		cy.testInput(maritalStatusInputID, maritalStatusErrorID, "", "Abigeato", "Este campo es requerido.");
		cy.testInput(cellphoneInputID, cellphoneErrorID, "error", "099099990", "Debe ingresar un n??mero de 9 d??gitos.");
		cy.testInput(placeOfBirthInputID, placeOfBirthErrorID, "", "Ant??rtica", "Este campo es requerido.");
		cy.testInput(nationalityInputID, nationalityErrorID, "", "Antarticano", "Este campo es requerido.");
		cy.testInput(firstLanguageInputID, firstLanguageErrorID, "", "Ping??ino", "Este campo es requerido.");
		cy.testInput(emailInputID, emailErrorID, "error", "correcto@gmail.com", "Debe ingresar un e-mail v??lido.");
		cy.testInput(addressInputID, addressErrorID, "", "Igl?? n?? 5", "Este campo es requerido.");
		cy.testInput(neighborhoodInputID, neighborhoodErrorID, "", "Punta Nieve", "Este campo es requerido.");
		cy.get(educationLevelInputID).click().wait(1000).get(`#properties\\/education_level2-option-1`).click().wait(500);
		cy.get(educationLevelErrorID).should("not.be.visible");
		cy.testInput(occupationFieldID, occupationErrorID, "", "Catador de helados", "Este campo es requerido.");
		cy.testInput(workplaceFieldID, workplaceErrorID, "", "CRUFI", "Este campo es requerido.");
		cy.testInput(workplaceAddressFieldID, workplaceAddressErrorID, "", "Calle CRUFI 123", "Este campo es requerido.");
		cy.testInput(workplaceNeighborhoodFieldID, workplaceNeighborhoodErrorID, "", "Barrio CRUFI");
	});

	it("shows error when creating student if there is an error on some family info field", () => {
		cy.fillStudentBasicInfo();

		cy.get(familyInfoButtonID).click();

		cy.get(CIInputID);
		cy.get(cellphoneInputID);

		cy.get(CIInputID).should("be.empty");

		cy.get(createStudentButtonID).click();
		cy.get(errorAlertDialogID).should("be.visible");
	});

	it("allows to create a student when all the required fields in the family info are complete", () => {
		cy.fillStudentBasicInfo();
		cy.wait(500);

		cy.get(familyInfoButtonID).click();

		cy.get(fullNameInputID).clear().typeAndWait("Pedro");
		cy.get(CIInputID).clear().typeAndWait("50137758");
		cy.get(roleInputID).click().wait(1000).get(`#properties\\/role2-option-0`).click().wait(500);
		//cy.get(dateOfBirthInputID).clear().typeAndWait("01/01/1990");
		cy.get(dateOfBirthButton).click().wait(1000).get(dateOfBirthToday).click().wait(500);
		cy.get(maritalStatusInputID).clear().typeAndWait("Casado");
		cy.get(cellphoneInputID).clear().typeAndWait("099099099");
		cy.get(placeOfBirthInputID).clear().typeAndWait("Uruguay");
		cy.get(nationalityInputID).clear().typeAndWait("Uruguayo");
		cy.get(firstLanguageInputID).clear().typeAndWait("Espa??ol");
		cy.get(emailInputID).clear().typeAndWait("correcto@gmail.com");
		cy.get(addressInputID).clear().typeAndWait("Calle Falsa 2323");
		cy.get(neighborhoodInputID).clear().typeAndWait("Cerrito");
		cy.get(educationLevelInputID).click().wait(1000).get(`#properties\\/education_level2-option-1`).click().wait(500);
		cy.get(occupationFieldID).clear().typeAndWait("Panadero");
		cy.get(workplaceFieldID).clear().typeAndWait("Panader??a");
		cy.get(workplaceAddressFieldID).clear().typeAndWait("Calle Panadera 2222");
		cy.get(workplaceNeighborhoodFieldID).clear().typeAndWait("Barrio Panadero");
		cy.get(workPhoneFieldID).clear().typeAndWait("222200202");

		cy.fixture("validResponse").then((json) => {
			cy.intercept(
				{
					method: "POST", // Route all POST requests
					url: "/api/students", // that have a URL that matches '/students'
				},
				{ statusCode: 201, body: json } // and force the response to have correct status
			);
		});
		cy.get(createStudentButtonID).click();

		cy.get(errorAlertDialogID).should("not.be.visible");
	});
});

export {};
