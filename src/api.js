import openSocket from "socket.io-client";
const socket = openSocket("http://localhost:5000");

socket.on("~connect", (res) => {
	console.log(res.data);
});

// function subscribeToTimer(cb) {
// 	socket.on("timer", (timestamp) => cb(null, timestamp));
// 	socket.emit("subscribeToTimer", 1000);
// }

const ensureConnectedThen = (func) => {
	if (socket.connected) {
		func();
	} else {
		return Error("Not connected! Reload the page to reconnect.");
	}
};

const createUser = (ip, func) => {
	ensureConnectedThen(() => {
		//socket.on("~create_user", (data) => func(data));
		socket.emit("create_user", { user_id: ip }, (data) => {
			func(data);
		});
	});
};

// const createPost = (data, func) => {
// 	if (socket.connected) {
// 		socket.emit("");
// 	} else {
// 		return Error("Not Connected");
// 	}
// };

export { createUser };
