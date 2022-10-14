describe("Login", () => {
	const emailFieldID = "#\\#\\/properties\\/email2-input";
	const passwordFieldID = "#\\#\\/properties\\/password2-input";
	const loginButtonID = '[data-cy="loginButton"]';

	beforeEach(() => {
		cy.visit("/login");
	});

	it("can login", () => {
		cy.visit("/login");
		cy.wait(100);
		cy.get(emailFieldID).type("test@test.com");
		cy.get(passwordFieldID).type("password");
		cy.wait(1000);

		cy.get(loginButtonID).click();
		cy.url().should("not.include", "/login");
	});

	it("cannot login with wrong email", () => {
		cy.get(emailFieldID).type("@notEmail.com");
		cy.get(passwordFieldID).type("password");
		cy.wait(200);
		cy.get(loginButtonID).click();

		cy.url().should("include", "/login");
	});

	it("cannot login without inputting password", () => {
		cy.get(emailFieldID).type("@notEmail.com");
		cy.wait(200);
		cy.get(loginButtonID).click();

		cy.url().should("include", "/login");
	});
});

export {};
