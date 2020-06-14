import openSocket from "socket.io-client";
const socket = openSocket("http://localhost:5000");

let waitingForResponse = false;

let user = {
	id: "",
};

const connectAndCreateUser = (func) => {
	// get the client's IP address
	const req = new Request("https://rainflame.com/cdn-cgi/trace");
	fetch(req)
		.then((response) => response.text())
		.then((text) => {
			const ip = text.substr(text.indexOf("ip=") + 3, 37);

			const payload = { user_id: btoa(ip) };
			socket.emit("create_user", payload, (data) => {
				// save the user id so we can use it later when creating posts etc
				user.id = JSON.parse(data)._id;
				console.log("Connected!");
				waitingForResponse = false;
				func();
			});
		});
};

const ensureConnectedThen = (func, listenEvent) => {
	if (socket.connected && user.id) {
		// if a request has already been made and we're waiting for a response
		if (!listenEvent && waitingForResponse) {
			// set a timeout so we don't make too many requests at once
			//console.log("API busy, waiting to send request");
			setTimeout(() => {
				ensureConnectedThen(func, listenEvent);
			}, 50);
		} else {
			waitingForResponse = listenEvent ? false : true;
			//console.log("Sent request");
			func();
		}
	} else if (!waitingForResponse) {
		waitingForResponse = true;
		connectAndCreateUser(func);
	} else if (waitingForResponse) {
		// in the case that we've already sent the connection event, wait
		// this could get into an infinite loop if there's a problem
		// connecting, so we should fix this at some point
		setTimeout(() => {
			//console.log("waiting!");
			ensureConnectedThen(func, listenEvent);
		}, 50);
	}
};

const listener = (eventName, func) => {
	ensureConnectedThen(() => {
		socket.on(eventName, (data) => {
			waitingForResponse = false;
			func(JSON.parse(data));
		});
	}, true);
};

const setter = (eventName, payload, func) => {
	ensureConnectedThen(() => {
		socket.emit(eventName, payload, (data) => {
			waitingForResponse = false;
			func(JSON.parse(data));
		});
	}, false);
};

const getter = (eventName, payload, func) => {
	if (payload) {
		ensureConnectedThen(() => {
			socket.emit(eventName, payload, (data) => {
				waitingForResponse = false;
				func(JSON.parse(data));
			});
		}, false);
	} else {
		ensureConnectedThen(() => {
			socket.emit(eventName, (data) => {
				waitingForResponse = false;
				func(JSON.parse(data));
			});
		}, false);
	}
};

const createPost = (data, func) => {
	console.log("API: createPost");
	setter("create_post", { user_id: user.id, blocks: data }, func);
};

const getPosts = (func) => {
	console.log("API: getPosts");
	getter("get_posts", null, func);
};

const saveBlock = (data, func) => {
	console.log("API: saveBlock");
	setter("save_block", { user_id: user.id, block_id: data }, func);
};

const getSavedBlocks = (func) => {
	console.log("API: getSavedBlocks");
	getter("get_saved_blocks", { user_id: user.id }, func);
};

const getBlock = (data, func) => {
	console.log("API: getBlock");
	getter("get_block", { block_id: data }, func);
};

const makeSearch = (data, func) => {
	console.log("API: makeSearch");
	getter("search", { query: data }, func);
};

const listenForCreatedPosts = (func) => {
	console.log("API: listenForCreatedPosts");
	listener("post_created", func);
};

const listenForSavedBlocks = (func) => {
	console.log("API: listenForSavedBlocks");
	listener("block_saved", func);
};

const addTagToBlock = (data, func) => {
	console.log("API: addTagToBlock");
	setter("block_add_tag", { block_id: data.id, tag: data.tag }, func);
};

const listenForUpdatedBlocks = (func) => {
	console.log("API: listenForUpdatedBlocks");
	listener("updated_block", func);
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
