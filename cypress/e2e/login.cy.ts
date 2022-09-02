describe("Login", () => {
	beforeEach(() => {
		cy.visit("/login");
	});

	it("can login", () => {
		cy.get("#root_email").type("aa@a.a");
		cy.get("#root_password").type("password");
		cy.get("#login-submit").click();

		cy.url().should("not.include", "/login");
	});

	it("cannot login with wrong email", () => {
		cy.get("#root_email").type("@notEmail.com");
		cy.get("#root_password").type("password");
		cy.get("#login-submit").click();

		cy.url().should("include", "/login");
	});

	it("cannot login without introducing password", () => {
		cy.get("#root_email").type("@notEmail.com");
		cy.get("#login-submit").click();

		cy.url().should("include", "/login");
	});
});

export {};
