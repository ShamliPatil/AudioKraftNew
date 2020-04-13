const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
var Schema = mongoose.Schema;

var dealershipSchema = new Schema({
    dealershipName:{
        type:String,
        required:true,
        minlength : 2,
        maxlength : 100
    },
    addresses:[{
        type :[mongoose.Schema.Types.ObjectId],
        required :false,
        ref:'UserAddress',
        default:[]
    }],
    brands:[{
        type:[mongoose.Schema.Types.ObjectId],
        required:true,
        ref:'Brand',
        default:[]
    }],
    contactNo:{
        type:String,
        required:true,
        minlength : 10,
        maxlength : 15
    },
    city:{
         type:String,
        required:false,
        minlength : 2,
        maxlength : 30
    },
    enabled:{
        type:Boolean,
        required:true,
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

const Dealership = mongoose.model('Dealership',dealershipSchema);

function validateDealership(dealership){
    const schema = Joi.object().keys({
        dealershipName : Joi.string().min(2).max(100).trim().required(),
        addresses : Joi.array(),
        brands : Joi.array().required(),
        city : Joi.string().min(2).trim().max(30),
        contactNo:Joi.string().min(10).max(15).required()
       // users:Joi.objectId()

    })
    return { error} = schema.validate(dealership);
}
    function validateDealershipUpdate(dealership){
        const schema = Joi.object().keys({
            dealershipName : Joi.string().min(2).max(100).trim(),
            city : Joi.string().min(2).trim().max(30),
            contactNo:Joi.string().min(10).max(15),
            dealerId:Joi.objectId().required()
           // users:Joi.objectId()
    
        })
   return { error} = schema.validate(dealership);
    //return Joi.validate(dealership, schema);
}
function validateDealerEnabled(dealership){    
    const schema =Joi.object().keys({
    enabled : Joi.boolean().required(),
    dealerId:Joi.objectId().required()
    })
    return { error} = schema.validate(dealership);
    //return Joi.validate(brand, schema);
};

module.exports.Dealership = Dealership;
module.exports.validate = validateDealership;
module.exports.validateDealershipUpdate = validateDealershipUpdate;
module.exports.validateDealerEnabled = validateDealerEnabled;
module.exports.dealershipSchema = dealershipSchema;