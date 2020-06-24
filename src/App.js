import React from "react";
import "./App.css";

import Library from "./components/Library";
import Discussion from "./components/Discussion";

function App() {
	return (
		<div className="App">
			<div className="wrapper">
				<Library />
				<Discussion />
			</div>
		</div>
	);
}

export default App;
