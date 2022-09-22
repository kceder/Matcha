const express = require('express');
const db = require('./config/db.js');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
require('dotenv').config();

const requestLogger = (request, response, next) => {
	console.log('Method:', request.method)
	console.log('Path:  ', request.path)
	console.log('Body:  ', request.body)
	console.log('---')
	next()
}

app.use(express.json());
app.use(requestLogger);
app.use(cors());
app.use(express.static('build'));

app.get('/api/users', (request, response) => {
	const sql = 'SELECT * FROM users';
	db.query(sql,
		function (error, result) {
			if (error) throw error
			response.send(result);
		})
})

app.post('/api/login', (request, response) => {
	const sql = 'SELECT * FROM users WHERE email = ?';
	const email = request.body.email;
	const password = request.body.password;
	db.query(sql, [email],
		function (error, result) {
			if (error) throw error;
			if (result.length > 0) {
				bcrypt.compare(password,  result[0].password, function(err, compare) {
					if (err)
						console.log(err);
					console.log(compare)
					if (compare === true) {
						const user = { name : result[0].username , id : result[0].id }
						const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
						response.status(200).json({ accessToken : accessToken })
					} else {
						response.send('wrong password')
					}
				});
			}
			else 
				response.send('user not found');
		})
})

app.post('/api/register', (request, response) => {

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
				const sql = `INSERT INTO users \
				(username, email, password) \
				VALUES \
				(?, ?, ?)`;
				db.query(sql,[ name, email, hash ], 
					function (error, results) {
						if (error) throw error;
						else 
							console.log('row added');
					}
				);
				response.status(201).json({
					name: name,
					email: email,
					password: password,
				})
			}
		})
})

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Listening on port ${port}`))
