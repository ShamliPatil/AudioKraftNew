const _ = require('lodash');
const { Dealership , validate ,validateDealershipUpdate} = require('../models/dealership');
const  {User} =  require('../models/user'); 
const { Brand } = require('../models/brand');
const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();

router.post('/createDelaer', auth, async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send({ statusCode : 400, error : 'Bad Request' , message : error.message });
 //1) check user exist or not
    let dealer = await Dealership.findOne({ dealershipName : req.body.dealershipName }).select('dealershipName');
    if(dealer) return res.status(404).send({ statusCode : 404, error : 'Not Found' , message : 'Dealership already exit.' });
    dealer = new Dealership(_.pick(req.body, [ 'dealershipName', 'addresses', 'brands','contactNo','city']));
    dealer.createdBy = req.user._id;
    dealer = await dealer.save();
    return res.status(200).send({ statusCode : 200,message : 'DealerShip Successfuly added.', data : dealer });
});
router.get('/getAllDealers', auth, async (req, res) => {
    let dealer = await Dealership.find().populate('brands addresses').sort('name');
    if(!dealer) return res.status(404).send({ statusCode : 404, error : 'Not Found' , message : 'Dealers not found.' }); //Not Found
    return res.status(200).send(dealer);
  
  });
  router.patch('/updateDealerById', auth, async (req, res) => {
    const { error } = validateDealershipUpdate(req.body); 
    if (error) return res.status(400).send({ statusCode : 400, error : 'Bad Request' , message : error.message });
    let dealer = await Dealership.findOne({_id:req.body.dealerId});
    if(!dealer) return res.status(404).send({ statusCode : 404, error : 'Not Found' , message : 'Brand not found please provide brandId.' });
        if(req.body.dealershipName && req.body.dealershipName.length > 0 ) dealer.dealershipName = req.body.dealershipName;
        if(req.body.city && req.body.city.length > 0 )  dealer.city = req.body.city; 
        if(req.body.contactNo && req.body.contactNo.length > 0 ) dealer.contactNo = req.body.contactNo;
        dealer.updatedBy = req.user._id;
        dealer = await dealer.save();
        return res.status(200).send(dealer);
});
module.exports = router;