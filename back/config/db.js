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

	let sql = "CREATE TABLE IF NOT EXISTS users (id INT(11) AUTO_INCREMENT PRIMARY KEY,\
	name VARCHAR(20),\
	lastName VARCHAR(20),\
	username VARCHAR(50),\
	email VARCHAR(200),\
	password VARCHAR(250),\
	gender VARCHAR(7),\
	bio VARCHAR(500),\
	birthday DATE,\
	preference VARCHAR(13),\
	interests JSON,\
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

	sql = "CREATE TABLE IF NOT EXISTS user_pictures \
	(id INT(11) AUTO_INCREMENT PRIMARY KEY,\
	user_id INT(11) UNIQUE,\
	pic_1 VARCHAR(60),\
	pic_2 VARCHAR(60),\
	pic_3 VARCHAR(60),\
	pic_4 VARCHAR(60),\
	pic_5 VARCHAR(60));";

	
	con.query(sql, (err, result) => {
		if (err) throw err;
		if (result.affectedRows === 0)
			console.log('\x1b[36m%s\x1b[0m', "user_picture table already exists");
		else
			console.log('\x1b[36m%s\x1b[0m', "user_pictures tale created");
	});

	sql = "CREATE TABLE IF NOT EXISTS locations \
	(id INT(11) AUTO_INCREMENT PRIMARY KEY,\
	user_id INT(11) UNIQUE,\
	gps_location POINT,\
	ip_location POINT,\
	user_set_location POINT,\
	user_set_city VARCHAR(50),\
	gps_city VARCHAR(50),\
	ip_city VARCHAR(50));";

	
	con.query(sql, (err, result) => {
		if (err) throw err;
		if (result.affectedRows === 0)
			console.log('\x1b[36m%s\x1b[0m', "locations table already exists");
		else
			console.log('\x1b[36m%s\x1b[0m', "locations tale created");
	});

	sql = "CREATE TABLE IF NOT EXISTS notifications \
	(id INT(11) AUTO_INCREMENT PRIMARY KEY,\
	user_id INT(11),\
	content VARCHAR(60),\
	time DATETIME DEFAULT NOW());";

	
	con.query(sql, (err, result) => {
		if (err) throw err;
		if (result.affectedRows === 0)
			console.log('\x1b[36m%s\x1b[0m', "notifications table already exists");
		else
			console.log('\x1b[36m%s\x1b[0m', "notifications tale created");
	});

});

const db = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_NAME
});

module.exports = db;
