const express = require('express');
const db = require('./config/db.js');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Listening on port ${port}`))
