const db = require('../config/db.js');
const bcrypt = require("bcrypt");
const { request } = require('http');
const { response } = require('express');
const { sendRecoveryMail } = require('../utils/sendEmail.js');

const validateEmail = (email) => {
	const regex = new RegExp('^(?!.{51})[a-z0-9]+(?:\.[a-z0-9]+)*@[a-z0-9]+(?:[.-][a-z0-9-]+)*\.[a-zA-Z]{2,6}$');
	return regex.test(String(email).toLowerCase());
}

const restorePassword = (request, response) => {

	const email = request.body.email;
	const sql = "SELECT email FROM users WHERE email = ?;";
	db.query(sql, [email], function(error, result) {

		if (error)
			console.log(error)
		else if (result.length === 0)
			response.send('no')
		else {
			const token_sql = "SELECT activation_token FROM users WHERE email = ?;";
			db.query(token_sql, [email], function(error, result) {
				if (error)
					console.log(error)
				else {
					const token = bcrypt.hashSync(email, 10).replace(/\//g,'_').replace(/\+/g,'-');
					const token_sql = "UPDATE users SET activation_token = ? WHERE email = ?;";
					db.query(token_sql, [token, email], function(error, result) {
						if (error)
							console.log(error)
						else {
							sendRecoveryMail(email, token);
							response.send('ok')
						}
					})
			}
		})
		}
	})
}

 const passwordRestore = (request, response) => {
	const password = request.body.password;
	const token = request.body.token;
	const sql = "SELECT id FROM users WHERE activation_token = ?;";
	db.query(sql, [token], function(error, result) {
		if (error)
			console.log(error)
		else if (result.length === 0)
			response.send('no')
		else {
			const id = result[0].id;
			const hash = bcrypt.hashSync(password, 10);
			const sql = "UPDATE users SET password = ?, activation_token = NULL WHERE id = ?;";
			db.query
			(sql, [hash, id], function(error, result) {
				if (error)
					console.log(error)
				else
					response.send('ok')
			})
		}
	})
}

const changePassword = (request,  response) => {

	const password = request.body.oldPassword;
	const newPassword = request.body.newPassword;

	const selectPassword = "SELECT password FROM users WHERE id = ?;";
	db.query(selectPassword, [request.user.id],
		function (error, result) {

			if (error) throw error
			if (result.length > 0) {
				bcrypt.compare(password,  result[0].password, function(err, valid) {
					if (valid === true) {
						const hash = bcrypt.hashSync(newPassword, 10);
						const updatePassword = "UPDATE users SET password = ? WHERE id = ?;";
						db.query(updatePassword, [hash, request.user.id],  function (error, resut) {
							if (error) throw error;
						})
					}
			})
		}
	})
}

const changeUserInfo = (request, response) => {
	const id = request.user.id;
	const username  = request.body.username;
	const name  = request.body.name;
	const lastName  = request.body.lastName;
	const email  = request.body.email;
	const location = request.body.location;
	const bio = request.body.bio;
	const noWhiteSpaceBio = bio.replaceAll(' ', '');
	const gender = request.body.gender;
	const interests = request.body.interests;
	const tags = request.body.tags;

	const myJSON = JSON.stringify(interests);
	const preference = request.body.preference;

	const userId = request.user.id;

	var nameRegex = new RegExp(/^[A-Za-z]*$/);
	
	const validateLocation = (latitude, longitude) => {
		var locationRegex = new RegExp('^-?[0-9]{1,3}(?:.[0-9]{1,10})?$');
		if(latitude > 90 || latitude < -90) {
			return false;
		}
		if(longitude > 180 || longitude < -180) {
			return false;
		}
		if (locationRegex.test(latitude) === false || locationRegex.test(longitude) === false) {
			return false;
		}
	}

	if (username.length > 50) {
		response.send('username too long');
	}	else if (username.length < 3) {
		response.send('username too short');
	} else if (name > 20 || nameRegex.test(name) === false || name < 1) {
		response.send('name invalid');
	} else if (lastName > 20 || nameRegex.test(lastName) === false || lastName < 1) {
		response.send('last name invalid');
	}	else if	(gender !== 'male' && gender !== 'female') {
		response.send('invalid gender');
	}	else if	(bio.length > 500) {
		response.send('bio too long');
	}	else if	(noWhiteSpaceBio.length === 0) {
		response.send('bio empty');
	}	else if (preference !== 'bisexual' && preference !== 'heterosexual' && preference !== 'homosexual') {
		response.send('invalid preference');
	}	else if (validateEmail(email) === false) {
		response.send('invalid email');
	}	else if ( validateLocation(location.lat, location.lon) === false) { 
		response.send('invalid coordinates');
	} else {
		const checkIfEmailExists = "SELECT * FROM users WHERE email = ? AND id NOT LIKE ?;";
		db.query(checkIfEmailExists, [email, id], function (error, result) {
			if (error) {
				response.send('error')
			} else {
				if (result.length > 0 && result[0].id !== id) {
					response.send('email exists');
				} else {
					const checkIfUsernameExists = "SELECT username FROM users WHERE username = ? AND id NOT LIKE ?;";
					db.query(checkIfUsernameExists, [username, id], function (error, result) {
						if (error) {
							response.send('error')
						} else {
							if (result.length > 0 && result[0].id !== id) {
								response.send('username exists');
							} else {
								const updateUser = "UPDATE users SET name = ?, lastName = ?, username = ?, email = ?, gender = ?, bio = ?, preference = ?, interests = ? WHERE id = ?"
								db.query(updateUser, [name, lastName, username, email, gender, bio, preference, myJSON, userId], (error, result) => {
									if (error) {
										response.send('error');
									} else {
										const updateLocation = "UPDATE locations SET user_set_location = POINT(?, ?) WHERE user_id = ?;";
										db.query(updateLocation, [ location.lon, location.lat, userId], function (error, result) {
											if (error) {
												response.send('error');
											} else {
													const newTags = interests.filter((interest) => !tags.map((tag) => tag.tag).includes(interest));
														newTags.forEach(async (tag) => {
															const sql = `INSERT INTO tags (tag) VALUES (?)`;
															db.query(sql, [tag],(err, result) => {
																if (err) {
																	console.log('error')
																}
															})
														})
														response.send('OK')
												}
											})
									}
								})
							}
						}
					});
				}
			}
		})
	}
}

module.exports = {
	changePassword,
	changeUserInfo,
	restorePassword,
	passwordRestore,
}
