import React from "react";

import "./EmbedMenu.css";

class EmbedMenu extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			recs: [],
		};
	}

	render() {
		return <div className="embed-menu-wrapper">Menu</div>;
	}
}

export default EmbedMenu;
