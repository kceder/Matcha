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

let sendRecoveryMail = (userInfo) => {
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
							New Password
						</title>
					</head>
					<body>
						<h1>Reset you password</h1>
						<p>Click this link to reset your password <a href="http://localhost:3000/activateaccount/token=${userInfo.activationToken}">link</a></p>
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