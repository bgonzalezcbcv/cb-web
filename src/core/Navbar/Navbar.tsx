import { AppBar, Box, Button, Toolbar } from "@mui/material";
import React from "react";

function Navbar(): React.ReactElement {
	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar position="static">
				<Toolbar>
					<Button color="inherit">Login</Button>
				</Toolbar>
			</AppBar>
		</Box>
	);
}
export default Navbar;
