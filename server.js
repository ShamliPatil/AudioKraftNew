const express = require('express'); 
const config = require('config');
const cors = require('cors')
const path = require('path');
const app = express();

app.use(cors());
//Set the base path to the angular-test dist folder
// app.use(express.static(path.join(__dirname, 'AudioKraft-build')));

// //Any routes will be redirected to the angular app
// app.get('*', function(req, res) {
//     res.sendFile(path.join(__dirname, 'AudioKraft-build/index.html'));
// });

require('./startup/config')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/validation')();
require('./startup/prod')(app);

const port = process.env.PORT || 4800;
app.listen(port, () => console.log(`Server Listening on port ${port}...`));