// First we import the named libraries: React, lodash, react-router-dom, etc.
import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { observer } from "mobx-react-lite";

// Secondly we import our types, core elements, pages, components and lastly images.
import { Box } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";

import { DataStore } from "./core/DataStore";
import { StudentPageMode } from "./core/interfaces";
import { getSidebarSectionsByUser } from "./core/userRoleHelper";
import { theme } from "./core/theme";

import CreateUser from "./pages/createuser/CreateUser";
import Login from "./pages/login/Login";
import User from "./pages/user/User";
import Student from "./pages/student/Student";
import AddUsersToGroup from "./pages/adduserstogroup/AddUsersToGroup";
import Home from "./pages/home/Home";
import Students from "./pages/students/Students";
import PendigStudents from "./pages/students/PendingStudents";
import InactiveStudents from "./pages/students/inactive/InactiveStudents";
import Teachers from "./pages/teachers/Teachers";
import Groups from "./pages/groups/Groups";
import Users from "./pages/users/Users";
import ActiveStudents from "./pages/students/ActiveStudents";
import Scholarship from "./pages/typescholarship/Scholarship";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";

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
												<Route path="/createstudent" element={<Student mode={StudentPageMode.create} />} />
												<Route path="/student/:id" element={<Student mode={StudentPageMode.view} />} />
												<Route path="/student/:id/edit" element={<Student mode={StudentPageMode.edit} />} />
												<Route path="/students" element={<Students />} />
												<Route path="/students/:id" element={<Students />} />
												<Route path="/students/:groupId" element={<Students />} />
												<Route path="/pending" element={<PendigStudents />} />
												<Route path="/students/active" element={<ActiveStudents />} />
												<Route path="/students/inactive" element={<InactiveStudents />} />
												<Route path="/createuser" element={<CreateUser />} />
												<Route path="/users" element={<Users />} />
												<Route path="/user/:id" element={<User editable={false} />} />
												<Route path="/user/:id/edit" element={<User editable />} />
												<Route path="/teachers/:id" element={<Teachers editable={false} />} />
												<Route path="/teachers/:id/edit" element={<Teachers editable />} />
												<Route path="/teachers" element={<Teachers editable={false} />} />
												<Route path="/teachers/edit" element={<Teachers editable={true} />} />
												<Route path="/groups" element={<Groups />} />
												<Route path="/groups/:id" element={<Groups />} />
												<Route path="/addUsers/:role/:id" element={<AddUsersToGroup />} />
												<Route path="/scholarship" element={<Scholarship editable={true} canAdd={true} canDelete={true} />} />
												<Route path="/" element={<Home />} />
												<Route path="*" element={<Navigate to="/" />} />
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
