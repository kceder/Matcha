const nodemailer = require('nodemailer');
require('dotenv').config();

let sendMail = (userInfo) => {
	console.log('mail ', userInfo)
	const receiver = userInfo.email;

	var transport = nodemailer.createTransport({
		host: "smtp.mailtrap.io",
		port: 2525,
		auth: {
			user: process.env.MAILTRAP_USER,
			pass: process.env.MAILTRAP_PASS
		}
	});

	const html = `
				<html>
					<head>
						<title>
							Activate Account
						</title>
					</head>
					<body>
						<h1>Activate your Account</h1>
						<p>Thank you for registering with us, here is a <a href="http://localhost:3000/activateaccount/token=${userInfo.activationToken}">link</a> to verify your email address and activate your</p>
					</body>
				</html>
				`

	var mailOptions = {
		from: '"Matcha" <activate@matcha.com>',
		to: receiver,
		subject: 'Activate Matcha account',
		html: html,
		text: 'thank you for signing up, follow the link to ctivate your account :)'
		};

	transport.sendMail(mailOptions, function(error, info){
		if (error) {
			console.log(error);
		} else {
			console.log('Email sent: ' + info.response);
		}
	});
}

let sendRecoveryMail = (email, token) => {
	console.log('recovery mail: ', email)
	const receiver = email;

	var transport = nodemailer.createTransport({
		host: "smtp.mailtrap.io",
		port: 2525,
		auth: {
			user: process.env.MAILTRAP_USER,
			pass: process.env.MAILTRAP_PASS
		}
	});

	const html = `
				<html>
					<body style="background-color: f2f2f2; font-size: 22px; font-family: Arial;">
						<title>
							New Password
						</title>
						<h1 style="color: #3c3c45;">Ay, no worries!</h1>
						<p>You can press this button to set a new password</p>
						<br>
						<button href="http://localhost:3000/restore/token=${token}">New Password</button>
						<br>
						<br>
						<p style="font-size: 14px;"> If you did not request a new password, please ignore this email</p>
					</body>
				</html>
				`

	var mailOptions = {
		from: '"Matcha" <activate@matcha.com>',
		to: receiver,
		subject: 'New Password',
		html: html,
		text: 'Click the link provided to set your new password :)'
		};

	transport.sendMail(mailOptions, function(error, info){
		if (error) {
			console.log(error);
		} else {
			console.log('Email sent: ' + info.response);
		}
	});
}

module.exports = {sendMail, sendRecoveryMail};