import React from "react";
import EmbedMenu from "./EmbedMenu";

import "./Block.css";

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
	}

	checkFocus() {
		if (this.props.focus) {
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
			} else if (
				this.state.menu &&
				this.props.content.length <= this.state.index
			) {
				// when we delete the >, close the menu
				this.setState({ menu: false });
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
		} else if (e.keyCode === 220) {
			// on > open the menu
			const cursorInd = this.props.content.length + 1;
			this.setState({
				menu: true,
				index: cursorInd,
			});
		}

		this.checkHeight();
	}

	render() {
		let menu;
		const query = this.props.content.substr(
			this.state.index,
			this.props.content.length
		);

		if (this.state.menu) {
			menu = <EmbedMenu query={query} />;
		}

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
				{menu}
			</div>
		);
	}
}

export default EditableBlock;
