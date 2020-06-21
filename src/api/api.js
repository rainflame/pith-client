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

const addTagToBlock = (data, func) => {
	setter("block_add_tag", { block_id: data.id, tag: data.tag }, false, func);
};

const removeTagFromBlock = (data, func) => {
	setter(
		"block_remove_tag",
		{ block_id: data.id, tag: data.tag },
		false,
		func
	);
};

const getSavedBlocks = (func) => {
	getter("get_saved_blocks", null, true, func);
};

const getBlock = (data, func) => {
	getter("get_block", { block_id: data }, false, func);
};

const listenForSavedBlocks = (func) => {
	listener("block_saved", func);
};

const listenForUpdatedBlocks = (func) => {
	listener("updated_block", func);
};

// searching
const makeSearch = (data, func) => {
	getter("search_all", { query: data }, true, func);
};

export {
	createPost,
	getPosts,
	getBlock,
	saveBlock,
	listenForCreatedPosts,
	listenForSavedBlocks,
	listenForUpdatedBlocks,
	getSavedBlocks,
	removeTagFromBlock,
	makeSearch,
	addTagToBlock,
};
