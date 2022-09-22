describe("studentsBasicInfo",() => {
    const basicInfoButtonID = ".MuiTabs-flexContainer > :nth-child(2)"
    const editButtonID= ".css-zi9jgv > :nth-child(2) > :nth-child(2)"
    const nameInputID = "#\#\/properties\/name2-input"
    const surnameInputID= "#\#\/properties\/surname2-input"
    const CIInputID = "#\#\/properties\/ci2-input"
    const statusInputID = "#\#\/properties\/status2-input"

    beforeEach(() => {
        cy.login();
    
        cy.wait(300);
    
        cy.visit("/students");
    });
});