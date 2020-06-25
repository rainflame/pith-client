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
			userRecs: [],
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

			// no need to do this since each block knows if it's saved
			// makeUserSearch(this.props.query, (data) => {
			// 	this.setState({
			// 		userRecs: data.blocks,
			// 		sentQuery: this.props.query,
			// 	});
			// });
		}
	}

	render() {
		const clickBlocks = this.state.recs.map((id) => {
			return (
				<Block
					id={id}
					showSaved
					key={id}
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
				{clickBlocks.length > 0 ? (
					clickBlocks
				) : (
					<div className="removed-loader" />
				)}
			</div>
		);
	}
}

export default EmbedMenu;
