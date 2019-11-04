const _ = require('lodash');
const { Role, validate, validatePrivilege } =  require('../models/role');
//const authWithoutRole = require('../middleware/auth_without_role');
const express = require('express');
const url2 = require('url');
const router = express.Router();

router.get('/', async (req, res) => {      
  const roles = await Role.find().sort({ createdAt : 1 });
  if(roles.length == 0) return res.status(404).send({ statusCode : 404, error : 'Not Found' , message : 'Role information not found.' });
  return res.status(200).send(roles);
});

router.get('/findByRoleName', async (req, res) => {      
    if((!req.query.roleName) || (req.query.length == 0)) return res.status(400).send({ statusCode : 400, error : 'Bad Request' , message : 'Please provide role name.' });        
    const role = await Role.findOne({ role : req.query.roleName });
    if(!role) return res.status(404).send({ statusCode : 404, error : 'Not Found' , message : 'Role information not found.' });
    return res.status(200).send(role);
});

router.get('/findByRoleType', async (req, res) => {      
    if((!req.query.type) || (req.query.type.length == 0)) return res.status(400).send({ statusCode : 400, error : 'Bad Request' , message : 'Please provide role id.' });
    const role = await Role.find({ type : req.query.type });
    if(!role) return res.status(404).send({ statusCode : 404, error : 'Not Found' , message : 'Role information not found.' });
    return res.status(200).send(role);
});
router.get('/findByRoleId', async (req, res) => {      
    if((!req.query.id) || (req.query.id.length == 0)) return res.status(400).send({ statusCode : 400, error : 'Bad Request' , message : 'Please provide role id.' });
    const role = await Role.findOne({ _id : req.query.id });
    if(!role) return res.status(404).send({ statusCode : 404, error : 'Not Found' , message : 'Role information not found.' });
    return res.status(200).send(role);
});

router.post('/', async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send({ statusCode : 400, error : 'Bad Request' , message : error.message });

    let role = await Role.findOne({ role : req.body.role });
    if(role) return res.status(400).send({ statusCode : 400, error : 'Bad Request' , message : 'Role already exist.' });
      
    role = new Role(_.pick(req.body, ['role','type']));
    //role.createdBy = 'test';
    role.privileges = [];
    role = await role.save();    
    return res.status(201).send(role);
});

router.post('/assignPrivilege', async (req, res) => {
    const { error } = validatePrivilege(req.body); 
    if (error) return res.status(400).send({ statusCode : 400, error : 'Bad Request' , message : error.message });

    let role = await Role.findOne({ _id : req.body.roleId });
    if(!role) return res.status(404).send({ statusCode : 404, error : 'Not Found' , message : 'Role not found.' });    

    if(!url2.parse(req.body.url)) return res.status(400).send({ statusCode : 400, error : 'Bad Request' , message : 'Please enter valid url.' });

    const getUrlForPrev = req.body.method + url2.parse(req.body.url).pathname;

    if(_.includes(role.privileges,getUrlForPrev )){
        return res.status(400).send({ statusCode : 400, error : 'Bad Request' , message : 'Privilege is already assign to this role.' }); 
    }else{
        role.privileges.push(getUrlForPrev);
       // role.updatedBy = req.user.id;
        role = await role.save();    
        return res.status(201).send(role);
    }    
});

router.patch('/revokePrivilege', async (req, res) => {
    const { error } = validatePrivilege(req.body); 
    if (error) return res.status(400).send({ statusCode : 400, error : 'Bad Request' , message : error.message });

    let role = await Role.findOne({ _id : req.body.roleId });
    if(!role) return res.status(404).send({ statusCode : 404, error : 'Not Found' , message : 'Role not found.' });    

    if(!url2.parse(req.body.url)) return res.status(400).send({ statusCode : 400, error : 'Bad Request' , message : 'Please enter valid url.' });

    const getUrlForPrev = req.body.method + url2.parse(req.body.url).pathname;

    if(_.includes(role.privileges,getUrlForPrev )){
        role.privileges.pop(getUrlForPrev);
        //role.updatedBy = req.user._id;
        role = await role.save();    
        return res.status(201).send(role);
    }else{
        return res.status(400).send({ statusCode : 400, error : 'Bad Request' , message : 'This privilege not assigned to role.' });        
    }    
});

module.exports = router;