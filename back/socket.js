const db = require("./config/db.js");

const socketServer = (server) => {
	const io = require("socket.io")(server, {
		cors: {
			origin: "http://localhost:3000",
		},
	});
io.on("connection", (socket) => {
		socket.on("login", () => {
			const sql = `SELECT user_id FROM loggedinusers`;
			db.query(sql, (error, result) => {
				if (error)
					console.log(error);
				else {
					const users = result.map(user => {
						return user.user_id;
					})
					io.emit("logged", users);
				}
			})
			socket.removeListener('disconnect', () => {
				console.log('disconnected')
			})
		});
		socket.on("notification", (data) => {
			socket.broadcast.emit('receive notification', data);
			socket.removeListener('disconnect', () => {
				console.log('disconnected')
			})
		})
		socket.on('join_room', (room) => {
			socket.join(room);
			console.log('join room')
			socket.removeListener('disconnect', () => {
				console.log('disconnected')
			})
		})
		socket.on('send_message', (data) => {

			io.in(data.room).emit('receive_message', data);
			socket.broadcast.emit('message_notification', data);
			console.log(data)
			// socket.on("disconnect", () => {
			// 	console.log("User Disconnected", socket.id);
			// });
		})
		socket.removeListener('disconnect', () => {
			console.log('disconnected')
		})
	})
} 
	

module.exports = {
	socketServer
};