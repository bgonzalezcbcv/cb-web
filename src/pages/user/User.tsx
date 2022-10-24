import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Alert, Box, Card, CardContent, Chip, CircularProgress, Divider, Link, Typography } from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { UserInfo } from "../../core/Models";
import { fetchUser } from "../../core/ApiStore";
import { UserRoleColor, UserRoleName } from "../../core/interfaces";
import PersonalInformation from "./components/PersonalInfo/PersonalInformation";
import ComplementaryInformation from "./components/ComplementaryInfo/ComplementaryInformation";
import Absences from "./components/Absences/Absences";
import Documents from "./components/Documents/Documents";

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

	const [fetchStatus, setFetchStatus] = useState<FetchStatus>(FetchStatus.Fetching);
	const [user, setUser] = useState<UserInfo | null>(null);

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
					<PersonalInformation user={user} setUser={setUser} editable={editable} />

					<ComplementaryInformation user={user} setUser={setUser} editable={editable} />

					<Absences user={user} setUser={setUser} editable={editable} />

					<Documents user={user} setUser={setUser} editable={editable} />
				</Box>
			</CardContent>
		</Card>
	);
}

export default User;
