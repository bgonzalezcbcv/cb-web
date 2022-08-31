describe("new teacher", () => {
	it("loads page", () => {
		cy.visit("localhost:3000");
		cy.get(".App");
	});

	it("can type on CI and clear it", () => {
		cy.get("#root_ci").type("alalala").clear();
	});

	it("can type on Nombre and clear it", () => {
		cy.get("#root_firstName").type("lelelle").clear();
	});

	it("can type on Apellido and clear it", () => {
		cy.get("#root_lastName").type("lululu").clear();
	});

	it("can add subject and delete it", () => {
		cy.get(".MuiBox-root > .MuiButtonBase-root").click();
		cy.get("#root_subjects_0").type("jasldj").clear();
		cy.get('[data-testid="RemoveIcon"]').click();
	});

	it("can add teacher successfully", () => {
		cy.get("#root_ci").type("1.234.567-8");
		cy.get("#root_firstName").type("Roberto Rigoberto");
		cy.get("#root_lastName").type("Rodriguez Ramos");
		cy.get(".MuiBox-root > .MuiButtonBase-root").click();
		cy.get("#root_subjects_0").type("Matemáticas");
		cy.get("#submitNewTeacher").click();
	});

	it("can show the created teacher in the list", () => {
		cy.get(".MuiDataGrid-virtualScrollerContent").contains("1.234.567-8");
		cy.get(".MuiDataGrid-virtualScrollerContent").contains("Roberto Rigoberto");
		cy.get(".MuiDataGrid-virtualScrollerContent").contains("Matemáticas");
	});

	it("validates CI format on new teacher", () => {
		cy.get("#root_ci").clear().type("error");
		cy.get("#root_firstName").clear().type("María Marta");
		cy.get("#root_lastName").clear().type("Montreal Morales");
		cy.get("#submitNewTeacher").click();
		cy.get(".create-teachers__form > :nth-child(1) > :nth-child(1) > .MuiTypography-root").click();
		cy.get(".MuiListItem-root > #root_ci").contains("Ingrese una cedula con el formato x.xxx.xxx.y");
	});

	it("does not add the teacher on CI format error", () => {
		cy.get(".MuiDataGrid-virtualScrollerContent").contains("María Marta").should("not.exist");
	});
});

export {};
