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
			}, 100);
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
		}, 100);
	}
};

const createPost = (data, func) => {
	console.log("API: createPost");
	ensureConnectedThen(() => {
		const payload = { user_id: user.id, blocks: data };
		socket.emit("create_post", payload, (data) => {
			waitingForResponse = false;
			func(JSON.parse(data));
		});
	}, false);
};

const getPosts = (func) => {
	console.log("API: getPosts");
	ensureConnectedThen(() => {
		socket.emit("get_posts", (data) => {
			waitingForResponse = false;
			func(JSON.parse(data));
		});
	}, false);
};

const saveBlock = (data, func) => {
	console.log("API: saveBlock");
	ensureConnectedThen(() => {
		const payload = { user_id: user.id, block_id: data };
		socket.emit("save_block", payload, (data) => {
			waitingForResponse = false;
			func(JSON.parse(data));
		});
	}, false);
};

const getSavedBlocks = (func) => {
	console.log("API: getSavedBlocks");
	ensureConnectedThen(() => {
		const payload = { user_id: user.id };
		socket.emit("get_saved_blocks", payload, (data) => {
			waitingForResponse = false;
			func(JSON.parse(data));
		});
	}, false);
};

const getBlock = (data, func) => {
	console.log("API: getBlock");
	ensureConnectedThen(() => {
		const payload = { block_id: data };
		socket.emit("get_block", payload, (data) => {
			waitingForResponse = false;
			func(JSON.parse(data));
		});
	}, false);
};

const listenForCreatedPosts = (func) => {
	console.log("API: listenForCreatedPosts");
	ensureConnectedThen(() => {
		socket.on("post_created", (data) => {
			waitingForResponse = false;
			func(JSON.parse(data));
		});
	}, true);
};

const listenForSavedBlocks = (func) => {
	console.log("API: listenForSavedBlocks");
	ensureConnectedThen(() => {
		socket.on("block_saved", (data) => {
			waitingForResponse = false;
			func(JSON.parse(data));
		});
	}, true);
};

export {
	createPost,
	getPosts,
	getBlock,
	saveBlock,
	listenForCreatedPosts,
	listenForSavedBlocks,
	getSavedBlocks,
};
