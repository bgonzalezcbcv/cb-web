describe("Login", () => {
	const emailFieldID = "#\\#\\/properties\\/email2-input";
	const passwordFieldID = "#\\#\\/properties\\/password2-input";
	const loginButtonID = '[data-cy="loginButton"]';
	const alertID = '[data-cy="alert"]';

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
		cy.get(loginButtonID).should("be.disabled");

		cy.url().should("include", "/login");
	});

	it("cannot login without inputting password", () => {
		cy.get(emailFieldID).type("@notEmail.com");
		cy.wait(200);
		cy.get(loginButtonID).should("be.disabled");
	});

	it("cannot login with wrong credentials", () => {
		cy.intercept(
			{
				method: "POST", // Route all POST requests
				url: "/api/sign_in/", // that have a URL that matches '/students'
			},
			{ statusCode: 401 } // and force the response to have correct status
		);

		cy.get(emailFieldID).type("aaaaa@notEmail.com");
		cy.get(passwordFieldID).type("password");
		cy.wait(200);

		cy.get(loginButtonID).should("be.enabled").click();

		cy.get(alertID).should("be.visible").should("contain.text", "Usuario o contraseña inválidos");
	});

	it("can login as all the test users", () => {
		cy.fixture("loginUsers").then((json) => {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			json.users.forEach((user: any) => {
				cy.log(`Testing login for ${user.role}`);
				cy.login(user.email, user.password);
			});
		});
	});
});

export {};
