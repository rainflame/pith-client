import React from "react";

import Block from "./Block";

import {
	listenForSavedBlock,
	listenForUnsavedBlock,
	getSavedBlocks,
} from "../api/block";

import "./style/Library.css";

class Library extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			blocks: [],
		};
	}

	componentDidMount() {
		getSavedBlocks((data) => {
			this.setState({ blocks: data });
		});

		listenForSavedBlock((data) => {
			console.log(data);
			// if (data.saved) {
			// 	const blocks = this.state.blocks;
			// 	if (!this.state.blocks.includes(data._id)) {
			// 		blocks.push(data._id);
			// 		this.setState({ blocks: blocks });
			// 	}
			// } else if (!data.saved && this.state.blocks.includes(data._id)) {
			// 	const blocks = this.state.blocks;
			// 	blocks.splice(blocks.indexOf(data._id), 1);
			// 	this.setState({ blocks: blocks });
			// }
		});

		listenForUnsavedBlock((data) => {
			console.log(data);
		});
	}

	render() {
		const blocks = this.state.blocks.map((block) => {
			return <Block key={block} id={block} save={false} />;
		});
		return (
			<div className="library-wrapper">
				<h2 className="discussion-header">Library</h2>
				{blocks}
			</div>
		);
	}
}

export default Library;
