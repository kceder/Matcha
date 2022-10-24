const db = require('../config/db.js');
const verifyToken = require('../utils/verifyToken.js');

const updateGpsLocation = (request, response) => {
	console.log('inside update location')
	console.log(request.body)
	const token = request.cookies.token;
	
	let decodedToken = verifyToken(token);
	
	console.log(decodedToken.id);
	
	const sql = "UPDATE locations SET gps_location = POINT(?, ?) WHERE id = ?";
	console.log(request.body)
	db.query(sql, [request.body.lon, request.body.lat, decodedToken.id],
		function (error, result) {
			console.log(result)
			if (error) {
				console.log('67' ,error);
				response.send('something went wrong')
			}
			else
				response.send('position updated')
		})
		
		console.log('END update location')
}

const updateIpLocation = (request, response) => {
	console.log('inside update location')
	console.log(request.body)
	const token = request.cookies.token;
	
	let decodedToken = verifyToken(token);
	
	console.log(decodedToken.id);
	
	const sql = "UPDATE locations SET ip_location = POINT(?, ?), ip_city = ? WHERE id = ?";
	console.log(request.body)
	db.query(sql, [request.body.lon, request.body.lat, request.body.city, decodedToken.id],
		function (error, result) {
			console.log(result)
			if (error) {
				console.log('67' ,error);
				response.send('something went wrong')
			}
			else
				response.send('ip position updated')
		})
		
		console.log('END update location')
}

module.exports = {
	updateGpsLocation,
	updateIpLocation
}