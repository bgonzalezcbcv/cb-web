/* eslint-disable max-statements */
describe("createStudent", () => {
	const createStudentButtonID = '[data-cy="createStudentButton"]';
	const confirmCreateStudentButtonID = '[data-cy="confirmCreateStudent"]';
	const successAlertTextID = '[data-cy="successAlertTitle"]';
	const errorAlertTextID = '[data-cy="errorAlertTitle"]';
	const uploadExcelButtonID = '[data-testid="UploadFileIcon"]';
	const uploaderDragZoneButtonID = '[data-cy="ExcelUploaderZone"]';
	const uploaderConfirmButtonID = "#create-student-button";

	beforeEach(() => {
		cy.login();

		cy.wait(300);

		cy.visit("/students");
	});

	it("shows the success message on creation of a correct student", () => {
		cy.intercept(
			{
				method: "POST", // Route all POST requests
				url: "/api/students", // that have a URL that matches '/students'
			},
			{ statusCode: 201, body: {} } // and force the response to have correct status
		);

		cy.get(createStudentButtonID).click();
		cy.get(confirmCreateStudentButtonID).click();
		cy.get(successAlertTextID).should("include.text", "Estudiante creado correctamente");
	});

	it("shows error message on error when creating student", () => {
		cy.intercept(
			{
				method: "POST", // Route all POST requests
				url: "/api/students", // that have a URL that matches '/students'
			},
			{ statusCode: 422, body: {} } // and force the response to have incorrect status
		);

		cy.get(createStudentButtonID).click();
		cy.get(confirmCreateStudentButtonID).click();
		cy.get(errorAlertTextID).should("include.text", "No se pudo crear el alumno. Inténtelo de nuevo o corrija los errores");
	});

	it("sends correct info to API after Excel upload", () => {
		cy.get(uploadExcelButtonID).click();
		cy.get(uploaderDragZoneButtonID).selectFile("./cypress/testFiles/formAnswer.xlsx", {
			action: "drag-drop",
		});
		cy.get(uploaderConfirmButtonID).click();

		let correctRequestBody = {};
		cy.fixture("correctAPIRequestBodyNoModification").then((json) => {
			correctRequestBody = json;
		});

		cy.intercept(
			{
				method: "POST", // Route all POST requests
				url: "/api/students", // that have a URL that matches '/students'
			},
			(request) => {
				expect(request.body).to.deep.equal(correctRequestBody);
			}
		);

		cy.get(createStudentButtonID).click();
		cy.get(confirmCreateStudentButtonID).click();
	});

	it("sends correct info to API after modification", () => {
		cy.get('[data-cy="studentEditInfoButton"]').click();
		cy.fillStudentBasicInfo();
		cy.fillStudentFamilyInfo();

		let correctRequestBody = {};
		cy.fixture("correctAPIRequestBodyWithModification").then((json) => {
			correctRequestBody = json;
		});

		cy.intercept(
			{
				method: "POST", // Route all POST requests
				url: "/api/students", // that have a URL that matches '/students'
			},
			(request) => {
				expect(request.body).to.deep.equal(correctRequestBody);
			}
		);

		cy.wait(500);

		cy.get(createStudentButtonID).click();
		cy.get(confirmCreateStudentButtonID).click();
	});

	it("updates the basic info values correctly from Excel upload", () => {
		const nameFieldID = "#\\#\\/properties\\/name2-input";
		const surnameFieldID = "#\\#\\/properties\\/surname2-input";
		const CIFieldID = "#\\#\\/properties\\/ci2-input";
		const statusFieldID = "#\\#\\/properties\\/status2-input";
		const tuitionFieldID = "#\\#\\/properties\\/tuition2-input";
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

		cy.get(uploadExcelButtonID).click();
		cy.get(uploaderDragZoneButtonID).selectFile("./cypress/testFiles/formAnswer.xlsx", {
			action: "drag-drop",
		});
		cy.get(uploaderConfirmButtonID).click();

		cy.get(nameFieldID).should("have.value", "Juan José");
		cy.get(surnameFieldID).should("have.value", "Rodriguez Perez");
		cy.get(CIFieldID).should("have.value", "12345678");
		cy.get(statusFieldID).should("have.value", "");
		cy.get(tuitionFieldID).should("have.value", "");
		cy.get(referenceNumberFieldID).should("have.value", "0");
		cy.get(placeOfBirthFieldID).should("have.value", "Montevideo");
		cy.get(dateOfBirthInputID).should("have.value", "01/01/2021");
		cy.get(nationalityFieldID).should("have.value", "Uruguay");
		cy.get(firstLanguageFieldID).should("have.value", "Español");
		cy.get(neighborhoodFieldID).should("have.value", "Ciudad Vieja");
		cy.get(addressFieldID).should("have.value", "Maciel 1373");
		cy.get(medicalAssuranceFieldID).should("have.value", "-");
		cy.get(emergencyFieldID).should("have.value", "-");
		cy.get(vaccineExpirationInputID).should("have.value", "01/01/2024");
	});

	it("updates the family info values correctly from Excel upload", () => {
		const familyInfoButtonID = '[data-cy="familyInfoTab"]';
		const secondFamilyMemberButtonID = "#family1";

		const roleInputID = "#properties\\/role2-input";
		const fullNameFieldID = "#properties\\/full_name2-input";
		const CIFieldID = "#properties\\/ci2-input";
		const dateOfBirthInputID = "#properties\\/birthdate2-input";
		const maritalStatusFieldID = "#properties\\/marital_status2-input";
		const cellphoneFieldID = "#properties\\/cellphone2-input";
		const placeOfBirthFieldID = "#properties\\/birthplace2-input";
		const nationalityFieldID = "#properties\\/nationality2-input";
		const firstLanguageFieldID = "#properties\\/first_language2-input";
		const emailFieldID = "#properties\\/email2-input";
		const addressFieldID = "#properties\\/address2-input";
		const neighborhoodFieldID = "#properties\\/neighbourhood2-input";
		const educationLevelInputID = "#properties\\/education_level2-input";
		const occupationFieldID = "#properties\\/occupation2-input";
		const workplaceFieldID = "#properties\\/workplace2-input";
		const workplaceAddressFieldID = "#properties\\/workplace_address2-input";
		const workplaceNeighborhoodFieldID = "#properties\\/workplace_neighbourhood2-input";
		const workPhoneFieldID = "#properties\\/workplace_phone2-input";

		cy.get(uploadExcelButtonID).click();
		cy.get(uploaderDragZoneButtonID).selectFile("./cypress/testFiles/formAnswer.xlsx", {
			action: "drag-drop",
		});
		cy.get(uploaderConfirmButtonID).click();
		cy.get(familyInfoButtonID).click();

		//check first family member
		cy.get(roleInputID).should("have.text", "Padre");
		cy.get(fullNameFieldID).should("have.value", "Uno");
		cy.get(CIFieldID).should("have.value", "12345678");
		cy.get(dateOfBirthInputID).should("have.value", "01-01-1990");
		cy.get(maritalStatusFieldID).should("have.value", "Casado");
		cy.get(cellphoneFieldID).should("have.value", "099111222");
		cy.get(placeOfBirthFieldID).should("have.value", "Uruguay");
		cy.get(nationalityFieldID).should("have.value", "Uruguay");
		cy.get(firstLanguageFieldID).should("have.value", "Español");
		cy.get(emailFieldID).should("have.value", "serranagonzalezs@colegiociudadvieja.edu.uy");
		cy.get(addressFieldID).should("have.value", "Maciel 1373");
		cy.get(neighborhoodFieldID).should("have.value", "Ciudad Vieja");
		cy.get(educationLevelInputID).should("have.text", "Terciaria completa");
		cy.get(occupationFieldID).should("have.value", "-");
		cy.get(workplaceFieldID).should("have.value", "-");
		cy.get(workplaceAddressFieldID).should("have.value", "-");
		cy.get(workplaceNeighborhoodFieldID).should("have.value", "-");
		cy.get(workPhoneFieldID).should("have.value", "-");

		//check second family member
		cy.get(secondFamilyMemberButtonID).click();
		cy.get(roleInputID).should("have.text", "Madre");
		cy.get(fullNameFieldID).should("have.value", "Dos");
		cy.get(CIFieldID).should("have.value", "12345678");
		cy.get(dateOfBirthInputID).should("have.value", "01-01-1990");
		cy.get(maritalStatusFieldID).should("have.value", "Casado");
		cy.get(cellphoneFieldID).should("have.value", "099111222");
		cy.get(placeOfBirthFieldID).should("have.value", "Uruguay");
		cy.get(nationalityFieldID).should("have.value", "Uruguay");
		cy.get(firstLanguageFieldID).should("have.value", "Español");
		cy.get(emailFieldID).should("have.value", "serranagonzalezs@colegiociudadvieja.edu.uy");
		cy.get(addressFieldID).should("have.value", "Maciel 1373");
		cy.get(neighborhoodFieldID).should("have.value", "-");
		cy.get(educationLevelInputID).should("have.text", "Terciaria completa");
		cy.get(occupationFieldID).should("have.value", "-");
		cy.get(workplaceFieldID).should("have.value", "-");
		cy.get(workplaceAddressFieldID).should("have.value", "-");
		cy.get(workplaceNeighborhoodFieldID).should("have.value", "-");
		cy.get(workPhoneFieldID).should("have.value", "-");
	});
});

export {};
