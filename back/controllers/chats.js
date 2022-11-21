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

module.exports = {
	getChatrooms
};