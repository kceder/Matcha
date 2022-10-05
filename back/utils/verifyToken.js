const jwt = require("jsonwebtoken");

require('dotenv').config();

const verifyToken = (token) => {

	let decodedToken;
	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, verifiedJwt) => {
		if(err){
			// res.send(err.message)
			console.log(err.message)
		}else{
			// res.send(verifiedJwt)
			console.log('verified token ', verifiedJwt)
			decodedToken = verifiedJwt;
		}
	})
	return decodedToken;
};

module.exports = verifyToken;