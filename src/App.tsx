// First we import the named libraries: React, lodash, react-router-dom, etc.
import React from "react";
import _ from "lodash";

// Secondly we import our types, core elements, pages, components and lastly images.
import { DataStore } from "./core/DataStore";
import { getSidebarSectionsByUser } from "./core/userRoleHelper";
import Student from "./pages/student/Student";
import Login from "./pages/login/Login";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import { Box } from "@mui/material";
import { theme } from "./core/theme";
import { ThemeProvider } from "@mui/material/styles";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { observer } from "mobx-react-lite";

// Lastly we import our stylesheets.
import "./App.css";

function App(): React.ReactElement {
	const loggedUser = DataStore.getInstance().loggedUser;

	const sidebarSections = getSidebarSectionsByUser(loggedUser);

	return (
		<Box className="App">
			<BrowserRouter>
				<Box className="container">
					<ThemeProvider theme={theme}>
						<Box className="content" style={{ display: "flex", width: "100%" }}>
							{!_.isNil(loggedUser?.role) && <Sidebar sections={sidebarSections} />}
							<Box style={{ display: "flex", flexDirection: "column", width: "100%" }}>
								<Box className="navbar">{loggedUser && <Navbar />}</Box>

								<Box color={"primary"} className="page-container" sx={{ bgcolor: "primary.light", margin: "0" }}>
									<Routes>
										{loggedUser ? (
											<>
												<Route path="/student" element={<Student mode={"CREATE"} />} />
												<Route path="*" element={<Navigate to="/student" />} />
											</>
										) : (
											<>
												<Route path="/login" element={<Login />} />
												<Route path="*" element={<Navigate to="/login" />} />
											</>
										)}
									</Routes>
								</Box>
							</Box>
						</Box>
					</ThemeProvider>
				</Box>
			</BrowserRouter>
		</Box>
	);
}

export default observer(App);
