const _ = require('lodash');
const mongoose = require('mongoose');
const { UserAddress , validate,validateUserAddressUpdate }=require('../models/useraddress');
const{User} =  require('../models/user');
const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();

router.post('/', auth, async (req, res) => {
    const {error} = validate(req.body); 
    if (error) return res.status(400).send({ statusCode : 400, error : 'Bad Request' , message : error.message });
    // let address = await UserAddress.findOne({ addressId : req.body.id }).select(['_id','pincode','buildingName']);
    // if(address) return res.status(400).send({ statusCode : 400, error : 'Bad Request' , message : 'Address name already added.' });

    address = new UserAddress(_.pick(req.body, [ 'dealerId', 'dealerName','pincode','buildingName','area','city','state','landmark','addressTitle','contactNo']));
    address.createdBy = req.user._id;
    address = await address.save();
    return res.status(200).send({ statusCode : 200,message : 'Address Successfuly added.' });
});

router.get('/getAllUsersAddressByDealerId', auth, async (req, res) => {
  let address = await UserAddress.find({dealerId : req.query.dealerId}).select(['_id', 'dealerId', 'dealerName','pincode','buildingName','area','city','state','landmark','addressTitle','contactNo']).sort('name');
  if(!address) return res.status(404).send({ statusCode : 404, error : 'Not Found' , message : 'Brands not found.' }); //Not Found
  const user =await User.findOne({_id:req.user.id}).populate('defaultAddress');
  //return res.status(200).send(address);
  return res.status(200).send({addresses:address,defaultAddress:user.defaultAddress})
});
// router.get('/getAllUsersAddressWithDefaultAddressByDealerId', auth, async (req, res) => {
//   let address = await UserAddress.find({dealerId : req.query.dealerId}).select(['_id', 'dealerId', 'dealerName','pincode','buildingName','area','city','state','landmark','addressTitle','contactNo']).sort('name');
//   if(!address) return res.status(404).send({ statusCode : 404, error : 'Not Found' , message : 'Address not found.' }); //Not Found
//   const user =await User.findOne({_id:req.user.id}).populate('defaultAddress');
//   return res.status(200).send({addresses:address,defaultAddress:user.defaultAddress});

// });
router.get('/getUsersAddressByAddressId', auth, async (req, res) => {
  addressId = req.query.addressId;
  let address =  await UserAddress.findOne({ _id :addressId }).select(['_id', 'dealerId', 'dealerName','pincode','buildingName','area','city','state','landmark','addressTitle','contactNo']).sort('name');
  if(!mongoose.Types.ObjectId.isValid(addressId)) return res.status(400).send({statusCode:400,error:'Bad Request',message:'Please provide valid dealerId.'});
  if(!address) return res.status(404).send({ statusCode : 404, error : 'Not Found' , message : 'Address not found.' }); //Not Found
  return res.status(200).send(address);

});

router.patch('/submitUserAddress', auth, async (req, res) => {
    const { error } = validateUserAddressUpdate(req.body); 
    if (error) return res.status(400).send({ statusCode : 400, error : 'Bad Request' , message : error.message });
    let address = await UserAddress.findOne({_id:req.body.addressId});
    if(!address) return res.status(404).send({ statusCode : 404, error : 'Not Found' , message : 'Address details not found please check dealerId.' });

    if(req.body.pincode && req.body.pincode.length > 0 ) address.pincode = req.body.pincode;
    if(req.body.buildingName && req.body.buildingName.length > 0 )  address.buildingName = req.body.buildingName; 
    if(req.body.area && req.body.area.length > 0 ) address.area = req.body.area;
    if(req.body.city && req.body.city.length > 0 )  address.city = req.body.city;
    if(req.body.state && req.body.state.length > 0 )  address.state = req.body.state;
    if(req.body.landmark && req.body.landmark.length > 0 ) address.landmark = req.body.landmark;
    if(req.body.addressTitle && req.body.addressTitle.length > 0 )  address.addressTitle = req.body.addressTitle;
    if(req.body.contactNo && req.body.landmark.contactNo > 0 ) address.contactNo = req.body.contactNo;
    address.updatedBy = req.user.id;
    address = await address.save();
    return res.status(200).send({statusCode : 200,message : 'Address Successfuly updated.' });
});
router.delete('/deleteUsersAddressByAddressId', auth, async (req, res) => {
  addressId = req.query.addressId;
  if(!mongoose.Types.ObjectId.isValid(addressId)) return res.status(400).send({statusCode:400,error:'Bad Request',message:'Please provide valid addressId.'});
  let address =  await UserAddress.findByIdAndDelete({ _id :addressId });
  if(!address) return res.status(404).send({ statusCode : 404, error : 'Not Found' , message : 'Address not found.' }); //Not Found
  return res.status(200).send({statusCode : 200,message : 'Address Successfuly delete.' });

});

module.exports = router;