const db = require('../config/db.js');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const { sendMail } = require('../utils/sendEmail');
const verifyToken = require('../utils/verifyToken.js');
const { Console } = require('console');

require('dotenv').config();

const getUser = (request, response) => {
	const jToken = request.cookies.token;
	const user = verifyToken(jToken).id;
	let target;
	if (request.body.target === "self") {
		target = user;
	} else {
		target = request.body.target;
	}
	console.log(target)
		const sql = 'SELECT name, lastName, username, email, gender, bio, preference, interests, birthday FROM users WHERE id = ?';

		db.query(sql, [target], 
				function (error, result) {
					if (error) throw error
					else if (result.length === 0) {
						console.log('19')
						response.send('user not found')
					} else {
						const userInfo = { 'basicInfo': result[0]}
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
						else 
							console.log(results);
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
							else
								console.log('succes');
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
					console.log('59', compare)
					if (compare == true) {
						const user = { 
							name : `${result[0].name} ${result[0].lastName}` , 
							id : result[0].id
						}
						const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
						if(result[0].acti_stat === 1) {
							console.log('acti_1')
							response.status(202).cookie('token', accessToken,
							{ 
								path: '/',
								httpOnly: true
							}).send('fill profile');
						} else if (result[0].acti_stat === 0){
							console.log('acti_0')
							response.status(202).send('account not verified');
						} else if (result[0].acti_stat === 2) {
							console.log('acti_2')
							response.status(202).cookie('token', accessToken,
							{ 
								path: '/',
								httpOnly: true
							}).send('login');
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
	console.log(request.body)
	db.query(sql, [token], function(error, result) {
		if (error) throw error;
		if (result.length > 0) {
			const sql = "UPDATE users SET acti_stat = 1 WHERE id = ?"
			db.query(sql, [result[0].id], function (error, result) {
				// console.log('result ---->', result)
				if (error) throw error;
				response.status(202).send('user activated :)');
			});
			console.log(result[0].id)
			
		} else {
			response.send('user not found');
		}
	})
}

const completeAccount = (request, response) => {

	const token = request.cookies.token;

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
		// const createPicsTab = "INSERT INTO user_pictures (user_id) VALUES (?)";
		// db.query(createPicsTab, [userId],
			// function (error, result) { console.log(error) });

		const myJSON = JSON.stringify(interests);
		console.log(myJSON)


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
						console.log(newTags);
						newTags.forEach((tag) => {
							const sql = `INSERT INTO tags (tag) VALUES (?)`;
							db.query(sql, [tag],(err, result) => {
								if (err) throw err;
								else {
									console.log('tag added')
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

const addPhotos = (request, response) => {


	const user = verifyToken(request.cookies.token);
	let i = request.files.length;
	
	request.files.forEach(image => {
		
		const sql = `UPDATE user_pictures SET pic_${i} = ? WHERE user_id = ?`
		db.query(sql, [image.path, user.id],
			function (error, result) {
				if (error) {
					console.log(error);
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

	const filterByTags = (users, interests) => {
		
		users.forEach (user => {
			const tags = user.interests;
			const tagsArray = tags.replace(/['"]+/g, '').replace('[', '').replace(']', '').split(',');
			// filter users comparing multiple tags //
			return (tagsArray.filter((tag) => {
				console.log(tag)
				return interests.includes(tag)
			}));

			// console.log(tagsArray)
			// console.log(interestsArray)

		})

		// remove quotes and square brackets and split by comma //
		// const tagsArray = tags.split(',');
	}
	console.log(request.body);
	console.log(request.user);
	const user = verifyToken(request.cookies.token);
	const gender = request.body.gender; //
	const preference = request.body.preference; //
	const interests = request.body.tags; //
	const minAge = request.body.minAge;
	const maxAge = request.body.maxAge;
	const distance = request.body.distance;
	let sql;
	if (gender === 'female' && preference === 'heterosexual') {
		sql = `SELECT * FROM users WHERE gender = 'male' and preference = 'heterosexual' OR preference = 'bisexual'`;
	} else if (gender === 'male' && preference === 'heterosexual') {
		console.log('here    1');
		sql = `SELECT * FROM users WHERE gender = 'female' and preference = 'heterosexual' OR preference = 'bisexual'`;
	} else if (gender === 'male' && preference === 'homosexual') {
		sql = `SELECT * FROM users WHERE gender = 'male' and preference = 'homosexual' OR preference = 'bisexual'`;
	} else if (gender === 'female' && preference === 'homosexual') {
		sql = `SELECT * FROM users WHERE gender = 'female' and preference = 'homosexual' OR preference = 'bisexual'`;
	} else if (gender === 'male' && preference === 'bisexual') {
		sql = `SELECT * FROM users WHERE gender = 'male' AND (preference = 'bisexual' OR preference = 'homosexual') OR gender = 'female' AND (preference = 'bisexual' OR preference = 'heterosexual')`;
	} else if (gender === 'female' && preference === 'bisexual') {
		sql = `SELECT * FROM users WHERE gender = 'female' AND (preference = 'bisexual' OR preference = 'homosexual') OR gender = 'male' AND (preference = 'bisexual' OR preference = 'heterosexual')`;
	}
	db.query(sql, function (error, result) {
		if (error) throw error;
		else {
			console.log(result);
			const filteredByTags = filterByTags(result, interests);
			console.log(filteredByTags);
			response.send('gut')
		}
	})
	// response.send('good');
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
}
