import React from "react";
import "./Block.css";

class Block extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return <div className="block">{this.props.content}</div>;
	}
}

export default Block;
