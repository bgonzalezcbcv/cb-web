import { AppBar, Avatar, Box, Button, Menu, MenuItem, Toolbar } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataStore } from "../../core/DataStore";
import { UserRole } from "../../core/interfaces";
import "./Navbar.scss";

function roleToAvatarColor(userRole: UserRole): string {
	switch (userRole) {
		case UserRole.Administrador:
			return "blue";
		case UserRole.Administrativo:
			return "red";
		default:
			return "gray";
	}
}

function userNameToInitials(displayName: string): string {
	return (
		displayName
			.match(/(\b\S)?/g)
			?.join("")
			.toUpperCase() ?? ":)"
	);
}

function Navbar(): React.ReactElement {
	const navigate = useNavigate();
	const dataStore = DataStore.getInstance();
	const loggedUser = dataStore.loggedUser;

	const [isOpenUserProfileMenu, setIsOpenUserProfileMenu] = useState(false);
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

	const handleProfileClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
		setIsOpenUserProfileMenu(true);
		setAnchorEl(event?.currentTarget);
	};

	const handleCloseProfileMenu = (): void => {
		setIsOpenUserProfileMenu(false);
		setAnchorEl(null);
	};

	const handleLogout = (): void => {
		setIsOpenUserProfileMenu(false);
		dataStore.logOut();
	};

	return (
		<Box sx={{ flex: 1 }}>
			<AppBar position="static">
				<Toolbar sx={{ justifyContent: "flex-end", bgcolor: "gray" }}>
					{loggedUser ? (
						<div className="logged-user-controls">
							<Button onClick={handleProfileClick}>
								<Avatar sx={{ bgcolor: roleToAvatarColor(loggedUser.role) }}>{userNameToInitials(loggedUser.displayName)}</Avatar>
							</Button>

							<Menu open={isOpenUserProfileMenu} onClose={handleCloseProfileMenu} anchorEl={anchorEl} className="profile-menu">
								<MenuItem onClick={handleLogout}>Cerrar Sesión</MenuItem>
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
