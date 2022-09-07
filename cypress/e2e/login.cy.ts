describe("Login", () => {
	const emailFieldID = "#\\#\\/properties\\/email2-input";
	const passwordFieldID = "#\\#\\/properties\\/password2-input";
	const loginButtonID = ".MuiButton-root";

	beforeEach(() => {
		cy.visit("/login");
	});

	it("can login", () => {
		cy.get(emailFieldID).type("aa@a.a");
		cy.get(passwordFieldID).type("password");
		cy.wait(200);
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
