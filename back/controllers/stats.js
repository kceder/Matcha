const db = require('../config/db.js');

const getStats = async (request, response) => {
	const user = request.body.target === "self" ? request.user.id : request.target;
	const sql = `SELECT * FROM stats WHERE user_id = ?`;
	db.query(sql, [user], (error, result) => {
		if (error) {
			console.log(error);
			response.send("error: get stats");
		} else {
			response.send(result[0]);
		}
	});
}

const addView = async (request, response) => {
	const viewer = {id : request.user.id, name: request.user.name};
	const target = request.body.target;

	const sql = `SELECT * FROM stats WHERE user_id = ?`;
	db.query(sql, [target], (error, result) => {
		if (error) {
			response.send("error: get stats");
		} else {
			if (result[0].view_history === null) {
				const sql = `UPDATE stats SET view_history = ?, views = 1 WHERE user_id = ?`;
				const history = JSON.stringify([viewer]);
				db.query(sql, [history, target], (error, result) => {
					if (error) {
						console.log(error);
						response.send("error: update stats");
					} else {
						response.send(result);
					}
				});
			} else {
				const history = JSON.parse(result[0].view_history);
				if (history.find((user) => user.id === viewer.id)) {
					const newViewsCount = result[0].views + 1;
					const newHistory = history.filter((user) => user.id !== viewer.id);
					newHistory.unshift(viewer);
					const sql = `UPDATE stats SET view_history = ?, views = ? WHERE user_id = ?`;
					const JSONhistory = JSON.stringify(newHistory);
					db.query(sql, [JSONhistory, newViewsCount, target], (error, result) => {
						if (error) {
							console.log(error);
							response.send("error: update stats");
						} else {
							response.send('history view updated successfully');
						}
					});
				} else {
					const newViewsCount = result[0].views + 1;
					history.unshift(viewer);
					const sql = `UPDATE stats SET view_history = ?, views = ? WHERE user_id = ?`;
					db.query(sql, [JSON.stringify(history), newViewsCount, target], (error, result) => {
						if (error) {
							console.log(error);
							response.send("error: update stats");
						} else {
							response.send('history view updated successfully');
						}
					});
				}
			}
		}
	});
};

const addLike = async (request, response) => {
	const from = {id : request.user.id, name: request.user.name};
	const target = request.body.target;

	const sql = `SELECT * FROM stats WHERE user_id = ?`;
	db.query(sql, [target], (error, result) => {
		if (error) {
			response.send("error: get like stats");
		} else {
			if (result[0].like_history === null) {
				const sql = `UPDATE stats SET like_history = ?, likes = 1 WHERE user_id = ?`;
				const history = JSON.stringify([from]);
				db.query(sql, [history, target], (error, result) => {
					if (error) {
						console.log(error);
						response.send("error: update like stats");
					} else {
						response.send(result);
					}
				});
			} else {
				const history = JSON.parse(result[0].like_history);
				if (history.find((user) => user.id === from.id)) {
					const newLikesCount = result[0].views + 1;
					const newHistory = history.filter((user) => user.id !== from.id);
					newHistory.unshift(from);
					const sql = `UPDATE stats SET like_history = ?, likes = ? WHERE user_id = ?`;
					const JSONhistory = JSON.stringify(newHistory);
					db.query(sql, [JSONhistory, newLikesCount, target], (error, result) => {
						if (error) {
							console.log(error);
							response.send("error: update stats");
						} else {
							response.send('history like updated successfully');
						}
					});
				} else {
					const newLikesCount = result[0].views + 1;
					history.unshift(from);
					const sql = `UPDATE stats SET like_history = ?, likes = ? WHERE user_id = ?`;
					db.query(sql, [JSON.stringify(history), newLikesCount, target], (error, result) => {
						if (error) {
							console.log(error);
							response.send("error: update stats");
						} else {
							response.send('history like updated successfully');
						}
					});
				}
			}
		}
	});
};

module.exports = {
	getStats,
	addView,
	addLike
}