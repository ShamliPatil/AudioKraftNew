const {User} = require('../models/user');
const bcrypt = require('bcryptjs');	
const Joi = require('@hapi/joi');
const jwt = require('jsonwebtoken');	
const config = require('config');	
const express = require('express');
const router = express.Router();		

router.post('/', async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send({ statusCode : 400, error : 'Bad Request' , message : error.message });
     
    let user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send({ statusCode : 400, error : 'Bad Request' , message : 'Invalid username or password.' });
    //compare user imei with req.body iemi
    if(new String(user.imei).valueOf()  != new String(req.body.imei).valueOf()) return res.status(400).send({ statusCode : 400, error : 'Bad Request' , message : 'Invalid Device plaese contact Admin.' });
    
    if(user.enabled == false) return res.status(400).send({ statusCode : 400, error : 'Bad Request' , message : 'User Not enabled plaese contact Admin.' });
    if(user.isApproved == false) return res.status(400).send({ statusCode : 400, error : 'Bad Request' , message : 'User Not enabled plaese contact Admin.' });

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send({ statusCode : 400, error : 'Bad Request' , message : 'Invalid username or password.' });

    if(user.isApproved == false) return res.status(401).send({ statusCode : 401, error : 'Unauthorized' , message : 'User is is Not Approved.' });

    const token = generateAuthToken(user);
   // user.session = token;
  //  user.loginTime = new Date().getTime();
    user = await user.save();
   // const refreshToken = user.generateRefreshToken();
    return res.status(200).send({statusMessage:"Login Successful" ,"token" : token, "userType" : user.userType});
});
function validate(req){
    const schema = Joi.object().keys({
        email : Joi.string().min(2).trim().max(30).required(),
        password : Joi.string().min(2).trim().max(30).required(),
        imei :Joi.string().min(10).max(20).trim().required()   
    })
     return {error} = schema.validate(req);
    //return Joi.validate(req, schema);                           
};
function generateAuthToken(user){    
    const token = jwt.sign({_id:user._id,email:user.email, userType : user.userType }, config.get('jwtPrivateKey') + user.password ,{ expiresIn: '90d'},{ algorithm: 'RS256'});
    return token;
};
module.exports = router;