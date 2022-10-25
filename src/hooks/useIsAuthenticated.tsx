import React from "react";
import { useNavigate } from "react-router-dom";

import { UserRole } from "../core/interfaces";
import { DataStore } from "../core/DataStore";

/**
 *
 * @param authRoles: Roles that are authorized to view this component.
 * @param redirect: Use in case you want to redirect with this param. Useful for example if the logged id should not be viewing this page.
 */
export default function useIsAuthenticated(authRoles: UserRole[], redirect = false): void {
	const navigate = useNavigate();
	const loggedUser = DataStore.getInstance().loggedUser;

	if (!(loggedUser && authRoles.includes(loggedUser.role)) || redirect) return navigate("/");
}
