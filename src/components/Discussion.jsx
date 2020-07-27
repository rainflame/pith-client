import React from "react";

import NameEditor from "./NameEditor";
import Chat from "./Chat";
import Library from "./Library";

import { joinDiscussion } from "../api/discussion";
import { saveValue, getValue } from "../api/local";

import "./style/Discussion.css";

class Discussion extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			chooseName: true,
		};
		this.joinDiscussion = this.joinDiscussion.bind(this);
	}

	componentDidMount() {
		const {
			match: { params },
		} = this.props;

		this.setState({ id: params.discussionId }, () => {
			// try to retrieve the discussion id from localstorage (indicating we've
			// already joined it previously and don't need to make a new name)
			const name = getValue(params.discussionId);
			if (name !== null) {
				this.joinDiscussion(name);
			}
		});
	}

	joinDiscussion(name) {
		this.setState({ chooseName: false }, () => {
			joinDiscussion(
				{ discussionId: this.state.id, name: name },
				(data) => {
					console.log("joined discussion!");
					this.setState({ title: data.title, theme: data.theme });

					// save the discussion id in localstorage to indicate that we've
					// already joined it once
					saveValue(this.state.id, name);
				}
			);
		});
	}

	render() {
		if (this.state.chooseName) {
			return <NameEditor onSubmit={this.joinDiscussion} />;
		} else if (this.state.title) {
			return (
				<div className="discussion-wrapper">
					<div className="discussion-title-wrapper">
						<h1>{this.state.title}</h1>
						<div className="discussion-theme">
							{this.state.theme}
						</div>
					</div>
					<Chat id={this.state.id} />
				</div>
			);
		}
		return <div></div>;
	}
}

export default Discussion;
