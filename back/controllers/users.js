const express		= require('express');
const app			= express();
const cors			= require('cors');
const db = require('../config/db.js');




// const addUser = (userInfo) => {
// 	const sql = 'INSER INTO users (username, email, password) VALUES ("amedeo", "wakadaka@kaka.lo", "1234")'
// 	db.query(sql, function(error, result) {
// 		if (error) throw error;
// 		console.log('row inserted');
// 	})