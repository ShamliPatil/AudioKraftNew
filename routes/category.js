const _ = require('lodash');
const mongoose = require('mongoose');
const { Category , validate ,validateCategoryUpdate,validateCategoryEnabled,validateCategoryimgUrl} =  require('../models/category');
const { Brand } = require('../models/brand');
const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();

router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send({ statusCode : 400, error : 'Bad Request' , message : error.message });
  //2) Check this category is exist under brand.
    let category = await Category.findOne({name : req.body.name }).select('name');
    if(category) return res.status(409).send({ statusCode : 409, error : 'Conflict' , message : 'category already exits in this brand.'});

    category = new Category(_.pick(req.body, [ 'name', 'imgUrl', 'description']));
    category.createdBy = req.user._id;
    category = await category.save();
    return res.status(200).send({ statusCode : 200,message : 'Category Successfuly added.', data : category });
});

router.post('/setImageToCategory', auth, async (req, res) => {
  const { error } = validateCategoryimgUrl(req.body); 
  if (error) return res.status(400).send({ statusCode : 400, error : 'Bad Request' , message : error.message });
  const categoryId =req.body.categoryId;
  //const imgurl =req.body.imgUrl;
   if(!mongoose.Types.ObjectId.isValid(categoryId)) return res.status(400).send({statusCode:400,error:'Bad Request',message:'Please provide valid categoryId.'}); 
  let category = await Category.findOne({ _id : categoryId });
  if(!category) return res.status(404).send({ statusCode : 404, error : 'Bad Request' , message : 'Category not found' });
 if(category.imgUrl || category.imgUrl.length > 0){
    category.imgUrl=req.body.imgUrl;
  }else{
    // create new array of string 
    var imgurl = String;
     Category.imgUrl = imgurl
  }
  category = await category.save();
  return res.status(200).send({ statusCode : 200,message : 'ImageUrl Successfuly added.' });
});

router.get('/getCategoriesByBrandId', auth, async (req, res) => {
  let brand =  await Brand.findOne({ _id : req.query.brandId }).populate('categories');
  if(!brand) return res.status(404).send({ statusCode : 404, error : 'Not Found' , message : 'Brands not found.' }); //Not Found
  return res.status(200).send(brand);

});
router.patch('/updateCategoryById', auth, async (req, res) => {
    const { error } = validateCategoryUpdate(req.body); 
    if (error) return res.status(400).send({ statusCode : 400, error : 'Bad Request' , message : error.message });
    let category = await Category.findOne({_id:req.body.categoryId});
    if(!category) return res.status(404).send({ statusCode : 404, error : 'Not Found' , message : 'Category not found please provide categoryId.' });

    if(req.body.name && req.body.name.length > 0 ) category.name = req.body.name;
    if(req.body.description && req.body.description.length > 0 )  category.description = req.body.description; 
    if(req.body.imgUrl && req.body.imgUrl.length > 0 ) category.imgUrl = req.body.imgUrl;
    category = await category.save();
    return res.status(200).send(category);
});
router.patch('/enabledCategoryById', auth, async (req, res) => {
  const { error } = validateCategoryEnabled(req.body); 
  if (error) return res.status(400).send({ statusCode : 400, error : 'Bad Request' , message : error.message });
  let category = await Category.findOne({_id:req.body.categoryId});
  if(!category) return res.status(404).send({ statusCode : 404, error : 'Not Found' , message : 'Category not found please provide categoryId.' });
  category.enabled=req.body.enabled;
  category.updatedBy = req.user._id;
  category = await category.save();
  return res.status(200).send(category);
});

module.exports = router;