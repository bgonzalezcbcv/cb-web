import { AppBar, Box, Button, Toolbar } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

function Navbar(): React.ReactElement {
	const navigate = useNavigate();

	return (
		<Box sx={{ flex: 1 }}>
			<AppBar position="static">
				<Toolbar sx={{ justifyContent: "flex-end" }}>
					<Button color="inherit" onClick={(): void => navigate("/login")}>
						Login
					</Button>
				</Toolbar>
			</AppBar>
		</Box>
	);
}
export default Navbar;
