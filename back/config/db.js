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
	password VARCHAR(250),\
	gender VARCHAR(7),\
	bio VARCHAR(500),\
	birthday VARCHAR(11),\
	preference VARCHAR(13),\
	acti_stat INT (11) default 0,\
	notif_stat BOOLEAN default 1,\
	activation_token VARCHAR(250),\
	registration_date DATETIME DEFAULT NOW());";
	
	db.query(sql, (err, result) => {
		if (err) throw err;
		console.log('Connected to MySQL server');
	});

});


module.exports = db;