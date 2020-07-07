import { listener, getter, setter } from "./apiConnection";

// Post getters/setters
const createPost = (data, func) => {
	setter(
		"create_post",
		{ blocks: data.blocks, discussion_id: data.discussionId },
		true,
		func
	);
};

const getPosts = (data, func) => {
	getter("get_posts", { discussion_id: data }, false, func);
};

const listenForCreatedPosts = (func) => {
	listener("created_post", func);
};

export { createPost, getPosts, listenForCreatedPosts };
