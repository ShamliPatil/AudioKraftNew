const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
var Schema = mongoose.Schema;

var dealershipSchema = new Schema({
    dealershipName:{
        type:String,
        required:true,
        minlength : 2,
        maxlength : 30
    },
    addresses:{
        type :[mongoose.Schema.Types.ObjectId],
        required :true,
        default:[]
    },
    brands:{
        type:[mongoose.Schema.Types.ObjectId],
        required:true,
        default:[]
    },
    contactNo:{
        type:Number,
        required:true,
        minlength : 10,
        maxlength : 15
    },
    users:{
        type:[mongoose.Schema.Types.ObjectId],
        required:false
    },
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

const Dealership = mongoose.model('User',dealershipSchema);

function validateDealership(dealership){
    const schema = Joi.object().keys({
        imei : Joi.string().min(10).max(20).trim().required(),
        firstName : Joi.string().min(2).max(100).trim().required(),
        lastName : Joi.string().min(2).max(100).trim().required(),
        email : Joi.string().min(2).trim().max(30).email().required(),
        password : Joi.string().min(5).trim().max(30).required(),
        dealerName:Joi.string().min(3).trim().max(30).required(),
        city : Joi.string().required()

    })
   return { error} = schema.validate(dealership);
    //return Joi.validate(dealership, schema);
}

module.exports.Dealership = Dealership;
module.exports.validate = validateDealership;
module.exports.dealershipSchema = dealershipSchema;