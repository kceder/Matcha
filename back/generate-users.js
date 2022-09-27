
const db = require('./config/db');
const bcrypt = require("bcrypt");
let i = 4;
const users = [
	{
		username: 'Amedeo Majer',
		email: 'amajer69@proton.me',
		password: bcrypt.hashSync('Amedeo11', 10),
		gender: 'male',
		bio: 'hello je ne suis pa Louis',
		birthday: '1995-11-26',
		preference: 'heterosexual'
	},
	{
		username: 'Anamaria Camaracan',
		email: 'anana@proton.me',
		password: bcrypt.hashSync('Amedeo11', 10),
		gender: 'female',
		bio: 'fire walk with me',
		birthday: '1995-02-07',
		preference: 'heterosexual'
	},
	{
		username: 'Juho Kangas',
		email: 'jho@proton.me',
		password: bcrypt.hashSync('Amedeo11', 10),
		gender: 'male',
		bio: 'matcha is a pawerful tool',
		birthday: '1991-06-10',
		preference: 'heterosexual'
	},
	{
		username: 'Ilona Shakurova',
		email: 'ishakuro@proton.me',
		password: bcrypt.hashSync('Amedeo11', 10),
		gender: 'female',
		bio: "c'mooooon !durak!",
		birthday: '1992-01-30',
		preference: 'heterosexual'
	},
	{
		username: 'Andrea Uomodadietro',
		email: 'auomo@proton.me',
		password: bcrypt.hashSync('Amedeo11', 10),
		gender: 'male',
		bio: "not to brag but I am batman",
		birthday: '1994-06-01',
		preference: 'heterosexual'
	}
]
let sql = '';
while (i >= 0)	{
	sql = `INSERT INTO users \
	(username, email, password, gender, bio, birthday, preference) \
	VALUES \
	(?, ?, ?, ?, ?, ?, ?)`;
	db.query(sql,[ users[i].username, users[i].email, users[i].password, users[i].gender, users[i].bio, users[i].birthday, users[i].preference ], 
		function (error, results) {
			if (error) throw error;
			else 
				console.log('row added');
		}
	);
	i--;
}



// db.connect((err) => {
// 	if (err) throw err;
// 	console.log('Connected to database');
// 	const sql = "CREATE TABLE IF NOT EXISTS users (id INT(11) AUTO_INCREMENT PRIMARY KEY,\
// 	username VARCHAR(50),\
// 	email VARCHAR(50),\
// 	password VARCHAR(250),\
// 	gender VARCHAR(7),\
// 	bio VARCHAR(500),\
// 	birthday VARCHAR(11),\
// 	preference VARCHAR(13),\
// 	registration_date DATETIME DEFAULT NOW());";
	
// 	db.query(sql, (err, result) => {
// 		if (err) throw err;
// 		console.log('Connected to MySQL server');
// 	});

// });