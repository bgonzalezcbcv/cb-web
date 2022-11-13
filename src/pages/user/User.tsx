import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";

import { Alert, Box, Button, Card, CardContent, Chip, CircularProgress, Divider, Grid, Link, Typography } from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";

import { UserInfo } from "../../core/Models";
import { fetchUser } from "../../core/ApiStore";
import { DataStore } from "../../core/DataStore";
import { restrictEditionTo } from "../../core/userRoleHelper";
import { UserRole, UserRoleColor, UserRoleName } from "../../core/interfaces";
import PersonalInformation from "./components/PersonalInfo/PersonalInformation";
import ComplementaryInformation from "./components/ComplementaryInfo/ComplementaryInformation";
import Absences from "./components/Absences/Absences";
import Documents from "./components/Documents/Documents";
import Restrict from "../../components/Restrict/Restrict";
import useIsAuthenticated from "../../hooks/useIsAuthenticated";
import { UserChangePassword } from "./components/ChangePassword/UserChangePassword/UserChangePassword";
import { AdminChangePassword } from "./components/ChangePassword/AdminChangePassword/AdminChangePassword";
import useFetchFromAPI, { FetchStatus } from "../../hooks/useFetchFromAPI";

import style from "./User.module.scss";

interface UserProps {
	editable: boolean;
}

function Content(props: { children: React.ReactElement }): React.ReactElement {
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
			<CardContent>{props.children}</CardContent>
		</Card>
	);
}

function User(props: UserProps): JSX.Element {
	const { editable } = props;
	const { id } = useParams();

	const loggedUser = DataStore.getInstance().loggedUser;

	const [user, setUser] = useState<UserInfo | null>(null);
	const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);

	useIsAuthenticated(
		[UserRole.Recepcion, UserRole.Administrativo, UserRole.Director, UserRole.Docente, UserRole.Adscripto, UserRole.Administrador],
		(loggedUser) => !(loggedUser.role === UserRole.Docente && loggedUser.id.toString() !== id)
	);

	const { fetchStatus, refetch } = useFetchFromAPI(() => fetchUser(id as string), setUser, id !== undefined);

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

	const handleChangePassword = (isOpen: boolean, isChanged: boolean): void => {
		setPasswordDialogOpen(isOpen);
		console.log(isChanged);
	};

	if (fetchStatus === FetchStatus.Fetching)
		return (
			<Content>
				<CircularProgress />
			</Content>
		);

	if (fetchStatus === FetchStatus.Error || !id || !user)
		return (
			<Content>
				<Alert variant="outlined" severity="error" style={{ cursor: "pointer" }} onClick={refetch}>
					<Typography>No se pudo obtener el usuario. Haga click aquí para reintentar.</Typography>
				</Alert>
			</Content>
		);

	const { name, surname, role, email } = user as UserInfo;

	return (
		<Content>
			<>
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
					<Box display="flex">
						<Button variant="contained" onClick={(): void => setPasswordDialogOpen(true)}>
							Cambiar Contraseña
						</Button>
					</Box>
				</Box>

				<Divider />

				<Grid container>
					<Grid item sm={12} md={4} lg={4} xl={3} padding="6px">
						<PersonalInformation
							user={user}
							setUser={setUser}
							editable={restrictEditionTo([UserRole.Adscripto, UserRole.Director, UserRole.Administrativo, UserRole.Administrador], editable)}
							refetch={refetch}
						/>
					</Grid>

					<Grid item sm={12} md={8} lg={8} xl={9} padding="6px">
						<Restrict to={[UserRole.Docente, UserRole.Director, UserRole.Administrativo, UserRole.Administrador]}>
							<ComplementaryInformation //
								user={user}
								setUser={setUser}
								editable={restrictEditionTo([UserRole.Adscripto, UserRole.Director, UserRole.Administrativo, UserRole.Administrador], editable)}
								canAdd={restrictEditionTo([UserRole.Adscripto, UserRole.Director, UserRole.Administrativo, UserRole.Administrador], editable)}
								canDelete={restrictEditionTo([UserRole.Director, UserRole.Administrativo, UserRole.Administrador], editable)}
								refetch={refetch}
							/>
						</Restrict>
						<Restrict to={[UserRole.Adscripto]}>
							<ComplementaryInformation //
								user={user}
								setUser={setUser}
								editable={editable && id === loggedUser?.id.toString()}
								canAdd={editable}
								canDelete={editable}
								refetch={refetch}
							/>
						</Restrict>
					</Grid>

					<Grid item sm={12} md={12} lg={12} xl={12} padding="6px">
						<Restrict to={[UserRole.Director, UserRole.Administrativo, UserRole.Administrador]}>
							<Absences //
								user={user}
								editable={editable}
								canAdd={editable}
								canDelete={editable}
								refetch={refetch}
							/>
						</Restrict>
						<Restrict to={[UserRole.Adscripto, UserRole.Docente]}>
							<Absences //
								user={user}
								editable={editable && id === loggedUser?.id.toString()}
								canAdd={editable}
								canDelete={false}
								refetch={refetch}
							/>
						</Restrict>
					</Grid>

					<Grid item sm={12} md={12} lg={12} xl={12} padding="6px">
						<Restrict to={[UserRole.Director, UserRole.Administrativo, UserRole.Administrador]}>
							<Documents //
								user={user}
								editable={editable && id === loggedUser?.id.toString()}
								canAdd={editable}
								canDelete={restrictEditionTo([UserRole.Director, UserRole.Administrador], editable)}
								refetch={refetch}
							/>
						</Restrict>
						<Restrict to={[UserRole.Docente, UserRole.Adscripto]}>
							<Documents //
								user={user}
								editable={editable && id === loggedUser?.id.toString()}
								canAdd={editable}
								canDelete={false}
								refetch={refetch}
							/>
						</Restrict>
					</Grid>
				</Grid>
			</>
			<Restrict to={[UserRole.Administrativo, UserRole.Adscripto, UserRole.Director, UserRole.Docente, UserRole.Recepcion]}>
				<UserChangePassword isOpen={passwordDialogOpen} setOpen={handleChangePassword} />
			</Restrict>
			<Restrict to={[UserRole.Administrador]}>
				<AdminChangePassword user={user} isOpen={passwordDialogOpen} setOpen={handleChangePassword} />
			</Restrict>
		</Content>
	);
}

export default observer(User);
