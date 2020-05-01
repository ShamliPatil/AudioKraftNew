const _ = require('lodash');
const { ProductCompanies , validate, validateProductCompany } =  require('../models/productcompanies');
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
  // let productcompanies = await ProductCompanies.findOne({ productId : product._id, name : req.body.name }).select(' id name');
  // if(productcompanies) return res.status(409).send({ statusCode : 409, error : 'Conflict' , message : 'productcompanies already exits.'});

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
        let productcompanies = await ProductCompanies.findOne({ 'companies.companyId' : companies[i].companyId }).select(' id name');
        if(productcompanies) return res.status(409).send({ statusCode : 409, error : 'Conflict' , message : 'Company already exits for this product.'});
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
  let productcompanies =  await ProductCompanies.find({ productId : productId});
  if(!productcompanies) return res.status(404).send({ statusCode : 404, error : 'Not Found' , message : 'productcompanies not found.' }); //Not Found
  return res.status(200).send(productcompanies);

});
router.get('/getAllProductCompanies',auth,async (req, res) => {
  let productcompanies =  await ProductCompanies.find();
  //let category = await Category.find().select(['_id','name','imgUrl']).sort('name');
  if(!productcompanies) return res.status(404).send({ statusCode : 404, error : 'Not Found' , message : 'productcompanies not found.' }); //Not Found
  return res.status(200).send(productcompanies);

});
router.patch('/updateProductCompnayOrEnabledStatusById',async (req, res) => {
  const { error } = validateProductCompany(req.body); 
  if (error) return res.status(400).send({ statusCode : 400, error : 'Bad Request' , message : error.message });
  let productcompanies = await ProductCompanies.findOne({_id:req.body.productCompanyId});
  if(!productcompanies) return res.status(404).send({ statusCode : 404, error : 'Not Found' , message : 'ProductCompany not found please provide.' });
  if(req.body.productId && req.body.productId.length > 0 ){
    const product = await Product.findOne({_id:req.body.productId }).select('id name');
    productcompanies.productId = req.body.productId;
    productcompanies.productName = product.name;
  }
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
    productcompanies.companies = companyfinalArray;

   productcompanies.enabled = req.body.enabled;
   //productcompanies.updatedBy = req.user.id;
   productcompanies = await productcompanies.save();
  return res.status(200).send(productcompanies);
});

router.delete('/deleteProductCompanyById',async (req, res) => {
productCompanyId = req.query.productCompanyId;
if(!mongoose.Types.ObjectId.isValid(productCompanyId)) return res.status(400).send({statusCode:400,error:'Bad Request',message:'Please provide valid companyId.'});
let productcompany =  await ProductCompanies.findByIdAndDelete({ _id :productCompanyId });
if(!productcompany) return res.status(404).send({ statusCode : 404, error : 'Not Found' , message : 'ProductCompany not found.' }); //Not Found
return res.status(200).send({statusCode : 200,message : 'Productcompany Successfuly delete.' });

});


module.exports = router;