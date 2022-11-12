import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { DataStore } from "../../core/DataStore";
import { getColorByUserRole, getRoleNameByUserRole } from "../../core/userRoleHelper";
import { AppBar, Avatar, Box, Button, Chip, IconButton, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

import "./Navbar.scss";

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

	const handleHamburgerClick = (): void => dataStore.setIsDrawerOpen();

	const handleProfileClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
		setIsOpenUserProfileMenu(true);
		setAnchorElProfile(event?.currentTarget);
	};

	const handleCloseProfileMenu = (): void => {
		setIsOpenUserProfileMenu(false);
		setAnchorElProfile(null);
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
						<Typography variant="body1">{loggedUser?.name}</Typography>

						<Chip sx={{ bgcolor: getColorByUserRole(loggedUser?.role) }} label={getRoleNameByUserRole(loggedUser?.role)} />
					</div>
				</div>

				<MenuItem color={"secondary"} onClick={(): void => navigate(`/user/${loggedUser?.id}/edit`)} sx={{ justifyContent: "center" }}>
					Mi perfil
				</MenuItem>

				<MenuItem color={"secondary"} onClick={handleLogout} sx={{ justifyContent: "center" }}>
					Cerrar Sesión
				</MenuItem>
			</div>
		);
	};

	return (
		<Box sx={{ display: "flex", flexGrow: 1 }}>
			<AppBar position="static" sx={{ display: "flex", flexDirection: "row", padding: "6px 0 0 20px" }}>
				{loggedUser && (
					<IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={handleHamburgerClick}>
						<MenuIcon />
					</IconButton>
				)}

				<Toolbar sx={{ justifyContent: "flex-end", bgcolor: "primary", flexGrow: 1 }}>
					{loggedUser ? (
						<div className="logged-user-controls">
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
