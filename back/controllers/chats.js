const { request } = require('http');
const db = require('../config/db.js');

const getChatrooms = (request, response) => {
	const user = request.user.id;

	const sql = "SELECT * FROM chatrooms WHERE user1 = ? OR user2 = ?;"
	db.query(sql, [user, user], function (error, result) {
		if (error) {
			console.log(error)
			response.send('error');
		} else {
			console.log(result)
			response.send(result)
		}
	})
}

const authorizeRoomAccess = (request, response) => {
	const user = request.user.id;
	const room = request.body.room;

	const sql = "SELECT * FROM chatrooms WHERE id = ?"
	db.query(sql, [room], function (error, result) {
		if (error) {
			console.log(error)
			response.send('error');
		} else if (result.length === 0) {
			response.send('forbid')
		} else {
			if (result[0].user1 === user || result[0].user2 === user) {
				response.send('authorize')
			} else {
				response.send('forbid')
			}
		}
	})
}

const getMessages = (request, response) => {
	const room = request.body.room;

	const sql = "SELECT * FROM messages WHERE chatroom_id = ?";
	db.query(sql, [room], (error, result) => {
		if (error) {
			console.log(error);
			response.send('error');
		} else {
			response.send(result);
		}
	})
}

const sendMessage = (request, response) => {

	const room = parseInt(request.body.room);
	const message = request.body.message;
	const sender = request.user.id;

	const sql = "INSERT INTO messages (chatroom_id, sender, body) VALUES (?, ?, ?);"
	db.query(sql, [room, sender, message], (error, result) => {
		if (error) {
			console.log(error);
			response.send('error');
		} else {
			response.send('ok');
		}
	})
}

module.exports = {
	getChatrooms,
	authorizeRoomAccess,
	getMessages,
	sendMessage
};