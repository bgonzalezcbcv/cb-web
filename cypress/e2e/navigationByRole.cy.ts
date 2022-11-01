/* eslint-disable @typescript-eslint/no-explicit-any */
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

	it("allows Administrativo to navigate where they need", () => {
		cy.fixture("loginUsers").then((json) => {
			const userCredentials = json.users.find((user: any) => {
				return user.role === "administrative";
			});

			cy.login(userCredentials.email, userCredentials.password);
			cy.testUserCanNavigateByRole(userCredentials.role);
		});
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

	it("allows Director to navigate where they need", () => {
		cy.fixture("loginUsers").then((json) => {
			const userCredentials = json.users.find((user: any) => {
				return user.role === "principal";
			});

			cy.login(userCredentials.email, userCredentials.password);
			cy.testUserCanNavigateByRole(userCredentials.role);
		});
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

	it("allows Recepcion to navigate where they need", () => {
		cy.fixture("loginUsers").then((json) => {
			const userCredentials = json.users.find((user: any) => {
				return user.role === "recepcionist";
			});

			cy.login(userCredentials.email, userCredentials.password);
			cy.testUserCanNavigateByRole(userCredentials.role);
		});
	});
});
export default {};
