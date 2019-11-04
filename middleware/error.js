//const winston = require('winston');

module.exports = function(err, req, res, next){
  console.error(err.message,err);
    return res.status(500).send({ statusCode : 500, error : 'Internal Server Error.' , message : 'An internal server error occurred.' }); 
}