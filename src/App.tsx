// First we import the named libraries: React, lodash, react-router-dom, etc.
import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { observer } from "mobx-react-lite";

// Secondly we import our types, core elements, pages, components and lastly images.
import { DataStore } from "./core/DataStore";
import Login from "./pages/login/Login";
import Teachers from "./pages/teachers/Teachers";

// Lastly we import our stylesheets.
import "./App.css";

function App(): React.ReactElement {
	const loggedUser = DataStore.getInstance().loggedUser;

	return (
		<div className="App">
			<BrowserRouter>
				<Routes>
					{loggedUser ? (
						<>
							<Route path="/teachers" element={<Teachers />} />
							<Route path="*" element={<Teachers />} />
						</>
					) : (
						<>
							<Route path="/login" element={<Login />} />
							<Route path="*" element={<Navigate to="/login" />} />
						</>
					)}
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default observer(App);
