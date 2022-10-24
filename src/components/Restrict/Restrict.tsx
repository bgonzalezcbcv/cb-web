import React from "react";
import { observer } from "mobx-react-lite";

import { UserRole } from "../../core/interfaces";
import { DataStore } from "../../core/DataStore";

interface RestrictProps {
	to: UserRole[];
	fallback?: React.ReactElement;
	children?: React.ReactElement;
}

function Restrict(props: RestrictProps): React.ReactElement | null {
	const { to: authorizedRoles, fallback, children } = props;

	const loggedUser = DataStore.getInstance().loggedUser;

	if (!loggedUser) return null;

	const { role } = loggedUser;

	if (authorizedRoles.includes(role)) return children ?? null;
	else return fallback ?? null;
}

export default observer(Restrict);
