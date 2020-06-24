import React from "react";

import "./TagEditor.css";

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
			this.props.onAdd(this.state.value);
			this.setState({ editing: false, value: "", visible: false });
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
		} else if (this.props.tags.length > 0) {
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

		const tags = this.props.tags.map((tag) => {
			return (
				<div className="tag" key={tag}>
					{tag}
					<div
						className="tag-close"
						onClick={() => this.props.onRemove(tag)}
					>
						×
					</div>
				</div>
			);
		});

		if (!this.props.visible && tags.length === 0) {
			return <div></div>;
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
