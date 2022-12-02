
const db = require('../config/db');
const bcrypt = require("bcrypt");
let i = 4;
const users = [
	{
		username: 'Toto Cutugno',
		email: 'napoli4ever@proton.me',
		password: bcrypt.hashSync('Amedeo11', 10),
		gender: 'male',
		bio: 'ma quant\' ébbella Napoli',
		birthday: '1958-07-14',
		preference: 'heterosexual',
		activation_token: 'CCZu6d86gvwOFMvNO6viGqU-bFPhQ1PtMcJPy7KoAlYPYzfUTdsrJQT7Abyn5zQe'
	},
	{
		username: 'Anamaria Camaracan',
		email: 'anana@proton.me',
		password: bcrypt.hashSync('Amedeo11', 10),
		gender: 'female',
		bio: 'fire walk with me',
		birthday: '1995-02-07',
		preference: 'heterosexual',
		activation_token: 'lVO9sksqxGMZmPX2h1oVb1JRZG3prypyndyvH8YeDdsSg3gcgo01T21eAJH-oxGY'
	},
	{
		username: 'Juho Kangas',
		email: 'jho@proton.me',
		password: bcrypt.hashSync('Amedeo11', 10),
		gender: 'male',
		bio: 'matcha is a pawerful tool',
		birthday: '1991-06-10',
		preference: 'heterosexual',
		activation_token: 'o_6pQHGDB1GjgpcsSmURnWUiibzqmYhd_-qT3b4YHexmhaduEyGYTiLosEsILPBE'
	},
	{
		username: 'Ilona Shakurova',
		email: 'ishakuro@proton.me',
		password: bcrypt.hashSync('Amedeo11', 10),
		gender: 'female',
		bio: "c'mooooon !durak!",
		birthday: '1992-01-30',
		preference: 'heterosexual',
		activation_token: 'z4ThGq_CofJNpP5BjgvuW7k1_tw0aRqStNI02o4WkOBn58VscDW2tnHYrzIAONXu'
	},
	{
		username: 'Andrea Uomodadietro',
		email: 'auomo@proton.me',
		password: bcrypt.hashSync('Amedeo11', 10),
		gender: 'male',
		bio: "not to brag but I am batman",
		birthday: '1994-06-01',
		preference: 'heterosexual',
		activation_token: 'WAI6SFy8nnWl1lGsxvddvla2ykMxht1WfPJ2BJBQu3jwDBqbbm-KDmyhIRNaV3dr'
	}
]
let sql = '';
while (i >= 0)	{
	sql = `INSERT INTO users \
	(username, email, password, gender, bio, birthday, preference, activation_token) \
	VALUES \
	(?, ?, ?, ?, ?, ?, ?, ?)`;
	db.query(sql,[ users[i].username, users[i].email, users[i].password, users[i].gender, users[i].bio, users[i].birthday, users[i].preference, users[i].activation_token ], 
		function (error, results) {
			if (error) throw error;
		}
	);
	i--;
}
