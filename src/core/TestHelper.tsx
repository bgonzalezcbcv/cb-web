import { UserRole } from "./interfaces";
import * as UserRoleHelper from "./userRoleHelper";
import * as Restrict from "../components/Restrict/Restrict";

export function mockRestrictionsComponent(bypass = true): void {
	jest.mock("../components/Restrict/Restrict", () => ({
		default: (props: Record<string, unknown>) => props.children,
	}));
}

export function mockRestrictEditionTo(): jest.SpyInstance<unknown> {
	return jest.spyOn(UserRoleHelper, "restrictEditionTo").mockImplementation(
		//
		(roles: UserRole[], editable: boolean | undefined): boolean => editable ?? true
	);
}
