import React from "react";

import { makeSearch } from "../api";

import "./EmbedMenu.css";

class EmbedMenu extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			recs: [],
		};
	}

	componentDidUpdate() {
		if (this.props.query.length > 0) {
			makeSearch(this.props.query, (data) => {
				console.log(data);
			});
		}
	}

	render() {
		return <div className="embed-menu-wrapper">Menu</div>;
	}
}

export default EmbedMenu;
