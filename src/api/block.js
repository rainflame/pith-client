import { listener, getter, setter } from "./apiConnection";

// block getters/setters
const saveBlock = (data, func) => {
	setter("save_block", { block_id: data, discussion_id: 42 }, true, func);
};

const unsaveBlock = (data, func) => {
	setter("unsave_block", { block_id: data, discussion_id: 42 }, true, func);
};

const getSavedBlocks = (func) => {
	getter("get_saved_blocks", { discussion_id: 42 }, true, func);
};

const getBlock = (data, func) => {
	getter("get_block", { block_id: data, discussion_id: 42 }, false, func);
};

const addTagToBlock = (data, func) => {
	setter(
		"block_add_tag",
		{ block_id: data.id, tag: data.tag, discussion_id: 42 },
		true,
		func
	);
};

const removeTagFromBlock = (data, func) => {
	setter(
		"block_remove_tag",
		{ block_id: data.id, tag: data.tag, discussion_id: 42 },
		true,
		func
	);
};

// listeners
const listenForSavedBlock = (func) => {
	listener("saved_block", func);
};

const listenForUnsavedBlock = (func) => {
	listener("unsaved_block", func);
};

const listenForTaggedBlock = (func) => {
	listener("tagged_block", func);
};

const listenForUntaggedBlock = (func) => {
	listener("untagged_block", func);
};

export {
	getBlock,
	saveBlock,
	unsaveBlock,
	getSavedBlocks,
	addTagToBlock,
	removeTagFromBlock,
	listenForSavedBlock,
	listenForUnsavedBlock,
	listenForTaggedBlock,
	listenForUntaggedBlock,
};
