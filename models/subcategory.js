const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const subcategorySchema = new mongoose.Schema({ 
    name : {
        type: String,
        required : true,
        minlength: 2,
        maxlength: 100,
    },
    description : {
        type: String,
        required : false,
        minlength: 2,
        maxlength: 1024,
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
const SubCategory = mongoose.model('SubCategory',subcategorySchema);

function validateSubCategory(subcategory){    
    const schema =Joi.object().keys({
        name : Joi.string().min(2).max(100).required(),
        description : Joi.string().min(2).max(1024),
        categoryId : Joi.objectId().required(),
        brandId : Joi.objectId().required()
        
    })
    return { error} = schema.validate(subcategory);
    //return Joi.validate(subcategory, schema);
}
function validateSubCategoryUpdate(subcategory){    
    const schema = Joi.object({
        name : Joi.string().min(2).max(100),
        imgUrl: Joi.string(),
        description : Joi.string().min(2).max(1024),
        categoryId : Joi.objectId(),
        brandId : Joi.objectId(),
        subcategoryId:Joi.objectId().required()
    })
     return { error} = schema.validate(subcategory);
    //return Joi.validate(category, schema);
}
function validateSubCategoryEnabled(subcategory){    
    const schema =Joi.object().keys({
    enabled : Joi.boolean().required(),
    subcategoryId:Joi.objectId().required()
    })
    return { error} = schema.validate(subcategory);
    //return Joi.validate(brand, schema);
};


module.exports.SubCategory = SubCategory;
module.exports.validate = validateSubCategory;
module.exports.validateSubCategoryUpdate=validateSubCategoryUpdate;
module.exports.validateSubCategoryEnabled=validateSubCategoryEnabled;
