import React from "react";
import { connect } from "react-redux";

import NameEditor from "./NameEditor";
import Chat from "./Chat";
import Library from "./Library";

// import { joinDiscussion } from "../api/discussion";
import { saveValue, getValue } from "../api/local";

import { registerUser } from "../actions/userActions";
import {
	joinDiscussion,
	loadDiscussion,
	subscribeToDiscussion,
	addPostToDiscussion,
} from "../actions/discussionActions";

import "./style/Discussion.css";

function mapStateToProps(state) {
	return {
		userID: state.user.id,
		discussionID: state.discussion.id,
		loading: state.discussion.loadingDiscussion,
		loaded: state.discussion.loadedDiscussion,
		joined: state.discussion.joinedDiscussion,
		disussionTitle: state.discussion.title,
		discussionTheme: state.discussion.theme,
		subscribed: state.discussion.subscribed,
		badPseudonym: state.errors.discussion.badPseudonym,
		numLoaded: state.discussion.numLoaded,
		totalToLoad: state.discussion.totalToLoad,
		blocks: state.discussion.blocks,
		posts: state.discussion.posts,
	};
}

class Discussion extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
		this.unpackProps = this.unpackProps.bind(this);
		this.joinDiscussionWithName = this.joinDiscussionWithName.bind(this);
		this.addPost = this.addPost.bind(this);
	}

	componentDidMount() {
		const [params, dispatch] = this.unpackProps();
		dispatch(registerUser());
	}

	componentDidUpdate() {
		const [params, dispatch] = this.unpackProps();
		if (this.props.userID && !this.props.joined) {
			// check if the discussion has been marked as joined in localstorage
			let discussions = getValue("joinedDiscussions");
			if (
				discussions !== null &&
				discussions.includes(params.discussionID)
			) {
				// if it's already been joined, join it again without a name so
				// we don't have to re-enter a pseudonym
				this.joinDiscussionWithName(null);
			}
		} else if (
			this.props.joined &&
			!this.props.loading &&
			!this.props.loaded
		) {
			dispatch(loadDiscussion(this.props.discussionID));
		} else if (
			this.props.joined &&
			this.props.loaded &&
			!this.props.subscribed
		) {
			dispatch(subscribeToDiscussion(this.props.discussionID));
		}
	}

	unpackProps() {
		const {
			match: { params },
			dispatch,
		} = this.props;
		return [params, dispatch];
	}

	joinDiscussionWithName(pseudonym) {
		const [params, dispatch] = this.unpackProps();
		dispatch(
			joinDiscussion(params.discussionID, this.props.userID, pseudonym)
		);
	}

	addPost(blocks) {
		const [params, dispatch] = this.unpackProps();
		dispatch(
			addPostToDiscussion(params.discussionID, this.props.userID, blocks)
		);
	}

	render() {
		if (this.props.userID && !this.props.joined) {
			return (
				<NameEditor
					badPseudonym={this.props.badPseudonym}
					onSubmit={this.joinDiscussionWithName}
				/>
			);
		} else if (this.props.joined && this.props.loading) {
			return (
				<div>
					Loading block {this.props.numLoaded}/
					{this.props.totalToLoad}
				</div>
			);
		} else if (this.props.loaded) {
			return (
				<div className="discussion-wrapper">
					<div className="discussion-title-wrapper">
						<h1>{this.props.disussionTitle}</h1>
						<div className="discussion-theme">
							{this.props.discussionTheme}
						</div>
					</div>
					<Chat
						blocks={this.props.blocks}
						posts={[...this.props.posts]}
						addPost={this.addPost}
					/>
				</div>
			);
		} else {
			return null;
		}
	}
}

export default connect(mapStateToProps)(Discussion);
