import React from "react";
import TagEditor from "./TagEditor";
import {
	getBlock,
	saveBlock,
	unsaveBlock,
	addTagToBlock,
	removeTagFromBlock,
	listenForUpdatedBlocks,
} from "../api/api";

import "./Block.css";

class Block extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			ogId: this.props.id,
			id: this.props.id,
			content: "",
			tags: [],
			controls: false,
			tagEditor: false,
			transcluded: this.props.transcluded,
		};

		this.updateSaveBlock = this.updateSaveBlock.bind(this);
		this.addTagToBlock = this.addTagToBlock.bind(this);
		this.removeTagFromBlock = this.removeTagFromBlock.bind(this);
		this.toggleControls = this.toggleControls.bind(this);
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
		getBlock(this.state.id, (data) => {
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
						saved: data.saved,
					});
					// unsure if it's a good idea to have this listener in each of the block
					// components, but it works for now
					listenForUpdatedBlocks((data) => {
						if (data._id === this.state.id) {
							this.setState({
								tags: data.tags,
								content: data.body,
								saved: data.saved,
							});
						}
					});
				}
			} else {
				this.setState({ content: "Error loading block" });
			}
		});
	}

	updateSaveBlock(e) {
		if (this.state.saved) {
			unsaveBlock(this.state.id, (data) => {
				console.log("Block unsaved!");
			});
		} else {
			saveBlock(this.state.id, (data) => {
				console.log("Block saved!");
			});
		}
	}

	addTagToBlock(tag) {
		addTagToBlock({ id: this.state.id, tag: tag }, (data) => {
			console.log("Added tag!");
		});
	}

	removeTagFromBlock(tag) {
		removeTagFromBlock({ id: this.state.id, tag: tag }, (data) => {
			console.log("Removed tag!");
		});
	}

	toggleControls() {
		this.setState({ controls: !this.state.controls });
	}

	render() {
		let dropdown;
		let controls;

		if (!this.props.uneditable) {
			if (this.state.controls) {
				controls = (
					<div className="block-controls">
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
					</div>
				);
			}

			dropdown = (
				<div
					className="block-toggle-controls"
					onClick={this.toggleControls}
				>
					<span className="toggle-icon">▼</span> {controls}
				</div>
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
				{dropdown}
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
