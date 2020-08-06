import React from "react";
import TagEditor from "./TagEditor";
import AbsoluteMenu from "./AbsoluteMenu";

import "./style/Block.css";

class Block extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			controls: false,
			tagEditor: false,
		};
	}

	render() {
		let controls;

		if (!this.props.uneditable) {
			controls = (
				<AbsoluteMenu id={this.props.id}>
					<div
						className="block-button"
						onClick={() => this.props.onReply(this.props.content)}
					>
						Reply
					</div>
					<div className="block-button" onClick={() => {}}>
						Add to summary
					</div>
					<div
						className="block-button"
						onClick={
							this.props.saved
								? this.props.unsaveBlock
								: this.props.saveBlock
						}
					>
						{this.props.saved ? "Unsave" : "Save"}
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
						this.props.transcluded ? "block-transcluded" : ""
					} ${this.props.saved ? "block-saved" : ""} ${
						this.props.dark ? "block-dark" : ""
					}`}
					style={this.props.style ? this.props.style : {}}
					onClick={() =>
						this.props.onClick
							? this.props.onClick(this.props.content)
							: {}
					}
				>
					{this.props.content || "Error loading block"}
					{this.props.showSaved && this.props.saved ? (
						<span className="block-saved-label">Saved Block</span>
					) : null}
				</div>
				{controls}
				<TagEditor
					blockID={this.props.id}
					visible={this.state.tagEditor}
					tags={this.props.tags}
					addTag={this.props.addTag}
					removeTag={this.props.removeTag}
					onClose={() => {
						this.setState({ tagEditor: false });
					}}
					userID={this.props.userID}
				/>
			</div>
		);
	}
}

export default Block;
