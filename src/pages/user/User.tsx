import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";

import { Alert, Box, Card, CardContent, Chip, CircularProgress, Divider, Link, Typography } from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { UserInfo } from "../../core/Models";
import { fetchUser } from "../../core/ApiStore";
import { DataStore } from "../../core/DataStore";
import { UserRole, UserRoleColor, UserRoleName } from "../../core/interfaces";
import { restrictEditionTo } from "../../core/userRoleHelper";
import PersonalInformation from "./components/PersonalInfo/PersonalInformation";
import ComplementaryInformation from "./components/ComplementaryInfo/ComplementaryInformation";
import Absences from "./components/Absences/Absences";
import Documents from "./components/Documents/Documents";
import Restrict from "../../components/Restrict/Restrict";
import useIsAuthenticated from "../../hooks/useIsAuthenticated";

import style from "./User.module.scss";

enum FetchStatus {
	Initial,
	Fetching,
	Error,
}

interface UserProps {
	editable: boolean;
}

function User(props: UserProps): JSX.Element {
	const { editable } = props;
	const { id } = useParams();

	const loggedUser = DataStore.getInstance().loggedUser;

	const [fetchStatus, setFetchStatus] = useState<FetchStatus>(FetchStatus.Fetching);
	const [user, setUser] = useState<UserInfo | null>(null);

	useIsAuthenticated(
		[UserRole.Recepcion, UserRole.Administrativo, UserRole.Director, UserRole.Docente, UserRole.Adscripto, UserRole.Administrador],
		(loggedUser) => !(loggedUser.role === UserRole.Docente && loggedUser.id.toString() !== id)
	);

	const fetchUserFromAPI = useCallback(async () => {
		if (!id) return;

		setFetchStatus(FetchStatus.Fetching);

		const response = await fetchUser(id);

		if (response.success && response.data) {
			setUser(response.data);
			setFetchStatus(FetchStatus.Initial);
		} else setFetchStatus(FetchStatus.Error);
	}, [id]);

	useEffect(() => {
		fetchUserFromAPI();
	}, [fetchUserFromAPI]);

	if (fetchStatus === FetchStatus.Fetching) return <CircularProgress />;

	if (fetchStatus === FetchStatus.Error || !id || !user)
		return (
			<Alert variant="outlined" severity="error" style={{ cursor: "pointer" }} onClick={fetchUserFromAPI}>
				<Typography>No se pudo obtener el usuario. Haga click aquí para reintentar.</Typography>
			</Alert>
		);

	const { name, surname, role, email } = user as UserInfo;

	return (
		<Card
			sx={{
				width: "90%",
				height: "85vh",
				padding: "10px",
				alignSelf: "flex-start",
				marginTop: "20px",
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
				boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
				overflow: "auto",
			}}>
			<CardContent>
				<Box display="flex" justifyContent="flex-start" alignItems="center" gap="12px" width="100%">
					<Typography variant="h3">
						{name} {surname}
					</Typography>

					<Box display="flex" flexDirection="column">
						<Chip label={UserRoleName[role]} style={{ background: UserRoleColor[role] }} />
					</Box>

					<Link href={`mailto:${email}`}>
						<MailOutlineIcon />
					</Link>
				</Box>

				<Divider />

				<Box className={style.infoCardContainers}>
					<PersonalInformation
						user={user}
						setUser={setUser}
						editable={restrictEditionTo([UserRole.Adscripto, UserRole.Director, UserRole.Administrativo, UserRole.Administrador], editable)}
					/>

					<Restrict to={[UserRole.Docente, UserRole.Director, UserRole.Administrativo, UserRole.Administrador]}>
						<ComplementaryInformation //
							user={user}
							setUser={setUser}
							editable={restrictEditionTo([UserRole.Adscripto, UserRole.Director, UserRole.Administrativo, UserRole.Administrador], editable)}
							canAdd={restrictEditionTo([UserRole.Adscripto, UserRole.Director, UserRole.Administrativo, UserRole.Administrador], editable)}
							canDelete={restrictEditionTo([UserRole.Director, UserRole.Administrativo, UserRole.Administrador], editable)}
						/>
					</Restrict>
					<Restrict to={[UserRole.Adscripto]}>
						<ComplementaryInformation //
							user={user}
							setUser={setUser}
							editable={editable && id === loggedUser?.id.toString()}
							canAdd={editable}
							canDelete={editable}
						/>
					</Restrict>

					<Restrict to={[UserRole.Director, UserRole.Administrativo, UserRole.Administrador]}>
						<Absences //
							user={user}
							setUser={setUser}
							editable={editable}
							canAdd={editable}
							canDelete={editable}
						/>
					</Restrict>
					<Restrict to={[UserRole.Adscripto, UserRole.Docente]}>
						<Absences //
							user={user}
							setUser={setUser}
							editable={editable && id === loggedUser?.id.toString()}
							canAdd={editable}
							canDelete={false}
						/>
					</Restrict>

					<Restrict to={[UserRole.Director, UserRole.Administrativo, UserRole.Administrador]}>
						<Documents //
							user={user}
							setUser={setUser}
							editable={editable && id === loggedUser?.id.toString()}
							canAdd={editable}
							canDelete={restrictEditionTo([UserRole.Director, UserRole.Administrador], editable)}
						/>
					</Restrict>
					<Restrict to={[UserRole.Docente, UserRole.Adscripto]}>
						<Documents //
							user={user}
							setUser={setUser}
							editable={editable && id === loggedUser?.id.toString()}
							canAdd={editable}
							canDelete={false}
						/>
					</Restrict>
				</Box>
			</CardContent>
		</Card>
	);
}

export default observer(User);
