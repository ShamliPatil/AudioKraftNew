const _ = require('lodash');
const { SubCategory , validate,validateSubCategoryEnabled,validateSubCategoryUpdate } =  require('../models/subcategory');
const { Category} =  require('../models/category');
const { Brand} =  require('../models/brand');
const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();

router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send({ statusCode : 400, error : 'Bad Request' , message : error.message });
 //1) check brand exist or not
   const brand = await Brand.findOne({ _id : req.body.brandId }).select('id name');
   if(!brand) return res.status(404).send({ statusCode : 404, error : 'Not Found' , message : 'brandId is not valid.' });
//2)check category exist or not
   const category = await Category.findOne({ _id : req.body.categoryId }).select('id name');
   if(!category) return res.status(404).send({ statusCode : 404, error : 'Not Found' , message : 'categoryId is not valid.' });
  //2) Check this category is exist under brand.
   let subcategory = await SubCategory.findOne({ subcategoryId : req.body.subcategoryId}).select('id name');
   if(subcategory) return res.status(409).send({ statusCode : 409, error : 'Conflict' , message : 'Sub category already exits in this Category.'});

    subcategory = new SubCategory(_.pick(req.body, [ 'name', 'imgUrl', 'description']));
    subcategory.categoryId = category.id;
    subcategory.categoryName = category.name;
    subcategory.brandId = brand.id;
    subcategory.brandName = brand.name;
    subcategory.createdBy = req.user._id;
    subcategory = await subcategory.save();
    return res.status(200).send({ statusCode : 200,message : 'SubCategory Successfuly added.', data : subcategory });
});
//get subcategory by category
 router.get('/getSubCategoriesByCategoryIdAndBrandId', auth, async (req, res) => {
  let subcategory =  await SubCategory.find({$and:[{ categoryId : req.query.categoryId },{ brandId : req.query.brandId }]}).select(['_id','name','imgUrl','categoryName','brandName']).sort('name');
  if(!subcategory) return res.status(404).send({ statusCode : 404, error : 'Not Found' , message : 'subcategory not found.' }); //Not Found
  return res.status(200).send(subcategory);

});

router.get('/getAllSubCategories', auth, async (req, res) => {
  let subcategory = await SubCategory.find().select(['_id','name','imgUrl']).sort('name');
  if(!subcategory) return res.status(404).send({ statusCode : 404, error : 'Not Found' , message : 'Categories not found.' }); //Not Found
  return res.status(200).send(subcategory);

});
router.patch('/updateSubCategoryById', auth, async (req, res) => {
  const { error } = validateSubCategoryUpdate(req.body); 
  if (error) return res.status(400).send({ statusCode : 400, error : 'Bad Request' , message : error.message });
  let subcategory = await SubCategory.findOne({_id:req.body.subcategoryId});
  if(!subcategory) return res.status(404).send({ statusCode : 404, error : 'Not Found' , message : 'Subcategory not found please provide subcategoryId.' });

  if(req.body.name && req.body.name.length > 0 ) subcategory.name = req.body.name;
  if(req.body.description && req.body.description.length > 0 )  subcategory.description = req.body.description; 
  if(req.body.imgUrl && req.body.imgUrl.length > 0 ) subcategory.imgUrl = req.body.imgUrl;
  subcategory = await subcategory.save();
  return res.status(200).send(subcategory);
});
router.patch('/enabledSubCategoryById', auth, async (req, res) => {
const { error } = validateSubCategoryEnabled(req.body); 
if (error) return res.status(400).send({ statusCode : 400, error : 'Bad Request' , message : error.message });
let subcategory = await SubCategory.findOne({_id:req.body.subcategoryId});
if(!subcategory) return res.status(404).send({ statusCode : 404, error : 'Not Found' , message : 'subcategory not found please provide subcategoryId.' });
subcategory.enabled=req.body.enabled;
subcategory.updatedBy = req.user._id;
subcategory = await subcategory.save();
return res.status(200).send(subcategory);
});


module.exports = router;