const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);
const{specificationSchema} = require('../models/specification');

const productSchema = new mongoose.Schema({ 
    name : {
        type: String,
        required : true,
        minlength: 2,
        maxlength: 30,
    },
    imgUrl : {
            type :[String],
            required :true
    },
    description : {
        type: String,
        required : false,
        minlength: 2,
        maxlength: 1024,
    },
    subcategoryName:{
        type: String,
        required : true,
    },
    subcategoryId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCategory',
        required : true,
    },
     categoryName:{
        type: String,
        required : true,
    },
    categoryId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required : true,
    },
    brandName:{
        type: String,
        required : true,
    },
    brandId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand',
        required : true,
    },
    price : {
        type: Number,
        required : true,
        default : 0
    },
    dealerPrice : {
        type: Number,
        required : true,
        default : 0
    },
    quantity : {
        type: Number,
        required : true,
        default : 0
    },
    colors:{
        type:[String],
        required:true
    },
    isCustomizable:{
        type:Boolean,
        required:true,
        default:false
    },
    specifications:[{
        type:specificationSchema,
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
const Product = mongoose.model('Product',productSchema);

function validateProduct(product){    
    const schema = Joi.object().keys({
        name : Joi.string().min(2).max(30).required(),
        description : Joi.string().min(2).max(1024),
        subcategoryId : Joi.objectId().required(),
        categoryId : Joi.objectId().required(),
        brandId : Joi.objectId().required(),
        imgUrl : Joi.array().required(),
        price : Joi.number().required(),
        dealerPrice : Joi.number().required(),
        quantity :Joi.number().required(),
        isCustomizable : Joi.boolean().required(),
        colors : Joi.array().required(),
        specifications: Joi.array().required()
    })
    return { error} = schema.validate(product);
    //return Joi.validate(product, schema);
}
function validateUpadetProductSpefication(product){    
    const schema = Joi.object().keys({
        productId : Joi.objectId().required(),
        specifications: Joi.array().required()
    })
    return { error} = schema.validate(product);
    //return Joi.validate(product, schema);
}
function validateUpadetProductData(product){    
    const schema = Joi.object().keys({
       keyId : Joi.objectId().required(),
       key:Joi.string().min(2).max(100).required(),
       value:Joi.string().min(2).max(100).required()
    })
    return { error} = schema.validate(product);
    //return Joi.validate(product, schema);
}
function validateProductimgUrl(product){    
    const schema =Joi.object().keys({
    imgUrl: Joi.string().required(), 
    productId:Joi.objectId().required()
    })
    return { error} = schema.validate(product);
    //return Joi.validate(brand, schema);
};



module.exports.Product = Product;
module.exports.validate = validateProduct;
module.exports.validateUpadetProductSpefication=validateUpadetProductSpefication;
module.exports.validateUpadetProductData = validateUpadetProductData;
module.exports.validateProductimgUrl= validateProductimgUrl;
module.exports.productSchema=productSchema;
