import React from "react";

import { getBlock, saveBlock } from "../api";

import "./Block.css";

class Block extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			id: this.props.id,
			content: "Loading...",
		};

		this.saveBlock = this.saveBlock.bind(this);
	}

	componentDidMount() {
		getBlock(this.state.id, (data) => {
			this.setState({ content: data.body });
		});
	}

	saveBlock(e) {
		saveBlock(this.state.id, (data) => {
			console.log("Block saved!");
		});
	}

	render() {
		let save;
		if (this.props.save) {
			save = (
				<div className="block-controls">
					<div onClick={this.saveBlock}>Save</div>
				</div>
			);
		}
		return (
			<div className="block-wrapper">
				<div className="block">{this.state.content}</div>
				{save}
			</div>
		);
	}
}

export default Block;
