const db = require('../config/db.js');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const { sendMail } = require('../utils/sendEmail');
const verifyToken = require('../utils/verifyToken.js')

require('dotenv').config();

const getUser = (request, response) => {
	if (request.body.target = "self") {
		const jToken = request.cookies.token;
		const user = verifyToken(jToken).id;
		const sql = 'SELECT name, lastName, username, email, gender, bio, preference, interests, location FROM users WHERE id = ?';

		db.query(sql, [user], 
				function (error, result) {
					if (error) throw error
					else if (result.length === 0) {
						console.log('19')
						response.send('user not found')
					} else {
						response.send(result[0])
					}
				})
	}
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
							console.log('row added');
					}
				);
				const infoForEmail = {
					email,
					activationToken
				}
				sendMail(infoForEmail);
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
				console.log('result ---->', result)
				if (error) throw error;
				response.status(202).send('user activated :)');
			})
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
		const createPicsTab = "INSERT INTO user_pictures (user_id) VALUES (?)";
		db.query(createPicsTab, [userId],
			function (error, result) { console.log(error) });

		const myJSON = JSON.stringify(interests);
		console.log(myJSON)
		console.log(typeof(myJSON))

		const sql = "UPDATE users SET username = ?, gender = ?, bio = ?, birthday = ?, preference = ?, interests = ?, acti_stat = ? WHERE id = ?;";

		db.query(sql, [username, gender, bio, birthday, preference, myJSON, 2, userId],
		function (error, result) {
			if (error) 
				console.log(error);
			else
				response.status(208).send('good')
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



module.exports = {
	getUser,
	register,
	login,
	activateUser,
	completeAccount,
	getAllUsers,
	addPhotos,
}
