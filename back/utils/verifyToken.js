const jwt = require("jsonwebtoken");

require('dotenv').config();

const verifyToken = (token) => {
	let decodedToken;
	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, verifiedJwt) => {
		if(err) {
			console.log(err)
			return false;
		} else {
			decodedToken = verifiedJwt;
		}
	})
	return decodedToken;
};

module.exports = verifyToken;