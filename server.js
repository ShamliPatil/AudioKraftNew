const express = require('express'); 
const config = require('config');
const cors = require('cors')
const app = express();

app.use(cors());

require('./startup/config')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/validation')();
require('./startup/prod')(app);

const port = process.env.PORT || 4800;
app.listen(port, () => console.log(`Server Listening on port ${port}...`));