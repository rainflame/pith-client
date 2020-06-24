import { listener, getter, setter } from "./apiConnection";

// Post getters/setters
const createPost = (data, func) => {
	setter("create_post", { blocks: data, discussion_id: 42 }, true, func);
};

const getPosts = (func) => {
	getter("get_posts", null, false, func);
};

const listenForCreatedPosts = (func) => {
	listener("post_created", func);
};

// block getters/setters
const saveBlock = (data, func) => {
	setter("save_block", { block_id: data }, true, func);
};

const unsaveBlock = (data, func) => {
	setter("unsave_block", { block_id: data }, true, func);
};

const addTagToBlock = (data, func) => {
	setter("block_add_tag", { block_id: data.id, tag: data.tag }, true, func);
};

const removeTagFromBlock = (data, func) => {
	setter(
		"block_remove_tag",
		{ block_id: data.id, tag: data.tag },
		true,
		func
	);
};

const getSavedBlocks = (func) => {
	getter("get_saved_blocks", null, true, func);
};

const getBlock = (data, func) => {
	getter("get_block", { block_id: data }, true, func);
};

const listenForUpdatedBlocks = (func) => {
	listener("updated_block", func);
};

// searching
const makeSearch = (data, func) => {
	getter("search_all", { query: data }, true, func);
};

const makeUserSearch = (data, func) => {
	getter("search_user_saved", { query: data }, true, func);
};

export {
	createPost,
	getPosts,
	getBlock,
	saveBlock,
	unsaveBlock,
	listenForCreatedPosts,
	listenForUpdatedBlocks,
	getSavedBlocks,
	removeTagFromBlock,
	makeSearch,
	makeUserSearch,
	addTagToBlock,
};
