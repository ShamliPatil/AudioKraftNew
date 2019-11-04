const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const productCompaniesInnerSchema = new mongoose.Schema({ 
    companyId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'company',
        required : true
    },
    companyName:{
        type:String,
        required:true,
         minlength: 2,
         maxlength: 50
    },
    companyModels:[ {
        companyModelId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'CompanyModel',
        required : true
    },
    companyModelName:{
        type:String,
        required:true,
         minlength: 2,
         maxlength: 50
    }
    },{ _id : false }]

},{ _id : false });

const productcompaniesSchema = new mongoose.Schema({ 
    productId : {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Product',
        required : true,
    },
    productName : {
        type: String,
        required : true,
        minlength: 1,
        maxlength: 50,
    },
   companies:[{
       type: productCompaniesInnerSchema,
       required:true
   }],
   
    enabled:{
        type:Boolean,
        required:true,
        default:true
    },
    createdBy : {
        type : mongoose.Schema.Types.ObjectId,
        required : false
    },
    updatedBy : {
        type : mongoose.Schema.Types.ObjectId,
        required : false
    }
},{ timestamps: true });
const ProductCompanies = mongoose.model('ProductCompanies',productcompaniesSchema);

function validateproductCompanies(productcompanies){    
    const schema = Joi.object().keys({
        productId : Joi.objectId().required(),
        companies : Joi.array().required()
       
    })
   return { error} = schema.validate(productcompanies);
}


module.exports.ProductCompanies = ProductCompanies;
module.exports.validate = validateproductCompanies;
