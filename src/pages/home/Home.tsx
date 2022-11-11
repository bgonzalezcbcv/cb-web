import React from "react";
import {DataStore} from "../../core/DataStore";
import {Typography} from "@mui/material";

export default function Home(): React.ReactElement {
    const dataStore = DataStore.getInstance();
    const user = dataStore.loggedUser;

    return (
		<>
			<Typography fontSize={30}>{`¡Bienvenido/a ${user?.name}!`}</Typography>
		</>
	);
}