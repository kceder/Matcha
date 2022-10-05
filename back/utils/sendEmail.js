const nodemailer = require('nodemailer');
require('dotenv').config();

let sendMail = (userInfo) => {
	console.log('mail ', userInfo)
	const receiver = userInfo.email;

	var transport = nodemailer.createTransport({
		host: "smtp.mailtrap.io",
		port: 2525,
		auth: {
			user: "25a47fd36dad9f",
			pass: "7ab8f4e35d1948"
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

module.exports = {sendMail};