import React from "react";
import { connect } from "react-redux";

import NameEditor from "./NameEditor";
import Chat from "./Chat";
// import Library from "./Library";

import { getValue } from "../api/local";

import { registerUser } from "../actions/userActions";
import {
	joinDiscussion,
	loadDiscussion,
	subscribeToDiscussion,
	addPostToDiscussion,
	addTagToBlock,
	removeTagFromBlock,
	saveBlock,
	unsaveBlock,
	blockSearch,
	tagSearch,
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
		savedBlocks: state.discussion.savedBlocks,
		posts: state.discussion.posts,
		searchResults: state.discussion.searchResults,
	};
}

class Discussion extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			autojoin: true,
		};
		this.unpackProps = this.unpackProps.bind(this);
		this.joinDiscussionWithName = this.joinDiscussionWithName.bind(this);
		this.addPost = this.addPost.bind(this);

		this.addTag = this.addTag.bind(this);
		this.removeTag = this.removeTag.bind(this);
		this.saveBlock = this.saveBlock.bind(this);
		this.unsaveBlock = this.unsaveBlock.bind(this);

		this.blockSearch = this.blockSearch.bind(this);
		this.tagSearch = this.tagSearch.bind(this);
	}

	componentDidMount() {
		const { dispatch } = this.props;
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
			} else {
				this.setState({ autojoin: false });
			}
		} else if (
			this.props.joined &&
			!this.props.loading &&
			!this.props.loaded
		) {
			// when we've joined, start loading the discussion
			dispatch(
				loadDiscussion(this.props.discussionID, this.props.userID)
			);
		} else if (
			this.props.joined &&
			this.props.loaded &&
			!this.props.subscribed
		) {
			// once everything is loaded, we can subscribe to new events
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

	addTag(blockID, tag) {
		const [params, dispatch] = this.unpackProps();
		dispatch(
			addTagToBlock(params.discussionID, this.props.userID, blockID, tag)
		);
	}

	removeTag(blockID, tag) {
		const [params, dispatch] = this.unpackProps();
		dispatch(
			removeTagFromBlock(
				params.discussionID,
				this.props.userID,
				blockID,
				tag
			)
		);
	}

	saveBlock(blockID) {
		const [params, dispatch] = this.unpackProps();
		dispatch(saveBlock(params.discussionID, this.props.userID, blockID));
	}

	unsaveBlock(blockID) {
		const [params, dispatch] = this.unpackProps();
		dispatch(unsaveBlock(params.discussionID, this.props.userID, blockID));
	}

	blockSearch(query) {
		const [params, dispatch] = this.unpackProps();
		dispatch(blockSearch(params.discussionID, query));
	}

	tagSearch(query) {
		const [params, dispatch] = this.unpackProps();
		dispatch(tagSearch(params.discussionID, query));
	}

	render() {
		if (this.props.userID && !this.props.joined && !this.state.autojoin) {
			return (
				<NameEditor
					badPseudonym={this.props.badPseudonym}
					onSubmit={this.joinDiscussionWithName}
				/>
			);
		} else if (this.props.joined && this.props.loading) {
			return (
				<div className="discussion-loading">
					Loading discussion
					{this.props.totalToLoad > 0
						? ` (${this.props.numLoaded}/${this.props.totalToLoad})`
						: "..."}
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
						savedBlocks={this.props.savedBlocks}
						posts={[...this.props.posts]}
						addPost={this.addPost}
						addTag={this.addTag}
						removeTag={this.removeTag}
						saveBlock={this.saveBlock}
						unsaveBlock={this.unsaveBlock}
						userID={this.props.userID}
						tagSearch={this.tagSearch}
						blockSearch={this.blockSearch}
						searchResults={this.props.searchResults}
					/>
				</div>
			);
		} else {
			return null;
		}
	}
}

export default connect(mapStateToProps)(Discussion);
