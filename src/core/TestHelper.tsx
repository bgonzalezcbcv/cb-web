import { UserRole } from "./interfaces";
import * as UserRoleHelper from "./userRoleHelper";

export function mockRestrictionsComponent(): void {
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

export function mockUseIsAuthenticated(): void {
	jest.mock("../hooks/useIsAuthenticated", () => ({
		default: (): boolean => true,
	}));
}
