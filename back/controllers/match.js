const db = require('../config/db.js');

const likeDislike = (request, response) => {
    // console.log(request.body);
    // console.log(request.user);
	const user1 = request.user.id;
	const user2 = request.body.target;
	const like1 = request.body.like;
	let sql = "SELECT * FROM matches WHERE (user1 = ? AND user2 = ?) OR (user1 = ? AND user2 = ?)";
	db.query(sql, [user1, user2, user2, user1], (error, result) => {
		if (error)  throw error;
		else {
			if (result.length === 0) {
				sql = "INSERT INTO matches (user1, user2, like1) VALUES (?,?,?)";
				db.query(sql, [user1, user2, like1], (error, result) => {
					if (error)
						response.send('upsi in matches insert :(');
					else
						response.send('good');
				})
			} else {
				const like2 = result[0].like1;
				const matchId = result[0].id;
				if (like1 === true && like2 === 1) {
					sql = "UPDATE matches SET like2 = ?, matched = true WHERE id = ?"
					db.query(sql, [like1, matchId], function (error, result) {
						if (error) {
							// console.log(error)
							response.send('error matches')
						} else {
							// console.log('something')
							response.send('all gucci belushi')
						}
					})
				} else if (like1 !== true) {
					sql = "UPDATE matches SET like2 = ?, matched = false, block = true WHERE id = ?"
					db.query(sql, [like1, matchId], function (error, result) {
						if (error) {
							// console.log(error)
							response.send('error matches')
						} else {
							// console.log('something')
							response.send('all gucci belushi')
						}
					})
				}
				// response.send('w4k4nd4 4 3v3r')
			}
		}
	})

}

module.exports = {
	likeDislike
}