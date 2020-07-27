import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";

import Board from "./components/Board";
import Discussion from "./components/Discussion";

function App() {
	return (
		<div className="App">
			<Router>
				<Switch>
					<Route
						exact
						path="/b/:boardId/d/:discussionId"
						component={Discussion}
					/>
					<Route exact path="/b/:boardId" component={Board} />
				</Switch>
			</Router>
		</div>
	);
}

export default App;
