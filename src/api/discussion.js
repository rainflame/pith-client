import { listener, getter, setter } from "./apiConnection";

// discussion stuff
const getDiscussions = (func) => {
	getter("get_discussions", null, false, func);
};

const listenForNewDiscussion = (func) => {
	listener("created_discussion", func);
};

const createDiscussion = (data, func) => {
	setter(
		"create_discussion",
		{ title: data.title, theme: data.theme, time_limit: data.expiration },
		false,
		func
	);
};

const joinDiscussion = (data, func) => {
	setter(
		"join_discussion",
		{ discussion_id: data.discussionId, name: data.name },
		true,
		func
	);
};

const getDiscussionNames = (data, func) => {
	getter("get_discussion_names", { discussion_id: data }, false, func);
};

const leaveDiscussion = (data, func) => {
	setter("leave_discussion", { discussion_id: data }, true, func);
};

export {
	getDiscussions,
	joinDiscussion,
	leaveDiscussion,
	getDiscussionNames,
	createDiscussion,
	listenForNewDiscussion,
};
