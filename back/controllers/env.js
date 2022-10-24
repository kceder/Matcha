const db = require('../config/db.js');
const verifyToken = require('../utils/verifyToken.js')

require('dotenv').config();

const geoApi = (request, response) => {
	const token = request.cookies.token;
	let decodedToken = verifyToken(token);
	console.log(decodedToken);
	console.log(process.env.GEO_API_KEY);
	response.send(process.env.GEO_API_KEY);
}

const reverseGeoApi = (request, response) => {
	const token = request.cookies.token;
	let decodedToken = verifyToken(token);
	console.log(decodedToken);
	console.log(process.env.REVERSE_GEO_API_KEY);
	response.send(process.env.REVERSE_GEO_API_KEY);
}

module.exports = {
	geoApi,
	reverseGeoApi
};