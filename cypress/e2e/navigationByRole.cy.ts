import { UserRole } from "../../src/core/interfaces";

describe("navigationByRole", () => {
	it("allows Administrador to navigate where they need", () => {
		//TODO: Provide user login credentials for each of the roles
		cy.login();

		cy.testUserCanNavigateByRole(UserRole.Administrador);
	});

	it("does not allow Administrador to navigate where they should not", () => {
		cy.login();

		cy.testUserShouldNotNavigateByRole(UserRole.Administrador);
	});

	it("allows Administrativo to navigate where they need", () => {
		//TODO: Provide user login credentials for each of the roles
		cy.login();

		cy.testUserCanNavigateByRole(UserRole.Administrativo);
	});

	it("does not allow Administrativo to navigate where they should not", () => {
		cy.login();

		cy.testUserShouldNotNavigateByRole(UserRole.Administrativo);
	});

	it("allows Adscripto to navigate where they need", () => {
		//TODO: Provide user login credentials for each of the roles
		cy.login();

		cy.testUserCanNavigateByRole(UserRole.Adscripto);
	});

	it("does not allow Adscripto to navigate where they should not", () => {
		cy.login();

		cy.testUserShouldNotNavigateByRole(UserRole.Adscripto);
	});

	it("allows Director to navigate where they need", () => {
		//TODO: Provide user login credentials for each of the roles
		cy.login();

		cy.testUserCanNavigateByRole(UserRole.Director);
	});

	it("does not allow Director to navigate where they should not", () => {
		cy.login();

		cy.testUserShouldNotNavigateByRole(UserRole.Director);
	});

	it("allows Docente to navigate where they need", () => {
		//TODO: Provide user login credentials for each of the roles
		cy.login();

		cy.testUserCanNavigateByRole(UserRole.Docente);
	});

	it("does not allow Docente to navigate where they should not", () => {
		cy.login();

		cy.testUserShouldNotNavigateByRole(UserRole.Docente);
	});

	it("allows Recepcion to navigate where they need", () => {
		//TODO: Provide user login credentials for each of the roles
		cy.login();

		cy.testUserCanNavigateByRole(UserRole.Recepcion);
	});

	it("does not allow Recepcion to navigate where they should not", () => {
		cy.login();

		cy.testUserShouldNotNavigateByRole(UserRole.Recepcion);
	});
});
export default {};
