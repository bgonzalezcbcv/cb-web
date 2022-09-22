describe("studentsBasicInfo",() => {
    const basicInfoButtonID = ".MuiTabs-flexContainer > :nth-child(1)"
    const editButtonID= ".css-zi9jgv > :nth-child(2) > :nth-child(2)"
    const nameFieldID = "#\\#\\/properties\\/name2-input";
    const surnameFieldID = "#\\#\\/properties\\/surname2-input";
    const CIFieldID = "#\\#\\/properties\\/ci2-input";
    const statusFieldID = "#\\#\\/properties\\/status2-input";
    const tuitionFieldID = "#\\#\\/properties\\/tuition2-input";
    const GroupFieldID = "#\\#\\/properties\\/group2-input";
    const SubGroupFieldID = "#\\#\\/properties\\/subgroup2-input";
    const referenceNumberFieldID = "#\\#\\/properties\\/reference_number2-input";
    const placeOfBirthFieldID = "#\\#\\/properties\\/birthplace2-input";
    const dateOfBirthInputID = "#\\#\\/properties\\/birthdate2-input";
    const nationalityFieldID = "#\\#\\/properties\\/nationality2-input";
    const firstLanguageFieldID = "#\\#\\/properties\\/first_language2-input";
    const neighborhoodFieldID = "#\\#\\/properties\\/neighborhood2-input";
    const addressFieldID = "#\\#\\/properties\\/address2-input";
    const medicalAssuranceFieldID = "#\\#\\/properties\\/medical_assurance2-input";
    const emergencyFieldID = "#\\#\\/properties\\/emergency2-input";
    const vaccineExpirationInputID = "#\\#\\/properties\\/vaccine_expiration2-input";
    const createButtonID = ".MuiBox-root > .MuiButtonBase-root"

    beforeEach(() => {
        cy.login();
    
        cy.wait(300);
    
        cy.visit("/students");
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
        cy.get(dateOfBirthInputID).type("2000-09-01");
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