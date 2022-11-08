const db = require('../config/db.js');
const fs = require("fs");


const getPhotos = (request, response) => {
	// console.log(request.body);
	// console.log(request.user);
	let target;
	if (request.body.target === "self") {
		target = request.user.id;
	} else {
		target = request.body.target;
	}
	const sql = "SELECT * FROM user_pictures WHERE user_id = ? ";
	db.query(sql, [target], function (error, result) {
		if (error) throw error;
		else {
			// console.log(result);
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
					// console.log('result:\n', result)
					// console.log('######### END ########')
					response.send('good');
				}
			})
		}
	}

}
const setPicture = (request, response) => {
	const old = request.body.old;
	// console.log(request.user.id)
	if (request.body.old) {
		const sql = "SELECT * FROM user_pictures WHERE user_id = ?;";
		db.query(sql, [request.user.id], function (error, result) {
			if (error) throw error;
			else {
				let i = -1;
				for (const property in result[0]) {
					if(result[0][property] === old) {
						// console.log(`${property}: ${result[0][property]}`);
						break;
					}
					i++;
				}
				var data = request.body.base64.replace(/^data:image\/\w+;base64,/, "");
				var buf = new Buffer.from(data, 'base64');
				const path = "./images/img_" + Date.now() + Math.floor(Math.random() * 100) + ".png"
				fs.writeFile( path , buf, function (error, result) {
					if(error){console.log('error', error);}
				});
				const sql = `UPDATE user_pictures SET pic_${i} = ? WHERE user_id = ?;`;
					db.query(sql, [path, request.user.id], function (error, result) {
						if (error) throw (error);
						else {
							// console.log('result:\n', result)
							response.send('good');
						}
					})

			}
	})
}

	else if (request.body.base64 === "") {
		response.send('best regards, sean connery');
	} else {
		const image = request.body.base64;
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
			const findIndex = "SELECT * FROM user_pictures WHERE user_id = ?;";
			db.query(findIndex, [request.user.id], function (error, result) {
				// console.log(typeof(result[0]))
				let i = -1
				for (const property in result[0]) {
					if(result[0][property] === null) {
						console.log(`${property}: ${result[0][property]}`);
						break;
					}
					i++;
				}
				if (i === 6) {
					response.send('no space')
				} else {
					const sql = `UPDATE user_pictures SET pic_${i} = ? WHERE user_id = ?;`;
					db.query(sql, [path, request.user.id], function (error, result) {
						if (error) throw (error);
						else {
							response.send('good');
						}
					})
				}
			})
		}
	}

}

module.exports={
	getPhotos,
	setProfilePicture,
	setPicture
}