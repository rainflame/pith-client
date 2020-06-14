import { listener, getter, setter, user } from "./apiConnection";

// Post getters/setters
const createPost = (data, func) => {
	setter("create_post", { user_id: user.id, blocks: data }, func);
};

const getPosts = (func) => {
	getter("get_posts", null, func);
};

const listenForCreatedPosts = (func) => {
	listener("post_created", func);
};

// block getters/setters
const saveBlock = (data, func) => {
	setter("save_block", { user_id: user.id, block_id: data }, func);
};

const addTagToBlock = (data, func) => {
	setter("block_add_tag", { block_id: data.id, tag: data.tag }, func);
};

const getSavedBlocks = (func) => {
	getter("get_saved_blocks", { user_id: user.id }, func);
};

const getBlock = (data, func) => {
	getter("get_block", { block_id: data }, func);
};

const listenForSavedBlocks = (func) => {
	listener("block_saved", func);
};

const listenForUpdatedBlocks = (func) => {
	listener("updated_block", func);
};

// searching
const makeSearch = (data, func) => {
	getter("search", { query: data }, func);
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
	makeSearch,
	addTagToBlock,
};
