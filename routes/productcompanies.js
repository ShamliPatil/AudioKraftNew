const _ = require('lodash');
const { ProductCompanies , validate } =  require('../models/productcompanies');
const { Product } = require('../models/product');
const { Company } = require('../models/company');
const { CompanyModel } = require('../models/companymodel');
const auth = require('../middleware/auth');
const express = require('express');
const mongoose = require('mongoose'); 
const router = express.Router();

router.post('/new', auth, async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send({ statusCode : 400, error : 'Bad Request' , message : error.message });

 //1) check brand exist or not
    const product = await Product.findOne({ _id : req.body.productId }).select('id name');
    if(!product) return res.status(404).send({ statusCode : 404, error : 'Not Found' , message : 'productId is not valid.' });
  //2) Check this comapny is exist under productId.
  let productcompanies = await ProductCompanies.findOne({ productId : product._id, name : req.body.name }).select(' id name');
   if(productcompanies) return res.status(409).send({ statusCode : 409, error : 'Conflict' , message : 'productcompanies already exits.'});

    productcompanies = new ProductCompanies();
    productcompanies.productId = product.id;
    productcompanies.productName = product.name;

    var companyfinalArray = [];
    var companies = req.body.companies;

    for (var i = 0 ; i < companies.length ; i++) {
      // get company first
        let companyObject = {};
        let companyModelsArray = [];
        const company = await Company.findOne({ _id : companies[i].companyId }).select('id name');
        if(!company) return res.status(404).send({ statusCode : 404, error : 'Not Found' , message : companies[i].companyId +  ' company not found.' });
        companyObject.companyId = company.id;
        companyObject.companyName = company.name;

        for(var j = 0 ; j < companies[i].companyModels.length ; j++) {
            // get company models for that company
          var tempCompanyObject = {};
          const companyModel = await CompanyModel.findOne({ _id : companies[i].companyModels[j].companyModelId }).select('id name companyId');
          if(!companyModel) return res.status(404).send({ statusCode : 404, error : 'Not Found' , message : companies[i].companyModels[j] +  ' company model not found.' });
          //check company model is belong to that company
          if(company.id.toString() != companyModel.companyId.toString()) return res.status(400).send({ statusCode : 400, error : 'Bad Request' , message : 'This model is not belong for ths company.' }); 
          tempCompanyObject.companyModelId = companyModel.id;
          tempCompanyObject.companyModelName = companyModel.name;
          companyModelsArray.push(tempCompanyObject);
        }
        companyObject.companyModels = companyModelsArray; 
        companyfinalArray.push(companyObject);
    } 
    productcompanies.productId = product.id;
    productcompanies.productName = product.name;
    productcompanies.companies = companyfinalArray;

    productcompanies.createdBy = req.user._id;
    productcompanies = await productcompanies.save();
    return res.status(200).send({ statusCode : 200,message : 'Category Successfuly added.', data : productcompanies });
});

router.get('/getProductCompaniesByProductId', auth, async (req, res) => {
  const productId = req.query.productId;
  if(!mongoose.Types.ObjectId.isValid(productId)) return res.status(400).send({statusCode:400,error:'Bad Request',message:'Please provide valid productId'}); 
  if(!productId || productId.length == 0)return res.status(400).send({ statusCode : 400, error : 'Bad Request' , message : 'Please provide productId.' });
  let productcompanies =  await ProductCompanies.findOne({ productId : productId}).populate('categories');
  if(!productcompanies) return res.status(404).send({ statusCode : 404, error : 'Not Found' , message : 'productcompanies not found.' }); //Not Found
  return res.status(200).send(productcompanies);

});
// router.get('/getAllProductCompaniesByProductId', auth, async (req, res) => {
//   const productId = req.query.productId;
//   if(!mongoose.Types.ObjectId.isValid(productId)) return res.status(400).send({statusCode:400,error:'Bad Request',message:'Please provide valid productId'}); 
//   if(!productId || productId.length == 0)return res.status(400).send({ statusCode : 400, error : 'Bad Request' , message : 'Please provide productId.' });
//   let productcompanies =  await ProductCompanies.find({ productId : productId }).select(['productId','productName','companies']);
//   //let category = await Category.find().select(['_id','name','imgUrl']).sort('name');
//   if(!productcompanies) return res.status(404).send({ statusCode : 404, error : 'Not Found' , message : 'productcompanies not found.' }); //Not Found
//   return res.status(200).send(productcompanies);

// });

module.exports = router;