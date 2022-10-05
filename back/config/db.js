const mysql = require('mysql');
require('dotenv').config();

const con = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
});

con.connect((err) => {
	if (err) throw err;
	con.query("CREATE DATABASE IF NOT EXISTS matcha", function (err, result) {
		if (err) throw err;
		if (result.affectedRows === 0)
			console.log('\x1b[36m%s\x1b[0m', "Database already exists");
		else
			console.log('\x1b[36m%s\x1b[0m', "Database created");
	});

	con.query("USE matcha", function (err, result) {
		if (err) throw err;
		console.log("\x1b[35m", "Using to matcha db");
	});

	const sql = "CREATE TABLE IF NOT EXISTS users (id INT(11) AUTO_INCREMENT PRIMARY KEY,\
	username VARCHAR(50),\
	email VARCHAR(50),\
	password VARCHAR(250),\
	gender VARCHAR(7),\
	bio VARCHAR(500),\
	birthday VARCHAR(11),\
	preference VARCHAR(13),\
	interests JSON,\
	location POINT,\
	acti_stat INT (11) default 0,\
	notif_stat BOOLEAN default 1,\
	activation_token VARCHAR(250),\
	registration_date DATETIME DEFAULT NOW());";
	
	con.query(sql, (err, result) => {
		if (err) throw err;
		if (result.affectedRows === 0)
			console.log('\x1b[36m%s\x1b[0m', "users table already exists");
		else
			console.log('\x1b[36m%s\x1b[0m', "users tale created");
	});

});

const db = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_NAME
});

module.exports = db;
