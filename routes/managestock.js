const _ = require('lodash');
const { CompanyModel } = require('../models/companymodel');
const { ProductColorCombination} = require('../models/productcolorcombination');
const { Company } =  require('../models/company');
const { Product } = require('../models/product');
const {ManageStock, validate} = require('../models/managestock');
const auth = require('../middleware/auth');
const express = require('express');
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
   
    let managestock = await ManageStock.findOne({ productId : product.id, companyId : company._id, companyModelId : companyModel._id, colorMajor : req.body.colorMajor, colorMinor : req.body.colorMinor});

    try{
    managestock = new ManageStock();
    managestock.productId = product.id;
    managestock.productName = product.name;
    managestock.companyId = company.id;
    managestock.companyName = company.name;
    managestock.companyModelId = companyModel.id;
    managestock.companyModelName = companyModel.name;
    managestock.colorMajor = req.body.colorMajor;
    managestock.colorMinor = req.body.colorMinor;
    managestock.addStock = req.body.addStock;
    managestock.vendorName = req.body.vendorName;
    managestock.inVoiceNo = req.body.inVoiceNo;
    managestock.productColorCombinationId = req.body.productColorCombinationId;
    managestock.createdBy = req.user._id;
    managestock = await managestock.save();
    //managestock = await managestock.save();
    //return res.status(200).send({ statusCode : 200,message : 'CompanyModel Successfuly added.', data : managestock  });

let productColorCombination = await ProductColorCombination.findOne({ _id :req.body.productColorCombinationId});
if(!productColorCombination) return res.status(404).send({ statusCode : 409, error : 'Not Found.' , message : 'ProductColorCombination not found.' });
productColorCombination.initalStock += managestock.addStock;
productColorCombination = await productColorCombination.save();

}catch(ex){
    if(managestock._id && productColorCombinationId){
        let managestock = ManageStock.delete({_id:managestock._id});
    }
}
return res.status(200).send({ statusCode : 200,message : 'CompanyModel Successfuly added.', data : managestock  });

});

module.exports = router;
