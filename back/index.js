
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');
const userRouter = require('./routers/userRouter.js')
const envRouter = require('./routers/envRouter.js')
const locationRouter = require('./routers/locationRouter.js')
const settingsRouter = require('./routers/settingsRouter')
const photosRouter = require('./routers/photosRouter')
const tagsRouter = require('./routers/tagsRouter')
const matchRouter = require('./routers/matchRouter')

require('dotenv').config();



const requestLogger = (request, response, next) => {
	console.log('Method:', request.method)
	console.log('Path:  ', request.path)
	// console.log('Body:  ', request.body)
	console.log('---')
	next();
}

app.use(cors({credentials : true, origin : 'http://localhost:3000'}));
app.use(bodyParser.json({limit: '1000mb'}));
app.use(bodyParser.urlencoded({limit: '1000mb', extended: true}));
app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);
app.use(express.static('build'));
app.use("/images", express.static("./images"));
app.use("/profilePics", express.static("./profilePics"));
app.use(userRouter);
app.use(envRouter);
app.use(locationRouter);
app.use(settingsRouter);
app.use(photosRouter);
app.use(tagsRouter);
app.use(matchRouter);

const port = process.env.PORT || 5000;
console.log('											')
app.listen(port, () => console.log(`Listening on port ${port}`))