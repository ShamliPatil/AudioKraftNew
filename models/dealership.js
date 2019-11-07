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
        required :true,
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
    // users:{
    //     type:[mongoose.Schema.Types.ObjectId],
    //     required:false
    // },
    city:{
         type:String,
        required:true,
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
        addresses : Joi.array().required(),
        brands : Joi.array().required(),
        city : Joi.string().min(2).trim().max(30).required(),
        contactNo:Joi.string().min(10).max(15).required()
       // users:Joi.objectId()

    })
}
    function validateDealershipUpdate(dealership){
        const schema = Joi.object().keys({
            dealershipName : Joi.string().min(2).max(100).trim().required(),
            city : Joi.string().min(2).trim().max(30).required(),
            contactNo:Joi.string().min(10).max(15).required()
           // users:Joi.objectId()
    
        })
   return { error} = schema.validate(dealership);
    //return Joi.validate(dealership, schema);
}

module.exports.Dealership = Dealership;
module.exports.validate = validateDealership;
module.exports.validateDealershipUpdate = validateDealershipUpdate;
module.exports.dealershipSchema = dealershipSchema;