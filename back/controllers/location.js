const db = require('../config/db.js');
const verifyToken = require('../utils/verifyToken.js')

const updateLocation = (request, response) => {
	console.log('inside update location')
	console.log(request.body)
	const token = request.cookies.token;
	
	let decodedToken = verifyToken(token);
	
	console.log(decodedToken.id);
	
	const sql = "UPDATE users SET location = POINT(?, ?) WHERE id = ?";
	console.log(request.body)
	db.query(sql, [request.body.lat, request.body.lon, decodedToken.id],
		function (error, result) {
			if (error) {
				console.log('67' ,error);
				response.send('something went wrong, please retry')
			}
			else
				response.send('position updated')
		})
		
		console.log('END update location')
}


module.exports = {
	updateLocation,
}