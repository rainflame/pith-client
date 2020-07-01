import { getter } from "./apiConnection";

// searching
const makeSearch = (data, func) => {
	getter("search_discussion", { query: data, discussion_id: 42 }, true, func);
};

const makeUserSearch = (data, func) => {
	getter("search_user_saved", { query: data, discussion_id: 42 }, true, func);
};

export { makeSearch, makeUserSearch };
