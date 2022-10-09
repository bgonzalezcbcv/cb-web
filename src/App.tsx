// First we import the named libraries: React, lodash, react-router-dom, etc.
import _ from "lodash";
import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { observer } from "mobx-react-lite";

// Secondly we import our types, core elements, pages, components and lastly images.
import { DataStore } from "./core/DataStore";
import { StudentPageMode } from "./core/interfaces";
import { getSidebarSectionsByUser } from "./core/userRoleHelper";
import { theme } from "./core/theme";
import CreateUser from "./pages/user/CreateUser";
import Login from "./pages/login/Login";
import Student from "./pages/student/Student";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import { Box } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";

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
												<Route path="/createuser" element={<CreateUser />} />
												<Route path="/student" element={<Student mode={StudentPageMode.create} />} />
												<Route path="/student/:id" element={<Student mode={StudentPageMode.view} />} />
												<Route path="/student/:id/edit" element={<Student mode={StudentPageMode.edit} />} />

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
