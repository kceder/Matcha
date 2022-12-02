const db = require('../config/db.js');

const viewNotification = (request, response) => {
	const from_name = request.user.name;
	const from_id = request.user.id;
	const to = request.body.target;
	let sql = "SELECT score FROM users WHERE id = ?";
	db.query(sql, [to], (error, result) => {
		if (error) {
			console.log(error)
			response.send('error get score')
		} else {
			if (result[0].score < 50) {
				const newScore = result[0].score + 1;
				const sql = "UPDATE users SET score = ? WHERE id = ?";
				db.query(sql, [newScore, to], (error) => {
					if (error) {
						console.log(error)
						response.sen('error update score view')
					}
				})
			}
		}
	})
	const content = `${from_name} viewed your profile!`;
	sql = 'SELECT * FROM notifications WHERE `from` = ? AND `to` = ? AND content = ?';
	db.query(sql, [from_id, to, content], (error, result) => {
		if (error) {
			console.log(error);
			response.send('error');
		} else {
			if (result.length === 0) {
				sql = 'INSERT INTO notifications (`from`, `to`, content, `read`) VALUES (?, ?, ?, ?)';
				db.query(sql, [from_id, to, content, false], (error) => {
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
	const from_name = request.user.name;
	const from_id = request.user.id;
	let to = request.body.target;
	let to2 = {to: 0, from_id: 0};
	let content = `${from_name} liked you!`;
	let content_1 = `You matched with ${from_name}!`;
	let content_2 = `You matched with ${request.body.username}!`;
	
	const checksql = 'SELECT * FROM matches WHERE ((`user1` = ? AND `user2` = ?) OR (`user2` = ? AND `user1` = ?)) AND `matched` = 1';
	db.query(checksql, [from_id, to, from_id, to], (error, result) => {
		if (error) {
			console.log(error);
			response.send('error');
		} else {
			if (result.length > 0) {
				to2 = {to: request.body.target, from_id: from_id};
				let sql = 'SELECT * FROM notifications WHERE ((`from` = ? AND `to` = ?) OR (`to` = ? AND `from` = ?)) AND content = ?';
				db.query(sql, [from_id, to, from_id, to, content_1], (error, result) => {
					if (error) {
						console.log(error);
						response.send('error');
					} else {
						if (result.length === 0) {
							sql = 'INSERT INTO notifications (`from`, `to`, content, `read`) VALUES (?, ?, ?, ?)';
							db.query(sql, [from_id, to, content_1, false], (error, result) => {
								if (error) {
									console.log(error);
									response.send('error');
								} else
									sql = 'INSERT INTO notifications (`from`, `to`, content, `read`) VALUES (?, ?, ?, ?)';
									db.query(sql, [to, from_id, content_2, false], (error, result) => {
										if (error) {
											console.log(error);
											response.send('error');
										} else
											response.send(to2);
									});
							})
						} else {
							sql = 'UPDATE notifications SET time = NOW(), `read` = 0 WHERE ((`from` = ? AND `to` = ?) OR (`to` = ? AND `from` = ?)) AND (content = ? OR content = ?)';
							db.query(sql, [from_id, to, from_id, to, content_1, content_2], (error, result) => {
								if (error) {
									console.log(error);
									response.send('error');
								} else {
									response.send(to2);
								}
							});
						}
					}
				});
			}
			else {
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
	})

}
const dislikedNotification = (request, response) => {
	const from_name = request.user.name;
	const from_id = request.user.id;
	const to = request.body.target;

	const content = `You unmatched with ${from_name}!`;
	
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

const messageNotification = (request, name, response) => {
	const from_name = name;
	const from_id = request.sender;
	const to = request.receiver;
	const content = `${from_name} sent you a message!`;

	let sql = 'SELECT * FROM notifications WHERE `from` = ? AND `to` = ? AND content = ?';
	db.query(sql, [from_id, to, content], (error, result) => {
		if (error) {
			console.log(error);
		} else {
			if (result.length === 0) {
				sql = 'INSERT INTO notifications (`from`, `to`, content, `read`) VALUES (?, ?, ?, ?)';
				db.query(sql, [from_id, to, content, false], (error, result) => {
					if (error) {
						console.log(error);
					}
				})
			} else {
				sql = 'UPDATE notifications SET time = NOW(), `read` = 0 WHERE id = ?';
				db.query(sql, [result[0].id], (error, result) => {
					if (error) {
						console.log(error);
					}
				});
			}
		}
	});
}


const getNofications = (request, response) => {
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
			response.send(result);
		}
	})

}

module.exports = {
	viewNotification,
	likedNotification,
	dislikedNotification,
	getNofications,
	readNotifications,
	messageNotification
}