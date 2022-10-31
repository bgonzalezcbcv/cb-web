/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserRole } from "../../src/core/interfaces";

describe("navigationByRole", () => {
	it("allows Administrador to navigate where they need to", () => {
		cy.fixture("loginUsers").then((json) => {
			const userCredentials = json.users.find((user: any) => {
				return user.role === "administrator";
			});

			cy.login(userCredentials.email, userCredentials.password);
			cy.testUserCanNavigateByRole(userCredentials.role);
		});
	});

	it("does not allow Administrador to navigate where they should not", () => {
		cy.login();

		cy.testUserShouldNotNavigateByRole(UserRole.Administrador);
	});

	it("allows Administrativo to navigate where they need", () => {
		cy.fixture("loginUsers").then((json) => {
			const userCredentials = json.users.find((user: any) => {
				return user.role === "administrative";
			});

			cy.login(userCredentials.email, userCredentials.password);
			cy.testUserCanNavigateByRole(userCredentials.role);
		});
	});

	it("does not allow Administrativo to navigate where they should not", () => {
		cy.login();

		cy.testUserShouldNotNavigateByRole(UserRole.Administrativo);
	});

	it("allows Adscripto to navigate where they need", () => {
		cy.fixture("loginUsers").then((json) => {
			const userCredentials = json.users.find((user: any) => {
				return user.role === "support teacher";
			});

			cy.login(userCredentials.email, userCredentials.password);
			cy.testUserCanNavigateByRole(userCredentials.role);
		});
	});

	it("does not allow Adscripto to navigate where they should not", () => {
		cy.login();

		cy.testUserShouldNotNavigateByRole(UserRole.Adscripto);
	});

	it("allows Director to navigate where they need", () => {
		cy.fixture("loginUsers").then((json) => {
			const userCredentials = json.users.find((user: any) => {
				return user.role === "principal";
			});

			cy.login(userCredentials.email, userCredentials.password);
			cy.testUserCanNavigateByRole(userCredentials.role);
		});
	});

	it("does not allow Director to navigate where they should not", () => {
		cy.login();

		cy.testUserShouldNotNavigateByRole(UserRole.Director);
	});

	it("allows Docente to navigate where they need", () => {
		cy.fixture("loginUsers").then((json) => {
			const userCredentials = json.users.find((user: any) => {
				return user.role === "teacher";
			});

			cy.login(userCredentials.email, userCredentials.password);
			cy.testUserCanNavigateByRole(userCredentials.role);
		});
	});

	it("does not allow Docente to navigate where they should not", () => {
		cy.login();

		cy.testUserShouldNotNavigateByRole(UserRole.Docente);
	});

	it("allows Recepcion to navigate where they need", () => {
		cy.fixture("loginUsers").then((json) => {
			const userCredentials = json.users.find((user: any) => {
				return user.role === "recepcionist";
			});

			cy.login(userCredentials.email, userCredentials.password);
			cy.testUserCanNavigateByRole(userCredentials.role);
		});
	});

	it("does not allow Recepcion to navigate where they should not", () => {
		cy.login();

		cy.testUserShouldNotNavigateByRole(UserRole.Recepcion);
	});
});
export default {};
