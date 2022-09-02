describe("Teachers", () => {
	beforeEach(() => {
		cy.login();

		cy.wait(500);

		cy.visit("/teachers");
	});

	it("loads page", () => {
		cy.get("#root_firstName").should("be.visible");
	});

	it("can type on fields and add subject", () => {
		cy.get("#root_ci").type("alalala");
		cy.get("#root_firstName").type("lelelle");
		cy.get("#root_lastName").type("lululu");
		cy.get(".MuiBox-root > .MuiButtonBase-root").click();
		cy.get("#root_subjects_0").type("jasldj");
		cy.get('[data-testid="RemoveIcon"]').click();
	});

	it("can add teacher successfully and it is added to the list", () => {
		cy.get("#root_ci").type("1.234.567-8");
		cy.get("#root_firstName").type("Roberto Rigoberto");
		cy.get("#root_lastName").type("Rodriguez Ramos");
		cy.get(".MuiBox-root > .MuiButtonBase-root").click();
		cy.get("#root_subjects_0").type("Matemáticas");
		cy.get("#submitNewTeacher").click();

		cy.get(".MuiDataGrid-virtualScrollerContent").contains("1.234.567-8");
		cy.get(".MuiDataGrid-virtualScrollerContent").contains("Roberto Rigoberto");
		cy.get(".MuiDataGrid-virtualScrollerContent").contains("Rodriguez Ramos");
		cy.get(".MuiDataGrid-virtualScrollerContent").contains("Matemáticas");
	});

	it("validates CI format on new teacher and does not add it", () => {
		cy.get("#root_ci").clear().type("error");
		cy.get("#root_firstName").clear().type("María Marta");
		cy.get("#root_lastName").clear().type("Montreal Morales");
		cy.get("#submitNewTeacher").click();
		cy.get(".create-teachers__form > :nth-child(1) > :nth-child(1) > .MuiTypography-root").click();
		cy.get(".MuiListItem-root > #root_ci").contains("Ingrese una cedula con el formato x.xxx.xxx.y");

		cy.get(".MuiDataGrid-virtualScrollerContent").contains("María Marta").should("not.exist");
	});
});

export {};
