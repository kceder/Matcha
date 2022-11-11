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
	getNofications,
	readNotifications
}