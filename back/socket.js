const db = require("./config/db.js");

const socketServer = (server) => {
	const io = require("socket.io")(server, {
		cors: {
			origin: "http://localhost:3000",
		},
	});

	io.on("connection", (socket) => {
		console.log(`socket ${socket.id} connected`);

		// send an event to the client
		socket.on("login", () => { // listen to the event
			const sql = `SELECT user_id FROM loggedinusers`;
			db.query(sql, (error, result) => {
				if (error)
					console.log(error);
				else {
					console.log(result);
					const users = result.map(user => {
						return user.user_id;
					})
					console.log(users)
					io.emit("logged", users);
				}
			})
			socket.on("disconnect", () => {
				console.log("User Disconnected", socket.id);
			});
		});
		socket.on("notification", (data) => {
			console.log(data);
			socket.broadcast.emit('receive notification',data);
		})

	})
} 

module.exports = {
	socketServer
};