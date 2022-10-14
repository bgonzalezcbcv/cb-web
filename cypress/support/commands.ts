/* eslint-disable max-statements */
/// <reference types="cypress" />

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
Cypress.Commands.add("login", (email = "test@test.com", password = "password") => {
	const emailFieldID = "#\\#\\/properties\\/email2-input";
	const passwordFieldID = "#\\#\\/properties\\/password2-input";
	const loginButtonID = '[data-cy="loginButton"]';

	cy.session([email, password], () => {
		cy.visit("/login");
		cy.wait(100);
		cy.get(emailFieldID).type(email);
		cy.get(passwordFieldID).type(password);
		cy.wait(1000);

		cy.get(loginButtonID).click();

		cy.url().should("not.contain", "/login");
		cy.window().its("sessionStorage").invoke("getItem", "store").should("exist");
	});
});

Cypress.Commands.add("fillStudentBasicInfo", () => {
	const basicInfoButtonID = '[data-cy="basicInfoTab"]';

	const nameFieldID = "#\\#\\/properties\\/name2-input";
	const surnameFieldID = "#\\#\\/properties\\/surname2-input";
	const CIFieldID = "#\\#\\/properties\\/ci2-input";
	const statusFieldID = "#\\#\\/properties\\/status2-input";
	const tuitionFieldID = "#\\#\\/properties\\/tuition2-input";
	const referenceNumberFieldID = "#\\#\\/properties\\/reference_number2-input";
	const placeOfBirthFieldID = "#\\#\\/properties\\/birthplace2-input";
	const dateOfBirthInputID = "#\\#\\/properties\\/birthdate2-input";
	const nationalityFieldID = "#\\#\\/properties\\/nationality2-input";
	const firstLanguageFieldID = "#\\#\\/properties\\/first_language2-input";
	const neighborhoodFieldID = "#\\#\\/properties\\/neighborhood2-input";
	const addressFieldID = "#\\#\\/properties\\/address2-input";
	const phoneNumberFieldID = "#\\#\\/properties\\/phone_number2-input";
	const medicalAssuranceFieldID = "#\\#\\/properties\\/medical_assurance2-input";
	const emergencyFieldID = "#\\#\\/properties\\/emergency2-input";
	const vaccineExpirationInputID = "#\\#\\/properties\\/vaccine_expiration2-input";

	cy.get(basicInfoButtonID).click();

	cy.fixture("studentBasicInfo").then((student) => {
		cy.get(nameFieldID).clear().type(student.name);
		cy.get(surnameFieldID).clear().type(student.surname);
		cy.get(CIFieldID).clear().type(student.ci);
		cy.get(statusFieldID).clear().type(student.status);
		cy.get(tuitionFieldID).clear().type(student.tuition);
		cy.get(referenceNumberFieldID).clear().type(student.referenceNumber);
		cy.get(placeOfBirthFieldID).clear().type(student.birthplace);
		cy.get(dateOfBirthInputID).clear().type(student.birthDate);
		cy.get(nationalityFieldID).clear().type(student.nationality);
		cy.get(firstLanguageFieldID).clear().type(student.firstLanguage);
		cy.get(neighborhoodFieldID).clear().type(student.neighborhood);
		cy.get(addressFieldID).clear().type(student.address);
		cy.get(phoneNumberFieldID).clear().type(student.phoneNumber);
		cy.get(medicalAssuranceFieldID).clear().type(student.medicalAssurance);
		cy.get(emergencyFieldID).clear().type(student.emergency);
		cy.get(vaccineExpirationInputID).clear().type(student.expirationDate);
	});
});

Cypress.Commands.add("fillStudentFamilyInfo", () => {
	const familyInfoButtonID = '[data-cy="familyInfoTab"]';

	const roleInputID = "#properties\\/role2-input";
	const fullNameFieldID = "#properties\\/full_name2-input";
	const CIFieldID = "#properties\\/ci2-input";
	const dateOfBirthInputID = "#properties\\/birthdate2-input";
	const maritalStatusFieldID = "#properties\\/marital_status2-input";
	const cellphoneFieldID = "#properties\\/cellphone2-input";
	const placeOfBirthFieldID = "#properties\\/birthplace2-input";
	const nationalityFieldID = "#properties\\/nationality2-input";
	const firstLanguageFieldID = "#properties\\/first_language2-input";
	const emailFieldID = "#properties\\/email2-input";
	const addressFieldID = "#properties\\/address2-input";
	const neighborhoodFieldID = "#properties\\/neighbourhood2-input";
	const educationLevelInputID = "#properties\\/education_level2-input";
	const occupationFieldID = "#properties\\/occupation2-input";
	const workplaceFieldID = "#properties\\/workplace2-input";
	const workplaceAddressFieldID = "#properties\\/workplace_address2-input";
	const workplaceNeighborhoodFieldID = "#properties\\/workplace_neighbourhood2-input";
	const workPhoneFieldID = "#properties\\/workplace_phone2-input";

	cy.get(familyInfoButtonID).click();

	cy.fixture("familyMember1Info").then((familyMember) => {
		cy.get(roleInputID).click().get(`[data-value="${familyMember.role}"]`).click();
		cy.get(fullNameFieldID).clear().type(familyMember.fullName);
		cy.get(CIFieldID).clear().type(familyMember.ci);
		cy.get(dateOfBirthInputID).clear().type(familyMember.birthDate);
		cy.get(maritalStatusFieldID).clear().type(familyMember.maritalStatus);
		cy.get(cellphoneFieldID).clear().type(familyMember.cellphone);
		cy.get(placeOfBirthFieldID).clear().type(familyMember.birthplace);
		cy.get(nationalityFieldID).clear().type(familyMember.nationality);
		cy.get(firstLanguageFieldID).clear().type(familyMember.firstLanguage);
		cy.get(emailFieldID).clear().type(familyMember.email);
		cy.get(addressFieldID).clear().type(familyMember.address);
		cy.get(neighborhoodFieldID).clear().type(familyMember.neighborhood);
		cy.get(educationLevelInputID).click().get(`[data-value='${familyMember.educationLevel}']`).click();
		cy.get(occupationFieldID).clear().type(familyMember.occupation);
		cy.get(workplaceFieldID).clear().type(familyMember.workplace);
		cy.get(workplaceAddressFieldID).clear().type(familyMember.workplaceAddress);
		cy.get(workplaceNeighborhoodFieldID).clear().type(familyMember.workplaceNeighbourhood);
		cy.get(workPhoneFieldID).clear().type(familyMember.workplacePhone);
	});
});

Cypress.Commands.add("testInput", (inputID: string, errorLabelID: string, incorrectInput: string, correctInput: string, errorMessage?: string) => {
	const input = cy.get(inputID);
	const errorLabel = cy.get(errorLabelID);

	input.clear();

	if (incorrectInput) {
		input.type(incorrectInput);
	}

	if (errorMessage) {
		cy.get(errorLabelID).should("have.text", errorMessage);
	}

	input.clear().type(correctInput);
	if (errorMessage) errorLabel.should("not.contain", errorMessage);
	cy.wait(100);
});

//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
declare global {
	namespace Cypress {
		interface Chainable {
			login(email?: string, password?: string): Chainable<void>;
			fillStudentBasicInfo(): Chainable<void>;
			fillStudentFamilyInfo(): Chainable<void>;
			testInput(inputID: string, errorLabelID: string, incorrectInput: string, correctInput: string, errorMessage?: string): Chainable<void>;
			/* drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
			dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
			visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element> */
		}
	}
}
export {};
