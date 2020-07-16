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

		this.updateSaveBlock = this.updateSaveBlock.bind(this);
		this.addTagToBlock = this.addTagToBlock.bind(this);
		this.removeTagFromBlock = this.removeTagFromBlock.bind(this);
		this.getBlockContent = this.getBlockContent.bind(this);
	}

	componentDidMount() {
		this.getBlockContent();
	}

	componentDidUpdate() {
		if (this.props.id !== this.state.ogId) {
			this.setState({ ogId: this.props.id, id: this.props.id }, () => {
				this.getBlockContent();
			});
		}
	}

	getBlockContent() {
		getBlock(
			{ blockId: this.state.id, discussionId: this.props.discussionId },
			(data) => {
				if (data !== null) {
					if (data.body.includes("transclude<")) {
						const id = data.body.substring(
							data.body.lastIndexOf("<") + 1,
							data.body.lastIndexOf(">")
						);
						this.setState({ id: id, transcluded: true }, () => {
							this.getBlockContent(id);
						});
					} else {
						this.setState({
							content: data.body,
							tags: data.tags,
							saved: this.props.savedBlocks.includes(
								data.block_id
							),
						});
						// unsure if it's a good idea to have this listener in each of the block
						// components, but it works for now

						listenForTaggedBlock((data) => {
							if (data.block_id === this.state.id) {
								const tags = this.state.tags;
								tags[data.tag] = { owner: data.user_id };
								this.setState({ tags: tags });
							}
						});

						listenForUntaggedBlock((data) => {
							if (data.block_id === this.state.id) {
								const tags = this.state.tags;
								delete tags[data.tag];
								this.setState({ tags: tags });
							}
						});
						listenForSavedBlock((data) => {
							if (data.block_id === this.state.id) {
								this.setState({ saved: true });
							}
						});
						listenForUnsavedBlock((data) => {
							if (data.block_id === this.state.id) {
								this.setState({ saved: false });
							}
						});
					}
				} else {
					this.setState({ content: "Error loading block" });
				}
			}
		);
	}

	updateSaveBlock(e) {
		if (this.state.saved) {
			unsaveBlock(
				{
					blockId: this.state.id,
					discussionId: this.props.discussionId,
				},
				(data) => {
					console.log("Block unsaved!");
				}
			);
		} else {
			saveBlock(
				{
					blockId: this.state.id,
					discussionId: this.props.discussionId,
				},
				(data) => {
					console.log("Block saved!");
				}
			);
		}
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
		let dropdown;
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
					} ${this.state.saved ? "block-saved" : ""}`}
					style={this.props.style ? this.props.style : {}}
					onClick={() =>
						this.props.onClick
							? this.props.onClick(this.state.content)
							: {}
					}
				>
					{this.state.content !== "" ? (
						this.state.content
					) : (
						<div className="loader" />
					)}
					{this.props.showSaved && this.state.saved ? (
						<span className="block-saved-label">Saved Block</span>
					) : (
						<span />
					)}
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
