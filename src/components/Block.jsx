import React from "react";
import TagEditor from "./TagEditor";
import {
	getBlock,
	saveBlock,
	addTagToBlock,
	removeTagFromBlock,
	listenForUpdatedBlocks,
} from "../api/api";

import "./Block.css";

class Block extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			id: this.props.id,
			content: "Loading...",
			tags: [],
			controls: false,
			tagEditor: false,
		};

		this.saveBlock = this.saveBlock.bind(this);
		this.addTagToBlock = this.addTagToBlock.bind(this);
		this.removeTagFromBlock = this.removeTagFromBlock.bind(this);
		this.toggleControls = this.toggleControls.bind(this);
	}

	componentDidMount() {
		getBlock(this.state.id, (data) => {
			this.setState({ content: data.body, tags: data.tags });
		});

		// unsure if it's a good idea to have this listener in each of the block
		// components, but it works for now
		listenForUpdatedBlocks((data) => {
			if (data._id === this.state.id) {
				this.setState({ tags: data.tags, content: data.body });
			}
		});
	}

	saveBlock(e) {
		saveBlock(this.state.id, (data) => {
			console.log("Block saved!");
		});
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
		let save;

		if (this.props.save && this.state.controls) {
			save = (
				<div className="block-controls">
					<div className="block-button" onClick={this.saveBlock}>
						Save
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
		console.log(this.state.tagEditor);
		return (
			<div className="block-wrapper">
				<div className="block">{this.state.content}</div>
				<div
					className="block-toggle-controls"
					onClick={this.toggleControls}
				>
					+ {save}
				</div>

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
