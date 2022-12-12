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
	if (request.user.id === undefined) {
		response.clearCookie('token').send('logout');
	}
	else {
	db.query(sql, [request.user.id], function (error, result) {
		if (error) console.log('Error in logout:', error);
		else {
			response.clearCookie('token').send('logout');
		}
	})
	}
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
		const sql = 'SELECT name, lastName, username, email, gender, bio, preference, interests, birthday, score, registration_date, acti_stat FROM users WHERE id = ?';

		db.query(sql, [target], 
				function (error, result) {
					if (error) console.log( error)
					else if (result.length === 0) {
						response.send('user not found')
					} else {
						let userInfo = { 'basicInfo': result[0], id : target };
						const sql = "SELECT * FROM locations WHERE user_id = ?";
						db.query(sql, [target], function (error, result) {
							if (error) {
								console.log(error)
							}
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
	const username = request.body.username;
	const sqlEmailCheck = 'SELECT * FROM users WHERE email = ?';
	
	db.query(sqlEmailCheck, [email],
		function (error, result) {
			if (error) {
				console.log(error)
			}
			if (result.length > 0) {
				response.status(228).send('Email already in use');
			} else {
				const sqlUsernameCheck = 'SELECT * FROM users WHERE username = ?';
				db.query(sqlUsernameCheck, [username], function (error, result) {
					if (error) {
						console.log(error);
						response.send('error');
					} else if (result.length > 0) {
						response.status(228).send('Username already in use');
					} else {
						const hash = bcrypt.hashSync(password, 10);
						const activationToken = bcrypt.hashSync(email, 10).replace(/\//g,'_').replace(/\+/g,'-');;
						const sql = `INSERT INTO users \
						(name, lastName, username, email, password, activation_token) \
						VALUES \
						(?, ?, ?, ?, ?, ?)`;
						db.query(sql,[ name, lastName, username, email, hash, activationToken ], 
							function (error, results) {
								if (error) {
									console.log(error);
								};
							}
						);
						const infoForEmail = {
							email,
							activationToken
						}
						sendMail(infoForEmail);
						const getUserId = 'SELECT id FROM users WHERE email = ?'
						db.query(getUserId, [infoForEmail.email], function (error, result) {
							if (error) {
								console.log(error)
							}
							else {
								const initialize_locaion_tab = "INSERT INTO locations (user_id) VALUES (?)"
								db.query(initialize_locaion_tab, [result[0].id], function (error, result) {
									if (error) {
										console.log(error)
									}
								})
								const initialize_stats_tab = "INSERT INTO stats (user_id) VALUES (?)"
								db.query(initialize_stats_tab, [result[0].id], function (error, result) {
									if (error) {
										console.log(error)
									}
								})
							}
						})
						response.status(201).json({
							name: name,
							email: email,
							password: password,
						});
					}
				})
				
			}
		})
}

const login = (request, response) => {
	const sql = 'SELECT * FROM users WHERE email = ? OR username = ?';
	const user = request.body.user;

	const password = request.body.password;
	db.query(sql, [user, user],
		function (error, result) {
			if (error) {
				console.log(error)
			}
			if (result.length > 0) {
				bcrypt.compare(password,  result[0].password, function(err, compare) {
					if (err) console.log( err)
					if (compare == true) {
						const user = { 
							name : `${result[0].name} ${result[0].lastName}` , 
							id : result[0].id
						}
						const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
						if(result[0].acti_stat === 1) {
							response.status(202).cookie('token', accessToken,
								{ 
									path: '/',
									httpOnly: true
								}).send('fill profile');
						} else if (result[0].acti_stat === 0){
							response.send('account not verified');
						} else if (result[0].acti_stat === 2 || result[0].acti_stat === 3) {
							const logUser = "Insert into loggedInUsers (user_id) values (?)";
							db.query(logUser, [user.id] ,function (error, result) {
								if (error) console.log(error)
								response.status(202).cookie('token', accessToken,
								{ 
									path: '/',
									httpOnly: true
								}).send({message: 'login', user: user.id});
							});
							const update_sql = "UPDATE users SET registration_date = ? WHERE id = ?";
							db.query (update_sql, [new Date(), user.id], function (error, result) {
								if (error) console.log(error);
							})
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
	db.query(sql, [token], function(error, result) {
		if (error) console.log(error)
		if (result.length > 0) {
			const sql = "UPDATE users SET acti_stat = 1 WHERE id = ?"
			db.query(sql, [result[0].id], function (error, result) {
				if (error) console.log(error)
				response.status(202).send('user activated :)');
			});
		} else {
			response.send('user not found');
		}
	}) 
}

const completeAccount = async (request, response) => {

	const token = request.cookies.token;
	let decodedToken = await verifyToken(token); 
	

	const gender = request.body.gender;
	const bio = request.body.bio;
	const noWhiteSpaceBio = bio.replaceAll(' ', '');
	const birthday = request.body.birthday;

	const preference = request.body.preference;
	const interests = request.body.interests;
	const userId = decodedToken.id;

	const getAge = birthday => Math.floor((new Date() - new Date(birthday).getTime()) / 3.15576e+10);

	if	(gender !== 'male' && gender !== 'female') {
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
			function (error, result) { 
				if (error) console.log(error) 
			});

		const myJSON = JSON.stringify(interests);

		const sql = "UPDATE users SET gender = ?, bio = ?, birthday = ?, preference = ?, interests = ?, acti_stat = ? WHERE id = ?;";

		db.query(sql, [ gender, bio, birthday, preference, myJSON, 2, userId],
		function (error, result) {
			if (error) console.log(error);
			else {
				const getTags = "SELECT tag FROM tags";
				db.query(getTags, function (error, result) {
					if (error) console.log(error)
					else  {
						const newTags = interests.filter((interest) => !result.map((tag) => tag.tag).includes(interest));
						newTags.forEach((tag) => {
							const sql = `INSERT INTO tags (tag) VALUES (?)`;
							db.query(sql, [tag],(err, result) => {
								if (err) {
									console.log(err)
									response.send('error :: setUpUser')
								}
							})
						})
						response.send('good');
					}
				})
		}
	})
}
}

const addPhotos = async (request, response) => {


	const user = await verifyToken(request.cookies.token);
	let i = request.files.length;
	
	request.files.forEach(image => {
		
		const sql = `UPDATE user_pictures SET pic_${i} = ? WHERE user_id = ?`
		db.query(sql, [image.path, user.id],
			function (error, result) {
				if (error) {
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
			if (error) console.log( error)
			response.send(result);
		})
}
const filterUsers = async (request, response) => {

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

	const user = await verifyToken(request.cookies.token);
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
	// sql = `SELECT * FROM matches WHERE (user1 = ${user.id}) OR (user2 = ${user.id} AND like2 <> NULL) OR (user2 = ${user.id} AND block = 1) OR (user1 = ${user.id} AND block = 1)`;
	sql = `SELECT * FROM matches WHERE \
	(user2 = ${user.id} AND like2 <> NULL)\
	OR (user1 = ${user.id}) \
	OR (user2 = ${user.id} AND block = 1)\
	OR (user1 = ${user.id} AND block = 1) \
	OR (user2 = ${user.id} AND matched = 1) \
	OR (user1 = ${user.id} AND matched = 1);`;
	db.query(sql, function (error, result) {
		if (error) console.log(error)
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
		sql = `SELECT * FROM users JOIN locations ON users.id = locations.user_id WHERE gender = 'female' AND (preference = 'bisexual' OR preference = 'homosexual') OR gender = 'male' AND (preference = 'bisexual' OR preference = 'heterosexual') AND users.id != ?`;
	}
	db.query(sql, [user.id], function (error, result) {
		if (error) console.log(error)
		else {
			let array = [];
			result = result.filter(result => {
				return result.id !== user.id;
			})
			result = result.filter(result => {
				return !blockedUsers.includes(result.id);
			})
			if (interests.length > 0) {
				result.forEach(user => {
						let ret = filterByTags(user, interests);
						ret === null ? null : array.push(ret);
					})
			} else {
				array = result;
			}
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
			array2.forEach(user => {
				const user2Loation = user.user_set_location ? user.user_set_location : (user.gps_location ? user.gps_location : user.ip_location);
				const distanceResult = getDistance(userLocation.x , userLocation.y, user2Loation.x, user2Loation.y);
				if (distanceResult <= distance) {
					user.distance = distanceResult;
					array3.push(user);
				}
			})
			let i = 0;
			if (rating > 0) {
				let array4 = [];
				array3.forEach(user => {
					if (user.score >= rating) {
						array4.push(user);
					}
				})
				response.send(array4);
			} else {
				response.send(array3)
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
	return d;
}

const checkActiStat = (request, response) => {
	const user = request.user.id;
	const sql = `SELECT acti_stat FROM users WHERE id = ?`;
	db.query(sql, [user], function (error, result) {
		if (error) console.log(error)
		else {
			response.send(result[0]);
		}
	})
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
	checkActiStat
}
