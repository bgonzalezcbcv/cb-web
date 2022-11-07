// First we import the named libraries: React, lodash, react-router-dom, etc.
import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { observer } from "mobx-react-lite";

// Secondly we import our types, core elements, pages, components and lastly images.
import { DataStore } from "./core/DataStore";
import { StudentPageMode } from "./core/interfaces";
import { getSidebarSectionsByUser } from "./core/userRoleHelper";
import { theme } from "./core/theme";
import CreateUser from "./pages/createuser/CreateUser";
import Login from "./pages/login/Login";
import User from "./pages/user/User";
import Student from "./pages/student/Student";
import AddTeachersToGroup from "./pages/addTeachersToGroup/AddTeachersToGroup";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import Students from "./pages/students/Students";
import Teachers from "./pages/teachers/Teachers";
import Groups from "./pages/groups/Groups";
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
						<Box className="navbar">{loggedUser && <Navbar />}</Box>

						<Box className="content" style={{ display: "flex", width: "100%" }}>
							<Box style={{ display: "flex", flexDirection: "row", width: "100%" }}>
								<Sidebar sections={sidebarSections} />

								<Box color={"primary"} className="page-container" sx={{ bgcolor: "primary.light", margin: "0" }}>
									<Routes>
										{loggedUser ? (
											<>
												<Route path="/student" element={<Student mode={StudentPageMode.create} />} />
												<Route path="/student/:id" element={<Student mode={StudentPageMode.view} />} />
												<Route path="/student/:id/edit" element={<Student mode={StudentPageMode.edit} />} />
												<Route path="/students" element={<Students />} />
												<Route path="/createuser" element={<CreateUser />} />
												<Route path="/user/:id" element={<User editable={false} />} />
												<Route path="/user/:id/edit" element={<User editable />} />
												<Route path="/teachers/:id" element={<Teachers editable={false} />} />
												<Route path="/teachers/:id/edit" element={<Teachers editable />} />
												<Route path="/teachers" element={<Teachers editable={false} />} />
												<Route path="/teachers/edit" element={<Teachers editable={true} />} />
												<Route path="/groups" element={<Groups />} />
												<Route path="/groups/:id" element={<Groups />} />
												<Route path="/addTeachers/:id" element={<AddTeachersToGroup />} />
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
