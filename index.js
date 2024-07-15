const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const db = require('./dbconnection');
const port = 3000

//DB 연결
db.connect((err) => {
    err ? console.log('db connection failed ...') : console.log('db connection success ...');
});

//router path
const routes = require('./router/router');

// bodyParser
app.use(bodyParser.json());

// cors
app.use(cors())

app.use('/api', routes);

// server
app.listen(port, (err) => {
    if(err) throw err;
    console.log(`Server is running on ${ port }`);
})