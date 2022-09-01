describe("login", () => {
	it("can login", () => {
		cy.visit("/login");
		cy.wait(100);
		cy.get("#root_email").type("aa@a.a");
		cy.get("#root_password").type("password");
		cy.get(".MuiButtonBase-root").click();
	});
});

export {};
