const nodemailer = require('nodemailer');
require('dotenv').config();

let sendMail = (userInfo) => {
	
	const receiver = userInfo.email;

	let transporter = nodemailer.createTransport({
		// shit no work!
	});
		
	var mailOptions = {
		from: 'amajer69@protonmail.com',
		to: 'amajer69@proton.me',
		subject: 'Activate Matcha account',
		text: 'That was easy!'
		};
		
	transporter.sendMail(mailOptions, function(error, info){
		if (error) {
			console.log(error);
		} else {
			console.log('Email sent: ' + info.response);
		}
	});
}

module.exports = {sendMail};