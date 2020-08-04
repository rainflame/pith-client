import React from "react";

import "./style/TagEditor.css";

class TagEditor extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			visible: this.props.visible,
			value: "",
			editing: false,
		};

		this.handleKeypress = this.handleKeypress.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.checkFocus = this.checkFocus.bind(this);
	}

	checkFocus() {
		if (this.inputRef) {
			this.inputRef.focus();
		}
	}

	componentDidUpdate() {
		if (this.props.visible && !this.state.visible) {
			this.setState({ visible: true, editing: true }, () => {
				this.checkFocus();
			});
		}
	}

	handleKeypress(e) {
		if (e.keyCode === 13) {
			this.props.addTag(this.state.value);
			this.setState({ editing: false, value: "", visible: true });
			e.preventDefault();
		} else if (e.keyCode === 8) {
			if (this.state.value.length === 0) {
				this.setState({ editing: false });
			}
		}
	}

	handleChange(e) {
		this.setState({ value: e.target.value });
	}

	render() {
		let editor;
		if (this.state.editing) {
			editor = (
				<input
					ref={(input) => {
						this.inputRef = input;
					}}
					className="tag-input"
					type="text"
					placeholder="New tag"
					onKeyDown={this.handleKeypress}
					value={this.state.value}
					onChange={this.handleChange}
				/>
			);
		} else if (this.props.tags && Object.keys(this.props.tags).length > 0) {
			editor = (
				<div
					className="tag-button"
					onClick={() => {
						this.setState({ editing: true }, () =>
							this.checkFocus()
						);
					}}
				>
					+
				</div>
			);
		}
		const tags = [];
		for (const tag in this.props.tags) {
			const newElt = (
				<div className="tag" key={tag}>
					{tag}
					{this.props.tags[tag].owner === this.props.userID ? (
						<div
							className="tag-close"
							onClick={() => this.props.removeTag(tag)}
						>
							×
						</div>
					) : (
						<div></div>
					)}
				</div>
			);
			tags.push(newElt);
		}

		if (!this.props.visible && tags.length === 0) {
			return null;
		}

		return (
			<div className="tag-wrapper">
				<div className="tags">
					{tags}
					{editor}
				</div>
			</div>
		);
	}
}

export default TagEditor;
