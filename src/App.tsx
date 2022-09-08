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
import Sidebar from "./core/Sidebar/Sidebar";
import Navbar from "./core/Navbar/Navbar";

function App(): React.ReactElement {
	const loggedUser = DataStore.getInstance().loggedUser;

	return (
		<div className="App">
			<BrowserRouter>
				<div className="container">
					<div className="navbar">
						<Navbar></Navbar>
					</div>
					<div className="content">
						<Sidebar
							sections={[
								{
									sectionTitle: "Alumnos",
									items: [
										{ title: "Ver Todos", navigationRoute: "/teachers" },
										{ title: "Dar de alta", navigationRoute: "/studentform" },
									],
								},
								{ sectionTitle: "Grupos", items: [{ title: "a", navigationRoute: "/CSVUploader" }] },
							]}
						/>

						<div className="page-container">
							<Routes>
								{loggedUser ? (
									<>
										<Route path="/teachers" element={<Teachers />} />
										<Route path="/studentform" element={<StudentForm />} />
										<Route path="/CSVUploader" element={<CSVUploader />} />
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
