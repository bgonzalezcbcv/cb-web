describe("studentsBasicInfo",() => {
    const basicInfoButtonID = ".MuiTabs-flexContainer > :nth-child(1)"
    const editButtonID= '[data-cy="studentEditInfoButton"]'
    
    const nameFieldID = "#\\#\\/properties\\/name2-input";
    const nameFieldErrorID = "#\\#\\/properties\\/name2 > :nth-child(3)";

    const surnameFieldID = "#\\#\\/properties\\/surname2-input";
    const surnameFieldErrorID = "#\\#\\/properties\\/surname2> :nth-child(3)";

    
    const CIFieldID = "#\\#\\/properties\\/ci2-input";
    const CIFieldErrorID = "#\\#\\/properties\\/ci2> :nth-child(3)";
    
    const statusFieldID = "#\\#\\/properties\\/status2-input";
    const statusFieldErrorID = "#\\#\\/properties\\/status2> :nth-child(3)";
    
    const tuitionFieldID = "#\\#\\/properties\\/tuition2-input";
    const tuitionFieldErrorID = "#\\#\\/properties\\/tuition2> :nth-child(3)";
    
    const GroupFieldID = "#\\#\\/properties\\/group2-input";
    const GroupFieldErrorID = "#\\#\\/properties\\/group2> :nth-child(3)";
    
    const SubGroupFieldID = "#\\#\\/properties\\/subgroup2-input";
    const SubGroupFieldErrorID = "#\\#\\/properties\\/subgroup2> :nth-child(3)";
    
    const referenceNumberFieldID = "#\\#\\/properties\\/reference_number2-input";
    
    const placeOfBirthFieldID = "#\\#\\/properties\\/birthplace2-input";
    const placeOfBirthFieldErrorID = "#\\#\\/properties\\/birthplace2> :nth-child(3)";
    
    const dateOfBirthInputID = "#\\#\\/properties\\/birthdate2-input";
    const dateOfBirthID = ":nth-child(4) > .MuiGrid-container > :nth-child(2) > .MuiFormControl-root";
    
    const nationalityFieldID = "#\\#\\/properties\\/nationality2-input";
    const nationalityFieldErrorID = "#\\#\\/properties\\/nationality2> :nth-child(3)";
    
    const firstLanguageFieldID = "#\\#\\/properties\\/first_language2-input";
    const firstLanguageFieldErrorID = "#\\#\\/properties\\/first_language2> :nth-child(3)";
    
    const neighborhoodFieldID = "#\\#\\/properties\\/neighborhood2-input";
    const neighborhoodFieldErrorID = "#\\#\\/properties\\/neighborhood2> :nth-child(3)";
    
    const addressFieldID = "#\\#\\/properties\\/address2-input";
    const addressFieldErrorID = "#\\#\\/properties\\/address2> :nth-child(3)";
    
    const medicalAssuranceFieldID = "#\\#\\/properties\\/medical_assurance2-input";
    const medicalAssuranceFieldErrorID = "#\\#\\/properties\\/medical_assurance2> :nth-child(3)";
    
    const emergencyFieldID = "#\\#\\/properties\\/emergency2-input";
    const emergencyFieldErrorID = "#\\#\\/properties\\/emergency2> :nth-child(3)";
    
    const vaccineExpirationInputID = "#\\#\\/properties\\/vaccine_expiration2-input";
    const vaccineExpirationID = ":nth-child(6) > .MuiGrid-container > :nth-child(3) > .MuiFormControl-root";

    const createButtonID = ".MuiBox-root > .MuiButtonBase-root"

    
    beforeEach(() => {
        cy.login();
    
        cy.wait(300);
    
        cy.visit("/students");
    });

    it("does not show error messages before inputting info on any field", () => {
		cy.get(basicInfoButtonID).click();

		cy.get(nameFieldErrorID).should("not.exist");
		cy.get(surnameFieldErrorID).should("not.exist");
		cy.get(CIFieldErrorID).should("not.exist");
		cy.get(statusFieldErrorID).should("not.exist");
		cy.get(tuitionFieldErrorID).should("not.exist");
		cy.get(GroupFieldErrorID).should("not.exist");
		cy.get(SubGroupFieldErrorID).should("not.exist");
		cy.get(placeOfBirthFieldErrorID).should("not.exist");
		cy.get(nationalityFieldErrorID).should("not.exist");
		cy.get(firstLanguageFieldErrorID).should("not.exist");
		cy.get(neighborhoodFieldErrorID).should("not.exist");
		cy.get(addressFieldErrorID).should("not.exist");
		cy.get(medicalAssuranceFieldErrorID).should("not.exist");
		cy.get(emergencyFieldErrorID).should("not.exist");
	});

	it("shows error message on fields that have restrictions with an incorrect input", () => {
		cy.get(basicInfoButtonID).click();
		cy.get(editButtonID).click();

		//check basic data
		cy.testInput(CIFieldID, CIFieldErrorID, "", "50137758", "Se deben ingresar solo números, sin puntos ni guiones y no puede quedar vacía");
		cy.testInput(dateOfBirthInputID, dateOfBirthID, "incorrecto", "10/5/1990", "");
		cy.testInput(vaccineExpirationInputID, vaccineExpirationID, "incorrecto", "10/5/2022", "");
	});


    it("fills all basic info values correctly", () => {
        cy.get(basicInfoButtonID).click();
        cy.get(editButtonID).click();
        cy.get(nameFieldID).clear().type("Adam");
        cy.get(surnameFieldID).clear().type("Sandler");
        cy.get(CIFieldID).clear().type("11111111");
        cy.get(statusFieldID).type("Pendiente");
        cy.get(tuitionFieldID).type("Matricula buena");
        cy.get(GroupFieldID).type("3");
        cy.get(SubGroupFieldID).type("A");
        cy.get(referenceNumberFieldID).type("42");
        cy.get(placeOfBirthFieldID).type("Asociacion Española");
        cy.get(dateOfBirthInputID).type("01/09/2000");
        cy.get(nationalityFieldID).type("Uruguayo");
        cy.get(firstLanguageFieldID).type("Español");
        cy.get(neighborhoodFieldID).type("Cordon");
        cy.get(addressFieldID).type("Guayabo 1729");
        cy.get(medicalAssuranceFieldID).type("Si tiene es la A23BVJ");
        cy.get(emergencyFieldID).type("Cooperativa ABC123XYZ");
        cy.get(vaccineExpirationInputID).type("03/03/2019");
        cy.fillStudentFamilyInfo();
        cy.get(createButtonID).click();

        cy.get("body").should("not.include.text","Hay errores en los campos del alumno")

    });
});

export {};