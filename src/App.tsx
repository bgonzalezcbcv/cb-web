// First we import the named libraries: React, lodash, react-router-dom, etc.
import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { observer } from "mobx-react-lite";

// Secondly we import our types, core elements, pages, components and lastly images.
import { DataStore } from "./core/DataStore";
import Login from "./pages/login/Login";
import Teachers from "./pages/teachers/Teachers";
import CSVUploader from "./pages/teachers/components/csv-uploader/CSVUploader";

// Lastly we import our stylesheets.
import "./App.css";
import StudentForm from "./pages/studentForm/StudentForm";
import Sidebar from "./components/Sidebar/Sidebar";
import Navbar from "./components/Navbar/Navbar";
import { getSidebarPropsByUserRole } from "./core/userRoleHelper";

function App(): React.ReactElement {
	const loggedUser = DataStore.getInstance().loggedUser;

	const sidebarSections = getSidebarPropsByUserRole(loggedUser?.role).sections;

	return (
		<div className="App">
			<BrowserRouter>
				<div className="container">
					<div className="navbar">
						<Navbar></Navbar>
					</div>
					<div className="content">
						{loggedUser?.role && <Sidebar sections={sidebarSections} />}

						<div className="page-container">
							<Routes>
								{loggedUser ? (
									<>
										<Route path="/teachers" element={<Teachers />} />
										<Route path="/studentform" element={<StudentForm />} />
										<Route path="/CSVUploader" element={<CSVUploader />} />
										<Route path="/login" element={<Login />} />
										<Route path="*" element={<Teachers />} />
									</>
								) : (
									<>
										<Route path="/login" element={<Login />} />
										<Route path="*" element={<Navigate to="/login" />} />
									</>
								)}
							</Routes>
						</div>
					</div>
				</div>
			</BrowserRouter>
		</div>
	);
}

export default observer(App);
