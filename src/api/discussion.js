import { listener, getter, setter } from "./apiConnection";

// discussion stuff
const getDiscusions = (func) => {
	getter("get_discussions", null, false, func);
};

const joinDiscussion = (data, func) => {
	setter("join_discussion", { discussion_id: data }, true, func);
};

const leaveDiscussion = (data, func) => {
	setter("leave_discussion", { discussion_id: data }, true, func);
};

export { getDiscusions, joinDiscussion, leaveDiscussion };
