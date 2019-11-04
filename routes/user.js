const bcrypt = require('bcryptjs');
const _ = require('lodash');
const { User, validateForDealer,validateForAudiokraft,validateUserForUpdate } =  require('../models/user');
const { Role} =  require('../models/role');
const roles = require('../constants/constantsroles');
const usertypes = require('../constants/constantsusertypes');
const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();

router.post('/createUserForDealer', async (req, res) => {
    const {error} = validateForDealer(req.body); 
    if (error) return res.status(400).send({ statusCode : 400, error : 'Bad Request' , message : error.message });
   
    let user = await User.findOne({imei: req.body.imei});
    if(user) return res.status(400).send({ statusCode : 400, error : 'Bad Request' , message : 'IMEI Aleady exist.' });
    
    user = await User.findOne({email: req.body.email}).select('email');
    if(user) return res.status(400).send({ statusCode : 400, error : 'Bad Request' , message : 'Email already exist.' });
    user = new User(_.pick(req.body, ['firstName', 'lastName','email', 'city','password','imei','reference']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);         
    var roleArray = [roles.ROLE_DEALER];
    user.role = roleArray;     
    user.userType = usertypes.USER_TYPE_DEALER;
    user = await user.save();    
    return res.status(201).send({statusCode : 201, message : 'Successfully Registered.'});
});
router.post('/createUserForAudiokraft', async (req, res) => {
    const {error} = validateForAudiokraft(req.body); 
    if (error) return res.status(400).send({ statusCode : 400, error : 'Bad Request' , message : error.message });
   
    let user = await User.findOne({imei: req.body.imei});
    if(user) return res.status(400).send({ statusCode : 400, error : 'Bad Request' , message : 'IMEI Aleady exist.' });
    
    user = await User.findOne({email: req.body.email}).select('email');
    if(user) return res.status(400).send({ statusCode : 400, error : 'Bad Request' , message : 'Email already exist.' });
    
    let role = await Role.findOne({role:req.body.role}).select('role userType');
    if(!role) return res.status(400).send({ statusCode : 400, error : 'Bad Request' , message : 'Role not found.' });
    
    user = new User(_.pick(req.body, ['firstName', 'lastName','email', 'city','password','imei','reference','role']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    user.userType = role.userType;
    user = await user.save();    
    return res.status(201).send({statusCode : 201, message : 'Successfully Registered.'});
});

router.patch('/enableOrApproveUser', auth, async (req, res) => {
    const { error } = validateUserForUpdate(req.body); 
    if (error) return res.status(400).send({ statusCode : 400, error : 'Bad Request' , message : error.message });
    let user = await User.findOne({_id:req.body.userId});
    if(!user) return res.status(404).send({ statusCode : 404, error : 'Not Found' , message : 'User not found please provide userId.' });
    user.enabled=req.body.enabled;
    user.isApproved=req.body.isApproved;
    user.updatedBy = req.user.id;
    user = await user.save();
    return res.status(200).send(user);
});

module.exports = router;