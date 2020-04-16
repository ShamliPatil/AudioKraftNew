const _ = require('lodash');
const mongoose = require('mongoose');
const { Brand , validate,validateBrandUpadte,validateBrandEnabled,validateBrandimgUrl} =  require('../models/brand');
const  {User} =  require('../models/user');
const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();

router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send({ statusCode : 400, error : 'Bad Request' , message : error.message });

    let brand = await Brand.findOne({ name : req.body.name });
    if(brand) return res.status(400).send({ statusCode : 400, error : 'Bad Request' , message : 'Brand name already added.' });
   
   // if(!brand.enabled) return res.status(401).send({ statusCode : 401, error : 'Unauthorized' , message : 'Brand is disabled. Please contact Admin.' });

    brand = new Brand(_.pick(req.body, [ 'name', 'imgUrl','categories']));
    brand.createdBy = req.user._id;
    brand = await brand.save();
    return res.status(200).send({ statusCode : 200,message : 'Brand Successfuly added.' });
});
router.post('/setImageToBrand', auth, async (req, res) => {
    const { error } = validateBrandimgUrl(req.body); 
    if (error) return res.status(400).send({ statusCode : 400, error : 'Bad Request' , message : error.message });
    const brandId =req.body.brandId;
    //const imgurl =req.body.imgUrl;
     if(!mongoose.Types.ObjectId.isValid(brandId)) return res.status(400).send({statusCode:400,error:'Bad Request',message:'Please provide valid brandId.'}); 
     let brand = await Brand.findOne({imgUrl:req.body.imgUrl });
    if(brand) return res.status(400).send({ statusCode : 400, error : 'Bad Request' , message : 'ImageUrl already exit Under this Brand.' });
    brand = await Brand.findOne({ _id : brandId });
    if(!brand) return res.status(404).send({ statusCode : 404, error : 'Bad Request' , message : 'Brand not found' });
  if(req.body.imgUrl || req.body.imgUrl > 0){
    brand.imgUrl=req.body.imgUrl;
  }else{
    // create new array of string 
    var imgurl = String;
     brand.imgUrl = imgurl
  }
    brand = await brand.save();
    return res.status(200).send({ statusCode : 200,message : 'ImageUrl Successfuly added.' });
});
router.get('/getAllBrands', auth, async (req, res) => {
  let brand = await Brand.find().sort('name').populate('categories','name');
  if(!brand) return res.status(404).send({ statusCode : 404, error : 'Not Found' , message : 'Brands not found.' }); //Not Found
  return res.status(200).send(brand);

});
router.patch('/updateBrandById', auth, async (req, res) => {
    const { error } = validateBrandUpadte(req.body); 
    if (error) return res.status(400).send({ statusCode : 400, error : 'Bad Request' , message : error.message });
    let brand = await Brand.findOne({_id:req.body.brandId});
    if(!brand) return res.status(404).send({ statusCode : 404, error : 'Not Found' , message : 'Brand not found please provide brandId.' });

     if(req.body.name && req.body.name.length > 0 ) brand.name = req.body.name;
     if(req.body.description && req.body.description.length > 0 )  brand.description = req.body.description; 
     if(req.body.imgUrl && req.body.imgUrl.length > 0 ) brand.imgUrl = req.body.imgUrl;
     if(req.body.categories && req.body.categories.length > 0 )  brand.categories = req.body.categories;
     brand.updatedBy = req.user._id;
     brand = await brand.save();
    return res.status(200).send(brand);
});
router.patch('/enabledBrandById', auth, async (req, res) => {
    const { error } = validateBrandEnabled(req.body); 
    if (error) return res.status(400).send({ statusCode : 400, error : 'Bad Request' , message : error.message });
    let brand = await Brand.findOne({_id:req.body.brandId});
    if(!brand) return res.status(404).send({ statusCode : 404, error : 'Not Found' , message : 'User not found please provide userId.' });
    brand.enabled=req.body.enabled;
    brand.updatedBy = req.user._id;
    brand = await brand.save();
    return res.status(200).send(brand);
});
router.delete('/deleteBrandByBrandId', auth, async (req, res) => {
  brandId = req.query.brandId;
  if(!mongoose.Types.ObjectId.isValid(brandId)) return res.status(400).send({statusCode:400,error:'Bad Request',message:'Please provide valid BrandId.'});
  let brand =  await Brand.findByIdAndDelete({ _id :brandId });
  if(!brand) return res.status(404).send({ statusCode : 404, error : 'Not Found' , message : 'Brand not found.' }); //Not Found
  return res.status(200).send({statusCode : 200,message : 'Brand Successfuly delete.' });

});

module.exports = router;