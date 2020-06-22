import React from "react";

import Block from "./Block";

import { makeSearch } from "../api/api";

import "./EmbedMenu.css";

class EmbedMenu extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			sentQuery: "",
			recs: [],
		};
	}

	componentDidUpdate() {
		this.props.onChange();

		if (
			this.props.query.slice(-1) === " " &&
			this.props.query !== this.state.sentQuery
		) {
			makeSearch(this.props.query, (data) => {
				this.setState({
					recs: data.blocks,
					sentQuery: this.props.query,
				});
			});
		}
	}

	render() {
		const clickBlocks = this.state.recs.map((id) => {
			return (
				<Block
					id={id}
					style={{ cursor: "pointer" }}
					transcluded={true}
					uneditable={true}
					onClick={(content) => this.props.onClick(content, id)}
				></Block>
			);
		});
		return (
			<div className="embed-menu-wrapper">
				<div className="embed-menu-title">Block Search</div>
				{clickBlocks}
			</div>
		);
	}
}

export default EmbedMenu;
