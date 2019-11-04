const _ = require('lodash');
const { Dealership , validate } = require('../models/dealership');
const  {User} =  require('../models/user'); 
const { Brand } = require('../models/brand');
const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();

router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send({ statusCode : 400, error : 'Bad Request' , message : error.message });
 //1) check user exist or not
    const dealershipName = await User.findOne({ dealershipName : req.body.dealershipName }).select('dealershipName');
    if(!dealershipName) return res.status(404).send({ statusCode : 404, error : 'Not Found' , message : 'DealershipName already exit.' });


    dealership = new Dealership(_.pick(req.body, [ 'dealershipName', 'addresses', 'brands','contactNo','users']));
    //product.specifications = req.body.specifications;
    dealership.createdBy = req.user._id;
    dealership = await dealership.save();
    return res.status(200).send({ statusCode : 200,message : 'DealerShip Successfuly added.', data : product });
});

module.exports = router;