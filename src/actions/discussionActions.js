import { socket } from "./socket";
import { getValue, setValue } from "../api/local";

import {
	JOIN_DISCUSSION,
	JOIN_DISCUSSION_FULFILLED,
	LOAD_DISCUSSION_PROGRESS,
	LOAD_DISCUSSION_FULFILLED,
	ERROR_BAD_PSEUDONYM,
	LOAD_DISCUSSION,
	BLOCK_SAVED,
	BLOCK_UNSAVED,
	BLOCK_TAGGED,
	BLOCK_UNTAGGED,
	POST_CREATED,
	ADD_POST,
	ADD_POST_FULFILLED,
	SUBSCRIBED_TO_DISCUSSION,
} from "./types";

const joinDiscussion = (discussionID, userID, pseudonym) => {
	// join a discussion with a pseudonym and session ID
	const data = {
		name: pseudonym,
		discussion_id: discussionID,
		user_id: userID,
	};
	return (dispatch) => {
		dispatch({ type: JOIN_DISCUSSION });
		socket.emit("join_discussion", data, (res) => {
			try {
				res = JSON.parse(res);
				dispatch({
					type: JOIN_DISCUSSION_FULFILLED,
					payload: {
						id: discussionID,
						title: res.title,
						theme: res.theme,
					},
				});
				// add the discussion to the local list of discussions we've joined
				let discussions = getValue("joinedDiscussions");
				if (discussions === null) {
					setValue("joinedDiscussions", [discussionID]);
				} else if (!discussions.includes(discussionID)) {
					discussions.push(discussionID);
					setValue("joinedDiscussions", discussions);
				}
			} catch (e) {
				console.log(e);
				dispatch({
					type: ERROR_BAD_PSEUDONYM,
					payload: {
						id: discussionID,
						error: "BAD_PSEUDONYM",
					},
				});
			}
		});
	};
};

const loadBlockHelper = (discussionID, blockID) => {
	const data = {
		discussion_id: discussionID,
		block_id: blockID,
	};
	return new Promise((resolve) => {
		socket.emit("get_block", data, (res) => {
			res = JSON.parse(res);
			resolve(res);
		});
	});
};

const loadDiscussion = (discussionID) => {
	return (dispatch) => {
		dispatch({ type: LOAD_DISCUSSION });
		// load the discussions' posts and the posts' blocks.
		const data = { discussion_id: discussionID };
		socket.emit("get_posts", data, (res) => {
			try {
				res = JSON.parse(res);
				const loadedPosts = res;

				// count the number of total blocks to load
				const blocks = res.reduce(
					(t, { blocks }) => t + blocks.length,
					0
				);

				const loadedBlocks = {};

				// load each post's blocks
				for (const postsInd in res) {
					const post = res[postsInd];

					for (const blocksInd in post.blocks) {
						const block = post.blocks[blocksInd];

						// load the block
						loadBlockHelper(discussionID, block).then((data) => {
							// add the block's content to the loaded block object
							const blockClone = Object.assign({}, data);
							delete blockClone.block_id;
							loadedBlocks[data.block_id] = blockClone;

							// increment the number of blocks loaded so far
							dispatch({
								type: LOAD_DISCUSSION_PROGRESS,
								payload: { total: blocks },
							});

							// if this is the last block, dispatch the task is fulfilled and
							// send the posts and blocks
							if (
								parseInt(blocksInd) ===
									post.blocks.length - 1 &&
								parseInt(postsInd) === res.length - 1
							) {
								dispatch({
									type: LOAD_DISCUSSION_FULFILLED,
									payload: {
										blocks: loadedBlocks,
										posts: loadedPosts,
									},
								});
							}
						});
					}
				}
			} catch (e) {
				console.log(e);
			}
		});
	};
};

const subscribeToDiscussion = (discussionID) => {
	return (dispatch) => {
		socket.on("saved_block", (data) => {
			data = JSON.parse(data);
			dispatch({
				type: BLOCK_SAVED,
				payload: { blockID: data.block_id },
			});
		});
		socket.on("unsaved_block", (data) => {
			data = JSON.parse(data);
			dispatch({
				type: BLOCK_UNSAVED,
				payload: { blockID: data.block_id },
			});
		});
		socket.on("tagged_block", (data) => {
			data = JSON.parse(data);
			dispatch({
				type: BLOCK_TAGGED,
				payload: {
					blockID: data.block_id,
					userID: data.user_id,
					tag: data.tag,
				},
			});
		});
		socket.on("untagged_block", (data) => {
			data = JSON.parse(data);
			dispatch({
				type: BLOCK_UNTAGGED,
				payload: { blockID: data.block_id, tag: data.tag },
			});
		});
		socket.on("created_post", (data) => {
			const post = JSON.parse(data);

			const loadedBlocks = {};

			// load the new post's blocks
			for (const blocksInd in post.blocks) {
				const block = post.blocks[blocksInd];

				// load the block
				loadBlockHelper(discussionID, block).then((data) => {
					// add the block's content to the loaded block object
					const blockClone = Object.assign({}, data);
					delete blockClone.block_id;
					loadedBlocks[data.block_id] = blockClone;

					// if this is the last block to be loaded, dispatch the create event
					if (parseInt(blocksInd) === post.blocks.length - 1) {
						dispatch({
							type: POST_CREATED,
							payload: { post: post, blocks: loadedBlocks },
						});
					}
				});
			}
		});
		dispatch({
			type: SUBSCRIBED_TO_DISCUSSION,
		});
	};
};

const addPostToDiscussion = (discussionID, userID, blocks) => {
	return (dispatch) => {
		const data = {
			discussion_id: discussionID,
			user_id: userID,
			blocks: blocks,
		};

		dispatch({
			type: ADD_POST,
		});
		socket.emit("create_post", data, (res) => {
			dispatch({
				type: ADD_POST_FULFILLED,
			});
		});
	};
};

export {
	joinDiscussion,
	loadDiscussion,
	subscribeToDiscussion,
	addPostToDiscussion,
};
