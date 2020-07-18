import React from "react";

import Block from "./Block";

import { makeBlockSearch, makeTagSearch } from "../api/search";

import "./style/BlockSearch.css";

class BlockSearch extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			recs: [],
			value: "",
			failed: false,
		};

		this.handleChange = this.handleChange.bind(this);
		this.blockSearch = this.blockSearch.bind(this);
		this.tagSearch = this.tagSearch.bind(this);
	}

	componentDidUpdate() {
		if (this.props.focus && this.inputRef) {
			this.inputRef.focus();
		}
	}

	handleChange(e) {
		this.setState({ value: e.target.value, failed: false });
	}

	blockSearch() {
		console.log({
			query: this.state.value,
			discussion_id: this.props.discussionId,
		});
		makeBlockSearch(
			{ query: this.state.value, discussionId: this.props.discussionId },
			(data) => {
				this.setState({
					recs: data.blocks,
					failed: data.blocks.length === 0,
				});
			}
		);
	}

	tagSearch() {
		// the tag search expects a list of tags to search by, so split the query
		// into a list on spaces
		const query = this.state.value.split(" ");
		makeTagSearch(
			{ query: query, discussionId: this.props.discussionId },
			(data) => {
				this.setState({
					recs: data.blocks,
					failed: data.blocks.length === 0,
				});
			}
		);
	}

	render() {
		const clickBlocks = this.state.recs.map((id) => {
			return (
				<Block
					id={id}
					discussionId={this.props.discussionId}
					searchContext
					key={id}
					style={{ cursor: "pointer" }}
					transcluded={true}
					uneditable={true}
					onClick={(content) => this.props.onClick(content, id)}
				></Block>
			);
		});
		return (
			<div className="block-search-wrapper">
				<h2>Search discussion</h2>
				<input
					ref={(input) => {
						this.inputRef = input;
					}}
					placeholder="search"
					value={this.state.value}
					onChange={this.handleChange}
				/>
				<div className="block-search-buttons">
					<button onClick={this.blockSearch}>Block search</button>
					<button onClick={this.tagSearch}>Tag search</button>
				</div>
				<div className="block-search-annotation">
					{this.state.failed ? "No results" : ""}
				</div>
				<div className="block-search-suggestions">{clickBlocks}</div>
			</div>
		);
	}
}

export default BlockSearch;
