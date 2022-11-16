const db = require('../config/db.js');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const { sendMail } = require('../utils/sendEmail');
const verifyToken = require('../utils/verifyToken.js');

require('dotenv').config();

const getLoggedInUsers = (request, response) => {
	const sql = 'SELECT user_id FROM loggedinusers';
	db.query(sql, function (error, result) {
		if (error) console.log('Error in logged in users:', error);
		else{
			const users = result.map(user => user.user_id);
			response.send(users);
		}
	})
}

const logOut = (request, response) => {
	const sql = 'DELETE FROM loggedinusers WHERE user_id = ?';
	db.query(sql, [request.user.id], function (error, result) {
		if (error) console.log('Error in logout:', error);
		else {
			response.clearCookie('token').send('logout');

		}
	})
}

const getUser = (request, response) => {
	const jToken = request.cookies.token;
	const user = request.user.id
	let target;
	if (request.body.target === "self") {
		target = user;
	} else {
		target = request.body.target;
	}
		const sql = 'SELECT name, lastName, username, email, gender, bio, preference, interests, birthday, score FROM users WHERE id = ?';

		db.query(sql, [target], 
				function (error, result) {
					if (error) throw error
					else if (result.length === 0) {
						response.send('user not found')
					} else {
						let userInfo = { 'basicInfo': result[0], id : target };
						const sql = "SELECT * FROM locations WHERE user_id = ?";
						db.query(sql, [target], function (error, result) {
							if (error) throw error;
							else {
								userInfo.locations = result[0];
								response.send(userInfo);
							}
						})
					}
				})
}

const register = (request, response) => {

	const name = request.body.name;
	const lastName = request.body.lastName;
	const email = request.body.email;
	const password = request.body.password;
	const sqlEmailCheck = 'SELECT * FROM users WHERE email = ?';
	db.query(sqlEmailCheck, [email],
		function (error, result) {
			if (error) throw error;
			if (result.length > 0) {
				response.status(228).send('Email already in use');
			} else {
				const hash = bcrypt.hashSync(password, 10);
				const activationToken = bcrypt.hashSync(email, 10).replace(/\//g,'_').replace(/\+/g,'-');;
				const sql = `INSERT INTO users \
				(name, lastName, email, password, activation_token) \
				VALUES \
				(?, ?, ?, ?, ?)`;
				db.query(sql,[ name, lastName, email, hash, activationToken ], 
					function (error, results) {
						if (error) throw error;
						// else 
						// 	console.log(1);
					}
				);
				const infoForEmail = {
					email,
					activationToken
				}
				sendMail(infoForEmail);
				const getUserId = 'SELECT id FROM users WHERE email = ?'
				db.query(getUserId, [infoForEmail.email], function (error, result) {
					if (error) throw error;
					else {
						const initialize_locaion_tab = "INSERT INTO locations (user_id) VALUES (?)"
						db.query(initialize_locaion_tab, [result[0].id], function (error, result) {
							if (error) throw error;
							// else
							// 	console.log('succes');
						})
					}
				})
				response.status(201).json({
					name: name,
					email: email,
					password: password,
				})
			}
		})
}

const login = (request, response) => {
	const sql = 'SELECT * FROM users WHERE email = ?';
	const email = request.body.email;
	const password = request.body.password;
	db.query(sql, [email],
		function (error, result) {
			
			if (error) throw error;
			if (result.length > 0) {
				bcrypt.compare(password,  result[0].password, function(err, compare) {
					if (err) throw err
					// console.log('59', compare)
					if (compare == true) {
						const user = { 
							name : `${result[0].name} ${result[0].lastName}` , 
							id : result[0].id
						}
						const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
						if(result[0].acti_stat === 1) {
							// console.log('acti_1')
							response.status(202).cookie('token', accessToken,
							{ 
								path: '/',
								httpOnly: true
							}).send('fill profile');
						} else if (result[0].acti_stat === 0){
							// console.log('acti_0')
							response.send('account not verified');
						} else if (result[0].acti_stat === 2) {
							const logUser = "Insert into loggedInUsers (user_id) values (?)";
							db.query(logUser, [user.id] ,function (error, result) {
								if (error) throw error;
								response.status(202).cookie('token', accessToken,
								{ 
									path: '/',
									httpOnly: true
								}).send({message: 'login', user: user.id});
							});
						}
					
					
					} else {
						response.send('wrong password')
					}
				});
			}
			else 
				response.send('user not found');
		})
}

const activateUser = (request, response) => {
	const sql = 'SELECT * FROM users WHERE activation_token = ?';

	const token = request.body.token;
	// console.log(request.body)
	db.query(sql, [token], function(error, result) {
		if (error) throw error;
		if (result.length > 0) {
			const sql = "UPDATE users SET acti_stat = 1 WHERE id = ?"
			db.query(sql, [result[0].id], function (error, result) {
				// console.log('result ---->', result)
				if (error) throw error;
				response.status(202).send('user activated :)');
			});
			// console.log(result[0].id)
			
		} else {
			response.send('user not found');
		}
	})
}

const completeAccount = (request, response) => {

	const token = request.cookies.token;
	console.log('token in completeAccount: ', token);
	let decodedToken = verifyToken(token);
	
	const username  = request.body.username
	const gender = request.body.gender;
	const bio = request.body.bio;
	const noWhiteSpaceBio = bio.replaceAll(' ', '');
	const birthday = request.body.birthday;

	const preference = request.body.preference;
	const interests = request.body.interests;
	const userId = decodedToken.id;

	const getAge = birthday => Math.floor((new Date() - new Date(birthday).getTime()) / 3.15576e+10);

	if (username.length > 15) {
		response.send('username too long');
	}	else if	(gender !== 'male' && gender !== 'female') {
		response.send('invalid gender');
	}	else if	(bio.length > 500) {
		response.send('bio too long');
	}	else if	(noWhiteSpaceBio.length === 0) {
		response.send('bio empty');
	}	else if (getAge(birthday) < 18) {
		response.send('too young')
	}	else if (preference !== 'bisexual' && preference !== 'heterosexual' && preference !== 'homosexual') {
		response.send('invalid preference')
	}	else if (interests.length <= 0) {
		response.send('interests not selected')
	}	else {
		const createPicsTab = "INSERT INTO user_pictures (user_id) VALUES (?)";
		db.query(createPicsTab, [userId],
			function (error, result) { console.log(error) });

		const myJSON = JSON.stringify(interests);
		// console.log(myJSON)


		const sql = "UPDATE users SET username = ?, gender = ?, bio = ?, birthday = ?, preference = ?, interests = ?, acti_stat = ? WHERE id = ?;";

		db.query(sql, [username, gender, bio, birthday, preference, myJSON, 2, userId],
		function (error, result) {
			if (error) 
				console.log(error);
			else {
				const getTags = "SELECT tag FROM tags";
				db.query(getTags, function (error, result) {
					if (error) throw error;
					else  {
						const newTags = interests.filter((interest) => !result.map((tag) => tag.tag).includes(interest));
						// console.log(newTags);
						newTags.forEach((tag) => {
							const sql = `INSERT INTO tags (tag) VALUES (?)`;
							db.query(sql, [tag],(err, result) => {
								if (err) throw err;
								// else {
								// 	console.log('tag added')
								// }	
							})
						})
						response.send('good');
					}
				})
		}
	})
}
}

const addPhotos = (request, response) => {


	const user = verifyToken(request.cookies.token);
	console.log('ASKPKSAKPSDAPKSADPK!!!!!');
	let i = request.files.length;
	
	request.files.forEach(image => {
		
		const sql = `UPDATE user_pictures SET pic_${i} = ? WHERE user_id = ?`
		db.query(sql, [image.path, user.id],
			function (error, result) {
				if (error) {
					// console.log(error);
					response.send('SQL error')
				}
			});
		i--;
	});

	response.send('good')
}

const  getAllUsers = (request, response) => {
	const sql = 'SELECT * FROM users';
	db.query(sql,
		function (error, result) {
			if (error) throw error
			response.send(result);
		})
}
const filterUsers = (request, response) => {

	const filterByTags = (user, interests) => {
		let i = 0;
		interests.forEach((interest) => {
			if (user.interests.includes(interest)) {
				i++;
			}
	
		})
		if (i > 0)
			user.commontags = i;
		
		return i > 0 ? user : null;
	}

	const user = verifyToken(request.cookies.token);
	const gender = request.body.gender; //
	const preference = request.body.preference; //
	const interests = request.body.tags; //
	const minAge = request.body.minAge;
	const maxAge = request.body.maxAge;
	const distance = request.body.distance;
	const userLocation = request.body.userLocation;
	const rating = request.body.rating;
	let sql;
	let blockedUsers = [];
	sql = `SELECT * FROM matches WHERE user1 = ${user.id}`;
	db.query(sql, function (error, result) {
		if (error) throw error;
		else {
			blockedUsers = result.map((match) => {
				return match.user1 === user.id ? match.user2 : match.user1;
			})
		}
	});

	if (gender === 'female' && preference === 'heterosexual') {
		sql = `SELECT * FROM users JOIN locations ON users.id = locations.user_id WHERE (gender = 'male' AND preference = 'heterosexual') OR (gender = 'male' AND preference = 'bisexual')`;
	} else if (gender === 'male' && preference === 'heterosexual') {
		sql = `SELECT * FROM users JOIN locations ON users.id = locations.user_id WHERE (gender = 'female' AND preference = 'heterosexual') OR (gender = 'female' AND preference = 'bisexual')`;
	} else if (gender === 'male' && preference === 'homosexual') {
		sql = `SELECT * FROM users JOIN locations ON users.id = locations.user_id WHERE (gender = 'male' AND preference = 'homosexual') OR (gender = 'male' AND preference = 'bisexual')`;
	} else if (gender === 'female' && preference === 'homosexual') {
		sql = `SELECT * FROM users JOIN locations ON users.id = locations.user_id WHERE (gender = 'female' AND preference = 'homosexual') OR (gender = 'female' AND preference = 'bisexual')`;
	} else if (gender === 'male' && preference === 'bisexual') {
		sql = `SELECT * FROM users JOIN locations ON users.id = locations.user_id WHERE gender = 'male' AND (preference = 'bisexual' OR preference = 'homosexual') OR gender = 'female' AND (preference = 'bisexual' OR preference = 'heterosexual')`;
	} else if (gender === 'female' && preference === 'bisexual') {
		sql = `SELECT * FROM users JOIN locations ON users.id = locations.user_id WHERE gender = 'female' AND (preference = 'bisexual' OR preference = 'homosexual') OR gender = 'male' AND (preference = 'bisexual' OR preference = 'heterosexual') AND users.id NOT LIKE ?`;
	}
	db.query(sql, [user.id], function (error, result) {
		console.log('blocked list !!!!', blockedUsers);
		if (error) throw error;
		else {
			let array = [];
			result = result.filter(result => {
				return result.id !== user.id;
			})
			result = result.filter(result => {
				return !blockedUsers.includes(result.id);
			})
			result.forEach(user => {
				let ret = filterByTags(user, interests);
				ret === null ? null : array.push(ret);
			})
			let array2 = [];
			array.forEach(user => {
				const getAge = birthday => Math.floor((new Date() - new Date(birthday).getTime()) / 3.15576e+10);
				const age = getAge(user.birthday);
				if (age >= minAge && age <= maxAge) {
					user.age = age;
					array2.push(user);
				}
			})
			let array3 = [];
			// console.log(array2)
			array2.forEach(user => {
				// console.log(user)
				const user2Loation = user.user_set_location ? user.user_set_location : (user.gps_location ? user.gps_location : user.ip_location);
				const distanceResult = getDistance(userLocation.x , userLocation.y, user2Loation.x, user2Loation.y);
				if (distanceResult <= distance) {
					user.distance = distanceResult;
					array3.push(user);
				}
			})
			let i = 0;
			if (rating > 0) {
				// console.log('rating', rating)
				let array4 = [];
				array3.forEach(user => {
					if (user.score >= rating) {
						// console.log(user.score)
						array4.push(user);
					}
				})
				// console.log('RESPONSE 1 %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%')
				response.send(array4);
			} else {
				response.send(array3)
				// console.log('RESPONSE 2 %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%')
			}
		}
	})
}

const getDistance = (lat1, lon1, lat2, lon2) => {

	function deg2rad(deg) {
		return deg * (Math.PI/180)
	}
	const R = 6371; // Radius of the earth in km
	const dLat = deg2rad(lat2 - lat1);  // deg2rad below
	const dLon = deg2rad(lon2 - lon1);
	const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +	Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *	Math.sin(dLon / 2) * Math.sin(dLon / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	const d = R * c; // Distance in km
	// console.log(d);
	return d;
}

module.exports = {
	getUser,
	register,
	login,
	activateUser,
	completeAccount,
	getAllUsers,
	addPhotos,
	filterUsers,
	getLoggedInUsers,
	logOut,
}
