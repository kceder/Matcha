const db = require('../config/db.js');
const bcrypt = require("bcrypt");


const changePassword = (request,  response) => {

	const password = request.body.oldPassword;
	const newPassword = request.body.newPassword;

	const selectPassword = "SELECT password FROM users WHERE id = ?;";
	db.query(selectPassword, [request.user.id],
		function (error, result) {

			if (error) throw error
			if (result.length > 0) {

				console.log(password)
				bcrypt.compare(password,  result[0].password, function(err, valid) {
					if (valid === true) {
						const hash = bcrypt.hashSync(newPassword, 10);
						const updatePassword = "UPDATE users SET password = ? WHERE id = ?;";
						db.query(updatePassword, [hash, request.user.id],  function (error, resut) {
							if (error) throw error;
							else	console.log(result);
						})
					}
					console.log(request.body.newPassword)
			})
		}
	})
	
}

module.exports = {
	changePassword
}
