const db = require('../config/db.js');
const verifyToken = require('../utils/verifyToken.js');

const updateGpsLocation = (request, response) => {
	const token = request.cookies.token;
	
	let decodedToken = verifyToken(token);
	
	const sql = "UPDATE locations SET gps_location = POINT(?, ?) WHERE id = ?";
	db.query(sql, [request.body.lon, request.body.lat, decodedToken.id],
		function (error, result) {
			if (error) {
				response.send('something went wrong')
			}
			else
				response.send('position updated')
		})
}

const updateIpLocation = (request, response) => {
	const token = request.cookies.token;
	
	let decodedToken = verifyToken(token);

	const sql = "UPDATE locations SET ip_location = POINT(?, ?), ip_city = ? WHERE id = ?";
	db.query(sql, [request.body.lon, request.body.lat, request.body.city, decodedToken.id],
		function (error, result) {
			if (error) {
				response.send('something went wrong')
			}
			else
				response.send('ip position updated')
		})
}

module.exports = {
	updateGpsLocation,
	updateIpLocation
}