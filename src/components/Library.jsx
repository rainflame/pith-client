import React from "react";

import Block from "./Block";

import { listenForSavedBlocks, getSavedBlocks } from "../api";

import "./Library.css";

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

		listenForSavedBlocks((data) => {
			const blocks = this.state.blocks;
			blocks.push(data._id);
			this.setState({ blocks: blocks });
		});
	}

	render() {
		const blocks = this.state.blocks.map((block) => {
			return <Block key={block} id={block} save={false} />;
		});
		return <div className="library-wrapper">{blocks}</div>;
	}
}

export default Library;
