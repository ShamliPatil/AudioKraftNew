const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const productColorCombinationSchema = new mongoose.Schema({ 
    productId:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref : 'Product'
    },
    productName:{
        type: String,
        required:true,
    },
    companyId:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref : 'Company'
    },
    companyName:{
        type: String,
        required:true,
    },
    companyModelId:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref : 'CompanyModel'
    },
    companyModelName:{
        type: String,
        required:true,
    },
    colorMajor:{
        type: String,
        minlegth : 2,
        maxlength : 30,
        required:true,
    },
    colorMinor:{
        type: String,
         minlegth : 2,
        maxlength : 30,
        required:true,
    },
    initalStock : {
        type : Number,
        require : true,
    },
    imgUrl:{
        type:String,
        required:false
    },
    enabled:{
        type:Boolean,
        required:false,
        default:false
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
const ProductColorCombination = mongoose.model('ProductColorCombination',productColorCombinationSchema);

function validateproductColorCombination(productColorCombination){    
    const schema = Joi.object().keys({
        productId : Joi.objectId().required(),
        companyId : Joi.objectId().required(),
        companyModelId : Joi.objectId().required(),
        colorMajor : Joi.string().min(2).max(30).required(),
        colorMinor : Joi.string().min(2).max(30).required(),
        initalStock : Joi.number().required(),
        imgUrl:Joi.string()
    })
     return { error} = schema.validate(productColorCombination);
    //return Joi.validate(productColorCombination, schema);
}
function validateProductColorCombinationUpdate(productColorCombination){    
    const schema = Joi.object({
        productColorCombinationId:Joi.string().required(),
        productId : Joi.string(),
        companyId : Joi.string(),
        companyModelId : Joi.string(),
        colorMajor : Joi.string().min(2).max(30),
        colorMinor : Joi.string().min(2).max(30),
        initalStock : Joi.number(),
        enabled:Joi.boolean()
    })
     return {error} = schema.validate(productColorCombination);
    //return Joi.validate(company, schema);
}
function validateProductColorimgUrl(product){    
    const schema =Joi.object().keys({
    imgUrl: Joi.string().required(), 
    productColorCombinationId:Joi.string().required()
    })
    return { error} = schema.validate(product);
    //return Joi.validate(brand, schema);
};
module.exports.ProductColorCombination = ProductColorCombination;
module.exports.validate = validateproductColorCombination;
module.exports.validateProductColorCombinationUpdate=validateProductColorCombinationUpdate;
module.exports.validateProductColorimgUrl =validateProductColorimgUrl;