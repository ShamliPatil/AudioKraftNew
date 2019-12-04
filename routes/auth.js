const {User} = require('../models/user');
const { Dealership} = require('../models/dealership');
const mongoose = require('mongoose');
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
    //check dealer is assign to user or not.
    if(user.userType == 'dealer'){
        if(!user.assignDealer) {
            return res.status(400).send({ statusCode : 400, error : 'Bad Request' , message : 'Dealer not assign to user please contact admin' });
        }else{
            //check object id is valid or not
            if(!mongoose.Types.ObjectId.isValid(user.assignDealer)) return res.status(400).send({statusCode:400,error:'Bad Request',message:'Please provide valid dealerId.'});
            // get dealer for that id
            const dealer = await Dealership.findOne({_id:user.assignDealer});
            if(!dealer) return res.status(400).send({statusCode:404,error:'Bad Request',message:'Dealer not found'});
            // check dealer is disable or not
            if(dealer.enabled == false) return res.status(400).send({ statusCode : 400, error : 'Bad Request' , message : 'Dealer Not enabled plaese contact Admin.' });
            //compare user imei with req.body iemi
            if(new String(user.imei).valueOf()  != new String(req.body.imei).valueOf()) return res.status(400).send({ statusCode : 400, error : 'Bad Request' , message : 'Invalid Device plaese contact Admin.' });
        }

    }
   
  
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
    return res.status(200).send({statusMessage:"Login Successful" ,"token" : token, "userType" : user.userType,dealerId:user.assignDealer,userId:user.id});
});
function validate(req){
    const schema = Joi.object().keys({
        email : Joi.string().min(2).trim().max(30).required(),
        password : Joi.string().min(2).trim().max(30).required(),
        imei :Joi.string().min(10).max(20).trim()
    })
     return {error} = schema.validate(req);
    //return Joi.validate(req, schema);                           
};
function generateAuthToken(user){    
    const token = jwt.sign({_id:user._id,email:user.email, userType : user.userType }, config.get('jwtPrivateKey') + user.password ,{ expiresIn: '90d'},{ algorithm: 'RS256'});
    return token;
};
module.exports = router;