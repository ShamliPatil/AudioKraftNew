const jsonvalid = require('../middleware/jsonvalid');
const error = require('../middleware/error');
const auth = require('../routes/auth');
const user = require('../routes/user');
const brand = require('../routes/brand');
const category = require('../routes/category');
const subcategory = require('../routes/subcategory');
const product = require('../routes/product');
const userAddress = require('../routes/useraddress');
const purchaseOrder = require('../routes/purchaseorder');
const company = require('../routes/company');
const companyModel = require('../routes/companymodel');
const productcompanies = require('../routes/productcompanies');
const productcolorcombination = require('../routes/productcolorcombination');
const manageStock = require('../routes/managestock');
const fileupload = require('../routes/file-upload');
const role = require('../routes/role');
const dealer = require('../routes/dealership');


const express = require('express');

module.exports = function(app){ 
    app.use(express.json());
    app.use(jsonvalid);
          
    app.use('/api/auth', auth);
    app.use('/api/registration', user);
    app.use('/api/brand',brand);
    app.use('/api/category',category);
    app.use('/api/userAddress',userAddress);
    app.use('/api/subCategory',subcategory);
    app.use('/api/product',product);
    app.use('/api/purchaseOrder',purchaseOrder);
    app.use('/api/company',company);
    app.use('/api/companyModel',companyModel);
    app.use('/api/produtCompanies',productcompanies);
    app.use('/api/productColorCombination',productcolorcombination);
    app.use('/api/ManageStock',manageStock);
    app.use('/api/file-upload',fileupload);
    app.use('/api/dealer',dealer);
    app.use('/api/roles', role);
    
    app.use(error);
}