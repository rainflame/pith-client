import { combineReducers } from "redux";

import user from "./userReducer";
import chat from "./chatReducer";
import error from "./errorReducer";
import summary from "./summaryReducer";
import discussion from "./discussionReducer";

export default combineReducers({
	user: user,
	chat: chat,
	summary: summary,
	discussion: discussion,
	errors: error,
});
