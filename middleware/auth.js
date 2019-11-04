const _ = require('lodash');
const jwt = require('jsonwebtoken');
const config = require('config');
const url2 = require('url');
const { Role } = require('../models/role');
const {User}  = require('../models/user');

async function auth(req, res, next) {
    const token = req.header('x-auth-token');
    if(!token) return res.status(401).send({ statusCode : 401, error : 'Unauthorized.' , message : 'Token not provided.' });    

    try{
        var decodedId = jwt.decode(token);
      //  const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        // code 
        const user = await User.findOne({ _id : decodedId._id });
        if(!user) return res.status(401).send({ statusCode : 401, error : 'Unauthorized.' , message : 'Access denied. Invalid token.' });
        // get the decoded payload and header
        if(!user.enabled) return res.status(401).send({ statusCode : 401, error : 'Unauthorized' , message : 'User is disabled. Please contact Admin.' }); 
        // 1) get user role 2) check previleges        
        
        const decoded = jwt.verify(token, config.get('jwtPrivateKey') + user.password );

        const getUrlForPrev = req.method + url2.parse(req.originalUrl).pathname;
        if(user.role.length == 0) return res.status(403).send({ statusCode : 403, error : 'Forbidden.' , message : 'Role not found. Please contact admin.'});
        user.password = undefined;
        req.user = user;
        var found = false;
        for(var i = 0; i < user.role.length; i++){
            const role = await Role.findOne({ role : user.role});
            if(role){       
                  if(_.includes(role.privileges,getUrlForPrev )){
                    found = true;
                    break;
                  }                
            }
        }
        if(found){            
            next();
        }else{
            return  res.status(403).send({ statusCode : 403, error : 'Forbidden' , message :'Role or Privilege issue. Please contact admin.'});
        }
    }catch(ex){ 
        return res.status(408).send({ statusCode : 408, error : 'Request Time-out.' , message : 'Access denied. Invalid token.' });
    }
}

module.exports = auth;