const db = require('../config/db.js');

const viewNotification = (request, response) => {
	console.log(request.body)
	console.log(request.user)
	const from_name = request.user.name;
	const from_id = request.user.id;
	const to = request.body.target;

	const content = `${from_name} viewed your profile!`;
	console.log(content);
	let sql = 'SELECT * FROM notifications WHERE `from` = ? AND `to` = ? AND content = ?';
	db.query(sql, [from_id, to, content], (error, result) => {
		if (error) {
			console.log(error);
			response.send('error');
		} else {
			if (result.length === 0) {
				sql = 'INSERT INTO notifications (`from`, `to`, content, `read`) VALUES (?, ?, ?, ?)';
				db.query(sql, [from_id, to, content, false], (error, result) => {
					if (error) {
						console.log(error);
						response.send('error');
					} else {
						response.send({to: to});
					}
				})
			} else {
				sql = 'UPDATE notifications SET time = NOW(), `read` = 0 WHERE id = ?';
				db.query(sql, [result[0].id], (error, result) => {
					if (error) {
						console.log(error);
						response.send('error');
					} else {
						response.send({to: to});
					}
				});
			}
		}
	});

}
const likedNotification = (request, response) => {
	console.log(request.body)
	console.log(request.user)
	const from_name = request.user.name;
	const from_id = request.user.id;
	let to = request.body.target;
	let to2 = {to: 0, from_id: 0};
	console.log('FUBARR:', to2.from_id);

	let content = `${from_name} liked you!`;
	console.log('CONTENT:', content);
	
	const checksql = 'SELECT * FROM matches WHERE ((`user1` = ? AND `user2` = ?) OR (`user2` = ? AND `user1` = ?)) AND `matched` = 1';
	db.query(checksql, [from_id, to, from_id, to], (error, result) => {
		if (error) {
			console.log(error);
			response.send('error');
		} else {
			if (result.length > 0) {
				content = `You matched with ${from_name}!`;
				console.log('CONTENT if Match:', content);
				let to2 = {to: request.body.target, from_id: from_id};
				console.log('FUBARR 1:', to2.from_id);
			}

			let sql = 'SELECT * FROM notifications WHERE `from` = ? AND `to` = ? AND content = ?';
			db.query(sql, [from_id, to, content], (error, result) => {
				if (error) {
					console.log(error);
					response.send('error');
				} else {
					if (result.length === 0) {
						console.log('FUBARR 2:', to2.from_id);
						sql = 'INSERT INTO notifications (`from`, `to`, content, `read`) VALUES (?, ?, ?, ?)';
						db.query(sql, [from_id, to, content, false], (error, result) => {
							if (error) {
								console.log(error);
								response.send('error');
							console.log('to2:', to2);
							console.log('to2.2:', to2.from_id);
							} else if (to2.from_id !== 0) {
								response.send(to2);
							} else {
								console.log('to:', to);
								response.send({to: to});
							}
						})
					} else {
						console.log('FUBARR 3:', to2.from_id);
						sql = 'UPDATE notifications SET time = NOW(), `read` = 0 WHERE id = ?';
						db.query(sql, [result[0].id], (error, result) => {
							if (error) {
								console.log(error);
								response.send('error');
							console.log('to2:', to2);
							} else if (to2.from_id !== 0) {
								response.send(to2);
							} else {
								console.log('to:', to);
								response.send({to: to});
							}
						});
					}
				}
			});
		}
	})

}
const dislikedNotification = (request, response) => {
	console.log(request.body)
	console.log(request.user)
	const from_name = request.user.name;
	const from_id = request.user.id;
	const to = request.body.target;

	const content = `You unmatched with ${from_name}!`;
	console.log(content);
	
	const checksql = 'SELECT * FROM matches WHERE (`user1` = ? AND `user2` = ?) OR (`user2` = ? AND `user1` = ?) AND `matched` = 1';
	db.query(checksql, [from_id, to, from_id, to], (error, result) => {
		if (error) {
			console.log(error);
			response.send('error');
		} else {
			if (result.length > 0) {
				let sql = 'SELECT * FROM notifications WHERE `from` = ? AND `to` = ? AND content = ?';
				db.query(sql, [from_id, to, content], (error, result) => {
					if (error) {
						console.log(error);
						response.send('error');
					} else {
						if (result.length === 0) {
							sql = 'INSERT INTO notifications (`from`, `to`, content, `read`) VALUES (?, ?, ?, ?)';
							db.query(sql, [from_id, to, content, false], (error, result) => {
								if (error) {
									console.log(error);
									response.send('error');
								} else {
									response.send({to: to});
								}
							})
						} else {
							sql = 'UPDATE notifications SET time = NOW(), `read` = 0 WHERE id = ?';
							db.query(sql, [result[0].id], (error, result) => {
								if (error) {
									console.log(error);
									response.send('error');
								} else {
									response.send({to: to});
								}
							});
						}
					}
				});
			}
		}
	});
}

const getNofications = (request, response) => {
	console.log(request.user.id)
	const user = request.user.id;
	const sql = 'SELECT * FROM notifications WHERE `to` = ? ORDER BY time DESC';

	db.query(sql, [user], (error, result) => {
		if (error) {
			console.log(error);
			response.send('error');
		} else {
			response.send(result);
		}
	})

}
const readNotifications = (request, response) => {

	const user = request.user.id;
	const sql = 'UPDATE notifications SET `read` = ? WHERE `to` = ?';

	db.query(sql, [ 1 ,user], (error, result) => {
		if (error) {
			console.log(error);
			response.send('error');
		} else {
			console.log('reaad notif')
			response.send(result);
		}
	})

}

module.exports = {
	viewNotification,
	likedNotification,
	dislikedNotification,
	getNofications,
	readNotifications
}