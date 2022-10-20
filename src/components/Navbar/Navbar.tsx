import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { DataStore } from "../../core/DataStore";
import { AppBar, Avatar, Badge, Box, Button, Chip, Menu, MenuItem, Toolbar } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";

import "./Navbar.scss";
import { getColorByUserRole } from "../../core/userRoleHelper";

function userNameToInitials(displayName?: string): string {
	return (
		displayName
			?.match(/(\b\S)?/g)
			?.join("")
			.toUpperCase() ?? ":)"
	);
}

function Navbar(): React.ReactElement {
	const navigate = useNavigate();

	const dataStore = DataStore.getInstance();
	const loggedUser = dataStore.loggedUser;

	const [isOpenUserProfileMenu, setIsOpenUserProfileMenu] = useState(false);
	const [anchorElProfile, setAnchorElProfile] = useState<null | HTMLElement>(null);
	const [isOpenNotificationsMenu, setIsOpenNotificationsMenu] = useState(false);
	const [anchorElNotifications, setAnchorElNotifications] = useState<null | HTMLElement>(null);

	const handleProfileClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
		setIsOpenUserProfileMenu(true);
		setAnchorElProfile(event?.currentTarget);
	};

	const handleNotificationsClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
		setIsOpenNotificationsMenu(true);
		setAnchorElNotifications(event?.currentTarget);
	};

	const handleCloseProfileMenu = (): void => {
		setIsOpenUserProfileMenu(false);
		setAnchorElProfile(null);
	};

	const handleCloseNotificationsMenu = (): void => {
		setIsOpenNotificationsMenu(false);
		setAnchorElNotifications(null);
	};

	const handleLogout = (): void => {
		setIsOpenUserProfileMenu(false);

		dataStore.logOut();
	};

	const renderUserAvatar = (): React.ReactElement => {
		return <Avatar sx={{ bgcolor: getColorByUserRole(loggedUser?.role), border: "0.2px solid white" }}>{userNameToInitials(loggedUser?.name)}</Avatar>;
	};

	const renderProfileMenuContent = (): React.ReactElement => {
		return (
			<div className="menu-content">
				<div className="user-info">
					{renderUserAvatar()}
					<div className="user-name-and-role">
						{loggedUser?.name}

						<Chip sx={{ bgcolor: getColorByUserRole(loggedUser?.role) }} className="rolePill" label={loggedUser?.role} />
					</div>
				</div>

				<MenuItem color={"secondary"} onClick={() => navigate("/user/3/edit")} sx={{ justifyContent: "center" }}>
					Mi perfil
				</MenuItem>

				<MenuItem color={"secondary"} onClick={handleLogout} sx={{ justifyContent: "center" }}>
					Cerrar Sesión
				</MenuItem>
			</div>
		);
	};

	const renderNotificationseMenuContent = (): React.ReactElement => {
		return <div>Nada por aquí aún</div>;
	};

	return (
		<Box sx={{ flex: 1 }}>
			<AppBar position="static">
				<Toolbar sx={{ justifyContent: "flex-end", bgcolor: "primary" }}>
					{loggedUser ? (
						<div className="logged-user-controls">
							<Button onClick={handleNotificationsClick}>
								<Badge badgeContent={3} color="secondary">
									<NotificationsIcon className="notifications-icon" sx={{ color: "white" }} />
								</Badge>
							</Button>

							<Menu
								open={isOpenNotificationsMenu}
								onClose={handleCloseNotificationsMenu}
								anchorEl={anchorElNotifications}
								className="profile-menu">
								{renderNotificationseMenuContent()}
							</Menu>

							<Button onClick={handleProfileClick}>{renderUserAvatar()}</Button>

							<Menu open={isOpenUserProfileMenu} onClose={handleCloseProfileMenu} anchorEl={anchorElProfile} className="profile-menu">
								{renderProfileMenuContent()}
							</Menu>
						</div>
					) : (
						<Button color="inherit" onClick={(): void => navigate("/login")}>
							Iniciar Sesión
						</Button>
					)}
				</Toolbar>
			</AppBar>
		</Box>
	);
}
export default Navbar;
