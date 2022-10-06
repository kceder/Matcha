const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');
const userRouter = require('./routers/userRouter.js')
const envRouter = require('./routers/envRouter.js')
require('dotenv').config();



const requestLogger = (request, response, next) => {
	console.log('Method:', request.method)
	console.log('Path:  ', request.path)
	console.log('Body:  ', request.body)
	console.log('---')
	next();
}

app.use(cors({credentials : true, origin : 'http://localhost:3000'}));
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser())
app.use(requestLogger);
app.use(express.static('build'));
app.use(userRouter);
app.use(envRouter);

const port = process.env.PORT || 5000;
console.log('											')
app.listen(port, () => console.log(`Listening on port ${port}`))