const nodemailer = require('nodemailer');
require('dotenv').config();

let sendMail = (userInfo) => {
	const receiver = userInfo.email;

	var transport = nodemailer.createTransport({
		service: 'Outlook365',
		auth: {
			user: process.env.EMAIL_SENDER,
			pass: process.env.EMAIL_PASSWORD
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
		from: '"Matcha" <krisuceder@hotmail.com>',
		to: receiver,
		subject: 'Activate Matcha account',
		html: html,
		text: 'thank you for signing up, follow the link to ctivate your account :)'
		};

	transport.sendMail(mailOptions, function(error, info){
		if (error) console.log(error);
	});
}

let sendRecoveryMail = (email, token) => {
	const receiver = email;

	var transport = nodemailer.createTransport({
		service: 'Outlook365',
		auth: {
			user: process.env.EMAIL_SENDER,
			pass: process.env.EMAIL_PASSWORD
		}
	});

	const html = `
				<html>
					<body style="background-color: f2f2f2; font-size: 22px; font-family: Arial;">
						<title>
							New Password
						</title>
						<h2 style="color: #3c3c45;">Ay, no worries!</h2>
						<p>You can press this button to set a new password</p>
						<br>
						<a href="http://localhost:3000/restore/token=${token}">New Password</p>
						<br>
						<br>
						<p style="font-size: 14px;"> If you did not request a new password, please ignore this email</p>
					</body>
				</html>
				`

	var mailOptions = {
		from: '"Matcha" <krisuceder@hotmail.com>',
		to: receiver,
		subject: 'New Password',
		html: html,
		text: 'Click the link provided to set your new password :)'
		};

	transport.sendMail(mailOptions, function(error, info){
		if (error) console.log(error);
	});
}
let sendReportMail = (target) => {
	const receiver = 'krisuceder@hotmail.com';

	var transport = nodemailer.createTransport({
		service: 'Outlook365',
		auth: {
			user: process.env.EMAIL_SENDER,
			pass: process.env.EMAIL_PASSWORD
		}
	});

	const html = `
				<html>
					<body style="background-color: f2f2f2; font-size: 22px; font-family: Arial;">
						<title>
							User Reported
						</title>
						<h2 style="color: #3c3c45;">Here we go again!</h2>
						<p>User with ID ${target} has been reported. Time to take action?</p>
						<br>
					</body>
				</html>
				`

	var mailOptions = {
		from: '"Matcha" <krisuceder@hotmail.com>',
		to: receiver,
		subject: 'User Reported',
		html: html,
		};

	transport.sendMail(mailOptions, function(error, info){
		if (error) console.log(error)
	});
}

module.exports = {sendMail, sendRecoveryMail, sendReportMail};