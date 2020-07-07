import { listener, getter, setter } from "./apiConnection";

// discussion stuff
const getDiscussions = (func) => {
	getter("get_discussions", null, false, func);
};

const listenForNewDiscussion = (func) => {
	listener("created_discussion", func);
};

const createDiscussion = (func) => {
	setter("create_discussion", null, false, func);
};

const joinDiscussion = (data, func) => {
	setter("join_discussion", { discussion_id: data }, true, func);
};

const leaveDiscussion = (data, func) => {
	setter("leave_discussion", { discussion_id: data }, true, func);
};

export {
	getDiscussions,
	joinDiscussion,
	leaveDiscussion,
	createDiscussion,
	listenForNewDiscussion,
};
