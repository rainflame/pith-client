import React from "react";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import {
	getDiscussions,
	listenForNewDiscussion,
	createDiscussion,
} from "../api/discussion";

class Board extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			discussions: [],
		};

		this.createDiscussion = this.createDiscussion.bind(this);
	}

	componentDidMount() {
		const {
			match: { params },
		} = this.props;
		this.setState({ id: params.boardId });

		getDiscussions((data) => {
			this.setState({ discussions: data });
		});

		listenForNewDiscussion((data) => {
			console.log(data);
			const discussions = this.state.discussions;
			discussions.push(data._id);
			this.setState({ discussions: discussions });
		});
	}

	createDiscussion() {
		createDiscussion((data) => {
			console.log("new discussion created!");
		});
	}

	render() {
		const discussions = this.state.discussions.map((discussion) => {
			console.log(discussion);
			return (
				<Link to={`${this.state.id}/d/${discussion}`} key={discussion}>
					<div>{`Discussion ${discussion}`}</div>
				</Link>
			);
		});
		return (
			<div>
				{discussions}
				<div onClick={this.createDiscussion}>Create new discussion</div>
			</div>
		);
	}
}

export default Board;
