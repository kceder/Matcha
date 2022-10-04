const db = require('../config/db.js');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const { sendMail } = require('../utils/sendEmail');


const  getAllUsers = (request, response) => {
	const sql = 'SELECT * FROM users';
	db.query(sql,
		function (error, result) {
			if (error) throw error
			response.send(result);
		})
}

const activateUser = (request, response) => {
	const sql = 'SELECT * FROM users WHERE activation_token = ?';
	console.log("YHAAA")

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

const login = (request, response) => {
	const sql = 'SELECT * FROM users WHERE email = ?';
	const email = request.body.email;
	const password = request.body.password;
	db.query(sql, [email],
		function (error, result) {
			console.log('cdsvds', result)
			if (error) throw error;
			if (result.length > 0) {
				bcrypt.compare(password,  result[0].password, function(err, compare) {
					if (err) throw err
					console.log(compare) // this is printed
					if (compare == true) {
						console.log(result)
						const user = { name : result[0].username , id : result[0].id }
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


const register = (request, response) => {

	const name = request.body.name;
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
				(username, email, password, activation_token) \
				VALUES \
				(?, ?, ?, ?)`;
				db.query(sql,[ name, email, hash, activationToken ], 
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


module.exports = {
	getAllUsers,
	login,
	activateUser,
	register,
}
// app.post('/api/set-up-user', (request, response) => {
// 	console.log(request.cookies);
// })