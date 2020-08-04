import React from "react";
import TagEditor from "./TagEditor";
import AbsoluteMenu from "./AbsoluteMenu";
import {
	getBlock,
	saveBlock,
	unsaveBlock,
	addTagToBlock,
	removeTagFromBlock,
	listenForTaggedBlock,
	listenForUntaggedBlock,
	listenForSavedBlock,
	listenForUnsavedBlock,
	addBlockToSummary,
} from "../api/block";

import "./style/Block.css";

class Block extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			ogId: this.props.id,
			id: this.props.id,
			content: this.props.content ? this.props.content : "",
			tags: this.props.tags ? this.props.tags : [],
			controls: false,
			tagEditor: false,
			transcluded: this.props.transcluded,
		};

		this.addTagToBlock = this.addTagToBlock.bind(this);
		this.addToSummary = this.addToSummary.bind(this);
		this.removeTagFromBlock = this.removeTagFromBlock.bind(this);
	}

	addToSummary() {
		const transcludedBlock = `transclude<${this.state.id}>`;
		addBlockToSummary(
			{ discussionId: this.props.discussionId, body: transcludedBlock },
			(data) => {
				console.log("added block to summary!");
			}
		);
	}

	addTagToBlock(tag) {
		const cleanedTag = tag.trim();
		if (cleanedTag !== "" && !(cleanedTag in this.state.tags)) {
			addTagToBlock(
				{
					blockId: this.state.id,
					tag: cleanedTag,
					discussionId: this.props.discussionId,
				},
				(data) => {
					console.log("Added tag!");
				}
			);
		}
		this.setState({ tagEditor: false });
	}

	removeTagFromBlock(tag) {
		removeTagFromBlock(
			{
				blockId: this.state.id,
				tag: tag,
				discussionId: this.props.discussionId,
			},
			(data) => {
				console.log("Removed tag!");
			}
		);
	}

	render() {
		let controls;

		if (!this.props.uneditable) {
			controls = (
				<AbsoluteMenu id={this.state.ogId}>
					<div
						className="block-button"
						onClick={() => this.props.onReply(this.state.content)}
					>
						Reply
					</div>
					<div className="block-button" onClick={this.addToSummary}>
						Add to summary
					</div>
					<div
						className="block-button"
						onClick={this.updateSaveBlock}
					>
						{this.state.saved ? "Unsave" : "Save"}
					</div>
					<div
						className="block-button"
						onClick={() => this.setState({ tagEditor: true })}
					>
						Add Tag
					</div>
				</AbsoluteMenu>
			);
		}

		return (
			<div className="block-wrapper">
				<div
					className={`block ${
						this.state.transcluded ? "block-transcluded" : ""
					} ${this.state.saved ? "block-saved" : ""} ${
						this.props.dark ? "block-dark" : ""
					}`}
					style={this.props.style ? this.props.style : {}}
					onClick={() =>
						this.props.onClick
							? this.props.onClick(this.state.content)
							: {}
					}
				>
					{this.props.content || "Error loading block"}
					{this.props.showSaved && this.state.saved ? (
						<span className="block-saved-label">Saved Block</span>
					) : null}
				</div>
				{controls}
				<TagEditor
					visible={this.state.tagEditor}
					tags={this.state.tags}
					onAdd={this.addTagToBlock}
					onRemove={this.removeTagFromBlock}
				/>
			</div>
		);
	}
}

export default Block;
