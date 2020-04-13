const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const brandSchema = new mongoose.Schema({ 
    name : {
        type: String,
        required : true,
        minlength: 2,
        maxlength: 30,
    },
    description : {
        type: String,
        required : false,
        minlength: 2,
        maxlength: 30,
    },
    imgUrl : {
            type :String,
            required :true
    },
    categories:[{
        type:[mongoose.Schema.Types.ObjectId],
        ref:'Category',
        default:[],
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
const Brand = mongoose.model('Brand',brandSchema);

function validateBrand(brand){    
    const schema =Joi.object().keys({
        name : Joi.string().min(2).max(30).required(),
        imgUrl: Joi.string(),
        categories :Joi.array(),
        description : Joi.string().min(2).max(30)
    })
    return { error} = schema.validate(brand);
    //return Joi.validate(brand, schema);
};
function validateBrandUpadte(brand){    
    const schema =Joi.object().keys({
        name : Joi.string().min(2).max(30),
        imgUrl: Joi.string(),
        categories :Joi.array(),
        description : Joi.string().min(2).max(30),
        brandId:Joi.objectId().required()
    })
    return { error} = schema.validate(brand);
    //return Joi.validate(brand, schema);
};
function validateBrandEnabled(brand){    
    const schema =Joi.object().keys({
    enabled : Joi.boolean().required(),
    brandId:Joi.objectId().required()
    })
    return { error} = schema.validate(brand);
    //return Joi.validate(brand, schema);
};
function validateBrandimgUrl(brand){    
    const schema =Joi.object().keys({
    imgUrl: Joi.string().required(), 
    brandId:Joi.objectId().required()
    })
    return { error} = schema.validate(brand);
    //return Joi.validate(brand, schema);
};



module.exports.Brand = Brand;
module.exports.validate = validateBrand;
module.exports.validateBrandUpadte=validateBrandUpadte;
module.exports.validateBrandEnabled=validateBrandEnabled;
module.exports.validateBrandimgUrl=validateBrandimgUrl;
