const _ = require('lodash');
const { CompanyModel } = require('../models/companymodel');
const { ProductColorCombination ,validate ,validateProductColorCombinationUpdate, validateProductColorimgUrl} = require('../models/productcolorcombination');
const { Company } =  require('../models/company');
const { Product } = require('../models/product');
const auth = require('../middleware/auth');
const express = require('express');
const mongoose = require('mongoose'); 
const router = express.Router();

router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send({ statusCode : 400, error : 'Bad Request.' , message : error.message });
    
    //1 get product by id 
    const product = await Product.findOne({ _id : req.body.productId }).select('id name');
    if(!product) return res.status(404).send({ statusCode : 404, error : 'Not Found.' , message : 'Product not found.' }); 

    const company = await Company.findOne({ _id : req.body.companyId }).select('id name');
    if(!company) return res.status(404).send({ statusCode : 404, error : 'Not Found.' , message : 'Company not found.' });

    const companyModel = await CompanyModel.findOne({ _id : req.body.companyModelId });
    if(!companyModel) return res.status(404).send({ statusCode : 404, error : 'Not Found.' , message : 'Company Model name already added.' });
   
    let productColorCombination = await ProductColorCombination.findOne({ productId : product.id, companyId : company._id, companyModelId : companyModel._id, colorMajor : req.body.colorMajor, colorMinor : req.body.colorMinor});
    if(productColorCombination) return res.status(409).send({ statusCode : 409, error : 'Conflict.' , message : 'This color combination for this model already exist.' });

   // if(!brand.enabled) return res.status(401).send({ statusCode : 401, error : 'Unauthorized' , message : 'Brand is disabled. Please contact Admin.' });

    productColorCombination = new ProductColorCombination();
    productColorCombination.productId = product.id;
    productColorCombination.productName = product.name;
    productColorCombination.companyId = company.id;
    productColorCombination.companyName = company.name;
    productColorCombination.companyModelId = companyModel.id;
    productColorCombination.companyModelName = companyModel.name;
    productColorCombination.colorMajor = req.body.colorMajor;
    productColorCombination.colorMinor = req.body.colorMinor;
    productColorCombination.initalStock = req.body.initalStock;
    productColorCombination.imgUrl = req.body.imgUrl;
    productColorCombination.createdBy = req.user._id;
    productColorCombination = await productColorCombination.save();
    return res.status(200).send({ statusCode : 200,message : 'CompanyModel Successfuly added.', data : productColorCombination  });
});

router.post('/setImageProductColorCombination', auth,async (req, res) => {
  const { error } = validateProductColorimgUrl(req.body); 
  if (error) return res.status(400).send({ statusCode : 400, error : 'Bad Request' , message : error.message });
  const productColorCombinationId =req.body.productColorCombinationId;
  //const imgurl =req.body.imgUrl;
   if(!mongoose.Types.ObjectId.isValid(productColorCombinationId)) return res.status(400).send({statusCode:400,error:'Bad Request',message:'Please provide valid productColorCombinationId.'}); 
  let productColorCombination = await ProductColorCombination.findOne({ _id : productColorCombinationId });
  if(!productColorCombination) return res.status(404).send({ statusCode : 404, error : 'Bad Request' , message : 'ProductColorCombination not found' });;
  if(productColorCombination.imgUrl || productColorCombination.imgUrl== undefined){
    productColorCombination.imgUrl=req.body.imgUrl;
  }else{
    // create new array of string 
    var imgurl = String;
    productColorCombination.imgUrl = imgUrl;
  }
  productColorCombination = await productColorCombination.save();
  return res.status(200).send({ statusCode : 200,message : 'ImageUrl Successfuly added.' });
});

router.get('/getProductColorCombination', auth, async (req, res) => {
  const pageNo= parseInt(req.query.pageNo);
  const size = parseInt(req.query.size);
  const companyModelId = req.query.companyModelId;
  const productId = req.query.productId;

    if(pageNo < 0 ||pageNo === 0 ||size < 0 ||size === 0 || (isNaN(pageNo)) || (isNaN(size)) )return res.status(400).send("Invalid page number or Invalid size.");
    if(!mongoose.Types.ObjectId.isValid(companyModelId)) return res.status(400).send({statusCode:400,error:'Bad Request',message:'Please provide valid company model id.'}); 
    if(!mongoose.Types.ObjectId.isValid(productId)) return res.status(400).send({statusCode:400,error:'Bad Request',message:'Please provide valid product id.'}); 

  // find product color combinations from company id , company model id and product id
    const companyModel = await CompanyModel.findOne({ _id : companyModelId });
    if(!companyModel) return res.status(404).send({ statusCode : 404, error : 'Not Found.' , message : 'Company Model name not found'  });
    const productColorCombination = await ProductColorCombination.find({productId : productId, companyId : companyModel.companyId, companyModelId : companyModel.id }).skip(size*(pageNo - 1)).limit(size);;
    if(!productColorCombination || productColorCombination.length == 0)return res.status(404).send({ statusCode : 404, error : 'Not Found' , message : 'Products color combination not found.' });
    return res.status(200).send({ statusCode : 200, data : productColorCombination  });
});

router.get('/getAllProductColorCombination',auth,async (req, res) => {
  let productColorCombination = await ProductColorCombination.find().sort({'createdAt':-1});
  if(!productColorCombination) return res.status(404).send({ statusCode : 404, error : 'Not Found' , message : 'ProductColorCombination not found.' }); //Not Found
  return res.status(200).send(productColorCombination);

});
router.patch('/updateProductColorCombinationOrEnabledStatusById',auth, async (req, res) => {
  const { error } = validateProductColorCombinationUpdate(req.body); 
  if (error) return res.status(400).send({ statusCode : 400, error : 'Bad Request' , message : error.message });
  let productColorCombination = await ProductColorCombination.findOne({_id:req.body.productColorCombinationId});
  if(!productColorCombination) return res.status(404).send({ statusCode : 404, error : 'Not Found' , message : 'ProductColorCombination not found please provide.' });

  if(req.body.productId && req.body.productId.length > 0 ){
    productColorCombination.productId = req.body.productId;
    const product = await Product.findOne({ _id : req.body.productId }).select('id name');
    productColorCombination.productName = product.name;
  } 
  if(req.body.companyId && req.body.companyId.length > 0 ){
    productColorCombination.companyId = req.body.companyId;
    const company = await Company.findOne({ _id : req.body.companyId }).select('id name');
    productColorCombination.companyName = company.name;

  } 
  if(req.body.companyModelId && req.body.companyModelId.length > 0 ){
    productColorCombination.companyModelId = req.body.companyModelId;
    const companyModel = await CompanyModel.findOne({ _id : req.body.companyModelId });
    productColorCombination.companyModelName =companyModel.name;

  } 
  if(req.body.colorMajor && req.body.colorMajor.length > 0 ) productColorCombination.colorMajor = req.body.colorMajor;
  if(req.body.colorMinor && req.body.colorMinor.length > 0 ) productColorCombination.colorMinor = req.body.colorMinor;
  if(req.body.initalStock) productColorCombination.initalStock = req.body.initalStock;
  if(req.body.enabled == undefined){
    productColorCombination.enabled = productColorCombination.enabled
  }else{
    productColorCombination.enabled = req.body.enabled;
  } 
  productColorCombination = await productColorCombination.save();
  return res.status(200).send(productColorCombination);
});

router.delete('/deleteProductColorCombinationById',auth,async (req, res) => {
productColorCombinationId = req.query.productColorCombinationId;
if(!mongoose.Types.ObjectId.isValid(productColorCombinationId)) return res.status(400).send({statusCode:400,error:'Bad Request',message:'Please provide valid companyId.'});
let productColorCombination =  await ProductColorCombination.findByIdAndDelete({ _id :productColorCombinationId });
if(!productColorCombination) return res.status(404).send({ statusCode : 404, error : 'Not Found' , message : 'ProductColorCombination not found.' }); //Not Found
return res.status(200).send({statusCode : 200,message : 'ProductColorCombination Successfuly delete.' });

});


module.exports = router;