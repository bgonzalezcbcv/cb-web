import { useNavigate } from "react-router-dom";

import { UserRole } from "../core/interfaces";
import { DataStore } from "../core/DataStore";
import { User } from "../core/Models";

/**
 *
 * @param authRoles: Roles that are authorized to view this component.
 * @param additionalValidation: Callback to do a custom validation, false to redirect.
 */
export default function useIsAuthenticated(authRoles: UserRole[], additionalValidation?: (loggedUser: User) => boolean): void {
	const navigate = useNavigate();
	const loggedUser = DataStore.getInstance().loggedUser;

	if (!loggedUser) return navigate("/");

	if (!authRoles.includes(loggedUser.role)) return navigate("/");

	if (additionalValidation && !additionalValidation(loggedUser)) return navigate("/");
}
