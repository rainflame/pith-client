import { listener, getter, setter } from "./apiConnection";

// block getters/setters
const saveBlock = (data, func) => {
	setter(
		"save_block",
		{ block_id: data.blockId, discussion_id: data.discussionId },
		true,
		func
	);
};

const unsaveBlock = (data, func) => {
	setter(
		"unsave_block",
		{ block_id: data.blockId, discussion_id: data.discussionId },
		true,
		func
	);
};

const getSavedBlocks = (data, func) => {
	getter(
		"get_saved_blocks",
		{ discussion_id: data.discussionId },
		true,
		func
	);
};

const getBlock = (data, func) => {
	getter(
		"get_block",
		{ block_id: data.blockId, discussion_id: data.discussionId },
		false,
		func
	);
};

const addBlockToSummary = (data, func) => {
	setter(
		"summary_add_block",
		{
			body: data.body,
			discussion_id: data.discussionId,
		},
		false,
		func
	);
};

const addTagToBlock = (data, func) => {
	setter(
		"block_add_tag",
		{
			block_id: data.blockId,
			tag: data.tag,
			discussion_id: data.discussionId,
		},
		true,
		func
	);
};

const removeTagFromBlock = (data, func) => {
	setter(
		"block_remove_tag",
		{
			block_id: data.blockId,
			tag: data.tag,
			discussion_id: data.discussionId,
		},
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
	addBlockToSummary,
	removeTagFromBlock,
	listenForSavedBlock,
	listenForUnsavedBlock,
	listenForTaggedBlock,
	listenForUntaggedBlock,
};
