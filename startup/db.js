const mongoose = require('mongoose');
//const winston = require('winston');
const config = require('config');

module.exports = function(){   
    mongoose.set('useNewUrlParser', true);
    mongoose.set('useFindAndModify', false);
    mongoose.set('useCreateIndex', true);
    mongoose.set('useUnifiedTopology', true );
    mongoose.connect(config.get('dbConnection',{useUnifiedTopology: true,useNewUrlParser: true}));
   console.log('Connected to MongoDB ...');
}