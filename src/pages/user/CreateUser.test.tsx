import React from "react";
import { act, fireEvent, render } from "@testing-library/react";

import CreateUser from "./CreateUser";

describe("CreateUser", () => {
    const createButtonRef = "#createButton";
    const emailRef = "#email2-input";
    const nameRef = "#name2-input";
    const surnameRef = "#surname2-input";
    const roleRef = "#role2-input";

    test("Shouldn't create user with wrong email format", async () => {
        const wrapper = render(<CreateUser/>);

        const emailInput = wrapper.container.querySelector(emailRef);
        if (emailInput === null) return;
        await act(async () => {
            fireEvent.change(emailInput, { target: "test" });
        });

        const createButton = wrapper.container.querySelector(createButtonRef);
        expect(createButton).not.toEqual(null);

        if (createButton === null) return;
        await act(async () => {
            fireEvent.click(createButton);
        });

        wrapper.findByText("Email incorrecto.");
        wrapper.findByText("No se pudo crear el usuario. Inténtelo de nuevo.");
    });

    test("Shouldn't create user with empty name input", async () => {
        const wrapper = render(<CreateUser/>);

        const createButton = wrapper.container.querySelector(createButtonRef);
        expect(createButton).not.toEqual(null);

        if (createButton === null) return;
        await act(async () => {
            fireEvent.click(createButton);
        });

        wrapper.findByText("El campo nombre no puede estar vacío.");
        wrapper.findByText("No se pudo crear el usuario. Inténtelo de nuevo.");
    });

    test("Should show correct creation modal if there are no errors", async () => {
        const wrapper = render(<CreateUser />);

        const emailInput = wrapper.container.querySelector(emailRef);
        if (emailInput === null) return;
        await act(async () => {
            fireEvent.change(emailInput, { target: "test@test.com" });
        });

        const nameInput = wrapper.container.querySelector(nameRef);
        if (nameInput === null) return;
        await act(async () => {
            fireEvent.change(nameInput, { target: "Juan" });
        });

        const surnameInput = wrapper.container.querySelector(surnameRef);
        if (surnameInput === null) return;
        await act(async () => {
            fireEvent.change(surnameInput, { target: "Pérez" });
        });

        const roleInput = wrapper.container.querySelector(roleRef);
        if (roleInput === null) return;
        await act(async () => {
            fireEvent.change(roleInput, { target: "Docente" });
        });

        const createButton = wrapper.container.querySelector(createButtonRef);
        expect(createButton).not.toEqual(null);

        if (createButton === null) return;
        await act(async () => {
            fireEvent.click(createButton);
        });

        wrapper.findByText("¡Usuario creado correctamente!");
    })
});
