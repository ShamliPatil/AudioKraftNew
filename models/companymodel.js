const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const companymodelSchema = new mongoose.Schema({ 
    companyId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    name:{
        type:String,
        required:true,
        minlegth:2,
        maxlength:30
    },
    description:{
        type:String,
        required:false,
        minlegth:2,
        maxlength:512

    },
    imgUrl:{
        type:String,
        required:false,
        minlegth:2,
        maxlength:100

    },
    order:{
        type:Number,
        required:false,
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

const CompanyModel = mongoose.model('CompanyModel',companymodelSchema);

function validateCompanymodel(companymodel){    
    const schema =Joi.object().keys({
        name : Joi.string().min(2).max(30).required(),
        description : Joi.string().min(2).max(512),
        imgUrl :Joi.string().min(2).max(100),
        order : Joi.number(),
        companyId :Joi.objectId().required()
        
    })
    return { error} = schema.validate(companymodel);
    //return Joi.validate(companymodel, schema);
}


module.exports.CompanyModel = CompanyModel;
module.exports.validate = validateCompanymodel;