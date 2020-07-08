import React from "react";

class NameEditor extends React.Component {
	constructor(props) {
		super(props);
		this.state = { value: "" };

		this.handleChange = this.handleChange.bind(this);
		this.handleKeypress = this.handleKeypress.bind(this);
	}

	handleChange(e) {
		this.setState({ value: e.target.value });
	}

	handleKeypress(e) {
		if (e.keyCode === 13) {
			this.props.onSubmit(this.state.value);
		}
	}

	render() {
		return (
			<div>
				Enter a nickname
				<input
					value={this.state.content}
					onChange={this.handleChange}
					onKeyDown={this.handleKeypress}
				/>
				<button onClick={() => this.props.onSubmit(this.state.value)}>
					Join Discussion
				</button>
			</div>
		);
	}
}

export default NameEditor;
