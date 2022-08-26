// First we import the named libraries: React, lodash, react-router-dom, etc.
import React from "react";

// Secondly we import our types, pages, components and lastly images.
import Teachers from "./pages/teachers/Teachers";

// Lastly we import our stylesheets.
import "./App.css";

function App(): React.ReactElement {
	return (
		<div className="App">
			<Teachers />
		</div>
	);
}

export default App;
