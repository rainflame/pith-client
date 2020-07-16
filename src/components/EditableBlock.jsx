import React from "react";
import BlockSearch from "./BlockSearch";
import AbsoluteMenu from "./AbsoluteMenu";

import "./style/Block.css";

class EditableBlock extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			menu: false,
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleKeypress = this.handleKeypress.bind(this);
		this.checkFocus = this.checkFocus.bind(this);
		this.checkHeight = this.checkHeight.bind(this);
		this.addTransclusion = this.addTransclusion.bind(this);
	}

	checkFocus() {
		if (this.props.focus && !this.state.menu) {
			this.inputRef.focus();
		}
		this.checkHeight();
	}

	checkHeight() {
		// a somewhat iffy way of resizing the box to fit the size of the text
		if (this.inputRef) {
			this.inputRef.style.height = "1px";
			this.inputRef.style.height = this.inputRef.scrollHeight + "px";
		}
	}

	componentDidMount() {
		this.checkFocus();
	}

	componentDidUpdate() {
		this.checkFocus();
	}

	handleChange(e) {
		this.props.onEdit(e.target.value);
	}

	addTransclusion(content, id) {
		this.setState({ menu: false });
		this.props.onNewline(`transclude<${id}> (${content})`, "");
	}

	handleKeypress(e) {
		if (e.keyCode === 8) {
			// on delete key press
			if (this.props.content === "") {
				// delete the block
				this.props.onDelete();
				e.preventDefault();
			} else if (this.inputRef.selectionStart === 0) {
				// add the current content to the previous block and delete
				this.props.onDelete(this.props.content);
				e.preventDefault();
			}
		} else if (e.keyCode === 13) {
			// on enter/return key press
			const cont = this.props.content;
			// get the content before and after the cursor
			const selection = cont.substr(
				this.inputRef.selectionStart,
				cont.length
			);
			const reserved = cont.substr(0, this.inputRef.selectionStart);
			// move the content after to a new block below
			this.props.onNewline(reserved, selection);
			e.preventDefault();
		}

		this.checkHeight();
	}

	render() {
		return (
			<div>
				<textarea
					className="block"
					placeholder="New block"
					type="text"
					ref={(input) => {
						this.inputRef = input;
					}}
					value={this.props.content}
					onChange={this.handleChange}
					onKeyDown={this.handleKeypress}
				/>

				<AbsoluteMenu
					id="search"
					position="left"
					onShow={() => this.setState({ menu: true })}
					onHide={() => this.setState({ menu: false })}
				>
					<BlockSearch
						onClick={this.addTransclusion}
						discussionId={this.props.discussionId}
						focus={this.state.menu}
					/>
				</AbsoluteMenu>
			</div>
		);
	}
}

export default EditableBlock;
