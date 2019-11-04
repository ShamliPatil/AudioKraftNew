const express = require('express'); 
//const winston = require('winston');
const config = require('config');
const cors = require('cors')
const app = express();

//console.log('Application Name: ' + config.get('name'));
app.use(cors());

//require('./startup/logging')();
require('./startup/config')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/validation')();
require('./startup/prod')(app);

const port = process.env.PORT || 2000;
app.listen(port, () => console.log(`Server Listening on port ${port}...`));