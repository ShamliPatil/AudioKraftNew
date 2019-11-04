const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const categorySchema = new mongoose.Schema({ 
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
    imgUrl : {
            type :String,
            required :true
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
const Category = mongoose.model('Category',categorySchema);

function validateCategory(category){    
    const schema = Joi.object({
        name : Joi.string().min(2).max(100).required(),
        imgUrl: Joi.string().required(),
        description : Joi.string().min(2).max(1024)
    })
     return { error} = schema.validate(category);
    //return Joi.validate(category, schema);
}
function validateCategoryUpdate(category){    
    const schema = Joi.object({
        name : Joi.string().min(2).max(100),
        imgUrl: Joi.string(),
        description : Joi.string().min(2).max(1024),
        categoryId:Joi.objectId().required()
    })
     return { error} = schema.validate(category);
    //return Joi.validate(category, schema);
}
function validateCategoryEnabled(category){    
    const schema =Joi.object().keys({
    enabled : Joi.boolean().required(),
    categoryId:Joi.objectId().required()
    })
    return { error} = schema.validate(category);
};
function validateCategoryimgUrl(category){    
    const schema =Joi.object().keys({
    imgUrl: Joi.string().required(), 
    categoryId:Joi.objectId().required()
    })
    return { error} = schema.validate(category);
};


module.exports.Category = Category;
module.exports.validate = validateCategory;
module.exports.validateCategoryUpdate=validateCategoryUpdate;
module.exports.validateCategoryEnabled=validateCategoryEnabled;
module.exports.validateCategoryimgUrl=validateCategoryimgUrl;
