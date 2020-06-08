import React from "react";

import { getBlock } from "../api";

import "./Block.css";

class Block extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			content: "Loading...",
		};
	}

	componentDidMount() {
		getBlock(this.props.id, (data) => {
			this.setState({ content: data.body });
		});
	}

	render() {
		return <div className="block">{this.state.content}</div>;
	}
}

export default Block;
