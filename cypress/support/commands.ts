/* eslint-disable max-statements */
/// <reference types="cypress" />

import { SidebarItem, SidebarSection, UserRole } from "../../src/core/interfaces";
import { getSidebarSectionsByUser } from "../../src/core/userRoleHelper";

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
	//const referenceNumberFieldID = "#\\#\\/properties\\/reference_number2-input";
	const placeOfBirthFieldID = "#\\#\\/properties\\/birthplace2-input";
	//const dateOfBirthInputID = "#\\#\\/properties\\/birthdate2-input";
	const dateOfBirthButton =
		":nth-child(4) > .MuiGrid-container > :nth-child(1) > .MuiFormControl-root > .MuiInputBase-root > .MuiInputAdornment-root > .MuiButtonBase-root";
	const dateOfBirthToday = ".MuiPickersDay-today";
	const nationalityFieldID = "#\\#\\/properties\\/nationality2-input";
	const firstLanguageFieldID = "#\\#\\/properties\\/first_language2-input";
	const neighborhoodFieldID = "#\\#\\/properties\\/neighborhood2-input";
	const addressFieldID = "#\\#\\/properties\\/address2-input";
	const phoneNumberFieldID = "#\\#\\/properties\\/phone_number2-input";
	const medicalAssuranceFieldID = "#\\#\\/properties\\/medical_assurance2-input";
	const emergencyFieldID = "#\\#\\/properties\\/emergency2-input";
	//const vaccineExpirationInputID = "#\\#\\/properties\\/vaccine_expiration2-input";
	const vaccineExpirationButton =
		':nth-child(3) > .MuiFormControl-root > .MuiInputBase-root > .MuiInputAdornment-root > .MuiButtonBase-root > [data-testid="CalendarIcon"]';
	const vaccineExpirationToday = ".MuiPickersDay-today";

	cy.get(basicInfoButtonID).click();

	cy.fixture("studentBasicInfo").then((student) => {
		cy.get(nameFieldID).clear().typeAndWait(student.name);
		cy.get(surnameFieldID).clear().typeAndWait(student.surname);
		cy.get(CIFieldID).clear().typeAndWait(student.ci);
		cy.get(statusFieldID).clear().typeAndWait(student.status);
		cy.get(tuitionFieldID).clear().typeAndWait(student.tuition);
		//cy.get(referenceNumberFieldID).clear().typeAndWait(student.referenceNumber);
		cy.get(placeOfBirthFieldID).clear().typeAndWait(student.birthplace);
		//cy.get(dateOfBirthInputID).clear().typeAndWait(student.birthDate);
		cy.get(dateOfBirthButton).click().wait(200).get(dateOfBirthToday).click().wait(200);
		cy.get(nationalityFieldID).clear().typeAndWait(student.nationality);
		cy.get(firstLanguageFieldID).clear().typeAndWait(student.firstLanguage);
		cy.get(neighborhoodFieldID).clear().typeAndWait(student.neighborhood);
		cy.get(addressFieldID).clear().typeAndWait(student.address);
		cy.get(phoneNumberFieldID).clear().typeAndWait(student.phoneNumber);
		cy.get(medicalAssuranceFieldID).clear().typeAndWait(student.medicalAssurance);
		cy.get(emergencyFieldID).clear().typeAndWait(student.emergency);
		//cy.get(vaccineExpirationInputID).clear().typeAndWait(student.expirationDate);
		cy.get(vaccineExpirationButton).click().wait(200).get(vaccineExpirationToday).click().wait(200);
	});
});

Cypress.Commands.add("fillStudentFamilyInfo", () => {
	const familyInfoButtonID = '[data-cy="familyInfoTab"]';

	const roleInputID = "#properties\\/role2";
	const fullNameFieldID = "#properties\\/full_name2-input";
	const CIFieldID = "#properties\\/ci2-input";
	//const dateOfBirthInputID = "#properties\\/birthdate2-input";
	const dateOfBirthButton =
		'.MuiGrid-container > :nth-child(1) > .MuiFormControl-root > .MuiInputBase-root > .MuiInputAdornment-root > .MuiButtonBase-root > [data-testid="CalendarIcon"]';
	const dateOfBirthToday = ".MuiPickersDay-today";
	const maritalStatusFieldID = "#properties\\/marital_status2-input";
	const cellphoneFieldID = "#properties\\/cellphone2-input";
	const placeOfBirthFieldID = "#properties\\/birthplace2-input";
	const nationalityFieldID = "#properties\\/nationality2-input";
	const firstLanguageFieldID = "#properties\\/first_language2-input";
	const emailFieldID = "#properties\\/email2-input";
	const addressFieldID = "#properties\\/address2-input";
	const neighborhoodFieldID = "#properties\\/neighborhood2-input";
	const educationLevelInputID = "#properties\\/education_level2";
	const occupationFieldID = "#properties\\/occupation2-input";
	const workplaceFieldID = "#properties\\/workplace2-input";
	const workplaceAddressFieldID = "#properties\\/workplace_address2-input";
	const workplaceNeighborhoodFieldID = "#properties\\/workplace_neighbourhood2-input";
	const workPhoneFieldID = "#properties\\/workplace_phone2-input";

	cy.get(familyInfoButtonID).click();

	cy.fixture("familyMember1Info").then((familyMember) => {
		cy.get(roleInputID).click().wait(500).get(`#properties\\/role2-option-0`).click().wait(200);
		cy.wait(200);
		cy.get(fullNameFieldID).clear().typeAndWait(familyMember.fullName);
		cy.get(CIFieldID).clear().typeAndWait(familyMember.ci);
		//cy.get(dateOfBirthInputID).clear().typeAndWait(familyMember.birthDate);
		cy.get(dateOfBirthButton).click().wait(200).get(dateOfBirthToday).click().wait(200);
		cy.get(maritalStatusFieldID).clear().typeAndWait(familyMember.maritalStatus);
		cy.get(cellphoneFieldID).clear().typeAndWait(familyMember.cellphone);
		cy.get(placeOfBirthFieldID).clear().typeAndWait(familyMember.birthplace);
		cy.get(nationalityFieldID).clear().typeAndWait(familyMember.nationality);
		cy.get(firstLanguageFieldID).clear().typeAndWait(familyMember.firstLanguage);
		cy.get(emailFieldID).clear().typeAndWait(familyMember.email);
		cy.get(addressFieldID).clear().typeAndWait(familyMember.address);
		cy.get(neighborhoodFieldID).clear().typeAndWait(familyMember.neighborhood);
		cy.get(educationLevelInputID).click().wait(500).get(`#properties\\/education_level2-option-1`).click();
		cy.wait(100);
		cy.get(occupationFieldID).clear().typeAndWait(familyMember.occupation);
		cy.get(workplaceFieldID).clear().typeAndWait(familyMember.workplace);
		cy.get(workplaceAddressFieldID).clear().typeAndWait(familyMember.workplaceAddress);
		cy.get(workplaceNeighborhoodFieldID).clear().typeAndWait(familyMember.workplaceNeighbourhood);
		cy.get(workPhoneFieldID).clear().typeAndWait(familyMember.workplacePhone);
	});
});

Cypress.Commands.add("testInput", (inputID: string, errorLabelID: string, incorrectInput: string, correctInput: string, errorMessage?: string) => {
	const input = cy.get(inputID);
	const errorLabel = cy.get(errorLabelID);

	input.clear();

	if (incorrectInput) {
		input.type(incorrectInput);
		cy.wait(100);
	}

	if (errorMessage) {
		cy.get(errorLabelID).should("have.text", errorMessage);
	}

	input.clear().type(correctInput);
	cy.wait(300);
	if (errorMessage) errorLabel.should("not.contain", errorMessage);
	cy.wait(100);
});

Cypress.Commands.add("testUserCanNavigateByRole", (userRole: string) => {
	/*TODO: Get the routes from a better source, as this only includes routes that are available in the apps' sidebar.*/

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const loggedUser = JSON.parse(sessionStorage.getItem("store") as any).loggedUser;

	const loggedUserId = loggedUser.id;

	cy.fixture("routesByUserRole").then((json) => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const selectedRoleRoutes = json.routesByRole.find((routes: any) => {
			return routes.role === userRole;
		});

		const { allRoutes, ownRoutes, personalRoutes } = selectedRoleRoutes;

		cy.log("testing personalRoutes");
		let routesToTest: string[] = personalRoutes;
		cy.log(personalRoutes);
		cy.log(routesToTest.toString());

		cy.log(routesToTest.toString());

		for (const route of routesToTest) {
			const routeWithId = route.replace("$id", loggedUserId);

			cy.log(`visiting ${routeWithId}`);
			cy.visit(routeWithId);
			cy.url().should("eq", Cypress.config().baseUrl + routeWithId);
		}

		cy.log("testing ownRoutes");
		routesToTest = routesToTest.concat(ownRoutes);

		for (const route of routesToTest) {
			const routeWithId = route.replace("$id", loggedUserId);

			cy.log(`visiting ${routeWithId}`);
			cy.visit(routeWithId);
			cy.url().should("eq", Cypress.config().baseUrl + routeWithId);
		}

		cy.log("testing allRoutes");
		routesToTest = routesToTest.concat(allRoutes);

		for (const route of routesToTest) {
			const routeWithId = route.replace("$id", loggedUserId);

			cy.log(`visiting ${routeWithId}`);
			cy.visit(routeWithId);
			cy.url().should("eq", Cypress.config().baseUrl + routeWithId);
		}
	});
});

Cypress.Commands.add("testUserShouldNotNavigateByRole", (userRole: UserRole) => {
	/*TODO: Get the routes from a better source, as this only includes routes that are available in the apps' sidebar.*/
	let allRoutesByRole: string[] = [];
	for (const role of Object.values(UserRole).filter((a) => !isNaN(Number(a)))) {
		cy.log(role.toString());
		const routesByRole: string[] = getSidebarSectionsByUser({ email: "", name: "", role: role as UserRole, surname: "", token: "" })
			.map((sidebarSection: SidebarSection) => {
				return sidebarSection.items.map((sidebarSectionItem: SidebarItem) => {
					return sidebarSectionItem.navigationRoute;
				});
			})
			.flat();
		allRoutesByRole = allRoutesByRole.concat(routesByRole);
	}

	allRoutesByRole = allRoutesByRole.filter((route: string, index: number) => {
		return allRoutesByRole.indexOf(route) === index;
	});

	cy.log(allRoutesByRole.toString());

	let userRoleRoutes: string[] = getSidebarSectionsByUser({ email: "", name: "", role: userRole, surname: "", token: "" })
		.map((sidebarSection: SidebarSection) => {
			return sidebarSection.items.map((sidebarSectionItem: SidebarItem) => {
				return sidebarSectionItem.navigationRoute;
			});
		})
		.flat();

	userRoleRoutes = userRoleRoutes.filter((route: string, index: number) => {
		return userRoleRoutes.indexOf(route) === index;
	});

	cy.log(userRoleRoutes.toString());

	allRoutesByRole.filter((route) => {
		return userRoleRoutes.indexOf(route) === -1;
	});

	cy.log(`routes that will be tested: ${allRoutesByRole.toString()}`);

	for (const route of allRoutesByRole) {
		cy.visit(route);
		cy.url().should("not.include", route);
	}
});

//
//
// -- This is a child command --
Cypress.Commands.add("typeAndWait", { prevSubject: "element" }, (subject, input) => {
	cy.wrap(subject).type(input);
	cy.wait(100);
});
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
			typeAndWait(input: string): Chainable<Element>;
			testUserCanNavigateByRole(userRole: string): Chainable<void>;
			testUserShouldNotNavigateByRole(userRole: UserRole): Chainable<void>;
			/* drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
			dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
			visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element> */
		}
	}
}
export {};
