const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const companySchema = new mongoose.Schema({ 
    name:{
        type:String,
        required:true,
        minlegth:2,
        maxlength:50
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
const Company = mongoose.model('Company',companySchema);

function validateCompany(company){    
    const schema = Joi.object({
        name : Joi.string().min(2).max(50).required(),
        description : Joi.string().min(2).max(512),
        imgUrl :Joi.string().min(2).max(100),
        order : Joi.number()
    })
     return {error} = schema.validate(company);
    //return Joi.validate(company, schema);
}
function validateCompanyUpdate(company){    
    const schema = Joi.object({
        companyId: Joi.string().required(),
        name : Joi.string().min(2).max(50),
        enabled:Joi.boolean()
    })
     return {error} = schema.validate(company);
    //return Joi.validate(company, schema);
}



module.exports.Company = Company;
module.exports.validate = validateCompany;
module.exports.validateCompanyUpdate =validateCompanyUpdate;