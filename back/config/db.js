const mysql = require('mysql');
require('dotenv').config();

const db = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_NAME
});

db.connect((err) => {
	if (err) throw err;
	console.log('Connected to database');
	const sql = "CREATE TABLE IF NOT EXISTS users (id INT(11) AUTO_INCREMENT PRIMARY KEY,\
	username VARCHAR(50),\
	email VARCHAR(50),\
	password VARCHAR(13));";
	db.query(sql, (err, result) => {
		if (err) throw err;
		console.log('Table created');
	});

});

module.exports = db;