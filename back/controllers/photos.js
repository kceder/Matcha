const db = require('../config/db.js');
const fs = require("fs");


const getPhotos = (request, response) => {
	console.log(request.body);
	console.log(request.user);

	const sql = "SELECT * FROM user_pictures WHERE user_id = ? ";
	db.query(sql, [request.user.id], function (error, result) {
		if (error) throw error;
		else {
			console.log(result);
			response.send(result[0]);
		}
	})
}

const setProfilePicture = (request, response) => {

	if (request.body.base64 === "") {
		response.send('best regards, sean connery');
	} else {
		const image = request.body.base64
		const size = image.length;
		if (size * (3/4) > 52428800 / 5){
			response.send('file too big')
		} else {
			var data = image.replace(/^data:image\/\w+;base64,/, "");
			var buf = new Buffer.from(data, 'base64');
			const path = "./images/img_" + Date.now() + Math.floor(Math.random() * 100) + ".png"
			fs.writeFile( path , buf, function (error, result) {
				if(error){console.log('error', error);}
			});
			const sql = "UPDATE user_pictures SET pic_1 = ? WHERE user_id = ?;";
			db.query(sql, [path, request.user.id], function (error, result) {
				if (error) throw (error);
				else {
					console.log('result:\n', result)
					console.log('######### END ########')
					response.send('good');
				}
			})
		}
	}

}

module.exports={
	getPhotos,
	setProfilePicture
}