import openSocket from "socket.io-client";
const socket = openSocket("http://localhost:5000");

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
				func();
			});
		});
};

const ensureConnectedThen = (func) => {
	if (socket.connected && user.id) {
		func();
	} else {
		connectAndCreateUser(func);
	}
};

const createPost = (data, func) => {
	ensureConnectedThen(() => {
		const payload = { user_id: user.id, blocks: data };
		socket.emit("create_post", payload, (data) => {
			func(JSON.parse(data));
		});
	});
};

const getPosts = (func) => {
	ensureConnectedThen(() => {
		socket.emit("get_posts", (data) => {
			func(JSON.parse(data));
		});
	});
};

const saveBlock = (data, func) => {
	ensureConnectedThen(() => {
		const payload = { user_id: user.id, block_id: data };
		socket.emit("save_block", payload, (data) => {
			func(JSON.parse(data));
		});
	});
};

const getSavedBlocks = (func) => {
	ensureConnectedThen(() => {
		const payload = { user_id: user.id };
		socket.emit("get_saved_blocks", payload, (data) => {
			func(JSON.parse(data));
		});
	});
};

const getBlock = (data, func) => {
	ensureConnectedThen(() => {
		const payload = { block_id: data };
		socket.emit("get_block", payload, (data) => {
			func(JSON.parse(data));
		});
	});
};

const listenForCreatedPosts = (func) => {
	ensureConnectedThen(() => {
		socket.on("post_created", (data) => {
			func(JSON.parse(data));
		});
	});
};

const listenForSavedBlocks = (func) => {
	ensureConnectedThen(() => {
		socket.on("block_saved", (data) => {
			func(JSON.parse(data));
		});
	});
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
