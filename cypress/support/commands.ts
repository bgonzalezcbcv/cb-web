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
Cypress.Commands.add("login", (email = "a@a.a", password = "password") => {
	const emailFieldID = "#\\#\\/properties\\/email2-input";
	const passwordFieldID = "#\\#\\/properties\\/password2-input";
	const loginButtonID = ".MuiButton-root";

	cy.visit("/login");
	cy.wait(100);
	cy.get(emailFieldID).type(email);
	cy.get(passwordFieldID).type(password);
	cy.get(loginButtonID).click();
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
			/* drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
			dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
			visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element> */
		}
	}
}
export {};
