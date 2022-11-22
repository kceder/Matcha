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
			console.log('data in socket.js :', data);
			socket.broadcast.emit('receive notification', data);
			socket.on("disconnect", () => {
				console.log("User Disconnected", socket.id);
			});
		})
		socket.on('join_room', (room) => {
			socket.join(room);
			console.log(`${socket.id} joined room ${room}`);
			socket.on("disconnect", () => {
				console.log("User Disconnected", socket.id);
			});
		})
		socket.on('send_message', (data) => {

			io.in(data.room).emit('receive_message', data);
			console.log('hereeeeeeeeeeeeeeeeeeeeeeee')
			socket.broadcast.emit('message_notification', data);
			socket.on("disconnect", () => {
				console.log("User Disconnected", socket.id);
			});
		})
	})
} 

module.exports = {
	socketServer
};