var mongoose = require('mongoose');
var userType = require('../constants/constantsusertypes');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);
var Schema = mongoose.Schema;

var userSchema = new Schema({
    imei:{
        type: String,
        required : false,
        minlength: 10,
        maxlength: 20,
    },
    firstName:{
        type:String,
        required:true,
        minlength : 2,
        maxlength : 30
    },
    lastName:{
        type:String,
        required:true,
        minlength : 2,
        maxlength : 30
    },
    city:{
        type:String,
        minlength : 2,
        maxlength : 30,
        required:false
    },
    dealership:{
       type:String,
       minlength : 2,
       maxlength : 30,
       required:false
    },
    assignDealer:{
       type:mongoose.Schema.Types.ObjectId,
       ref:'Dealership',
       required:false
    },
    userName:{
        type:String,
        required:false,
        minlength : 2,
        maxlength : 30
    },
    reference:{
        type:String,
        required:false,
        minlength : 2,
        maxlength : 30
    },
    email:{
        type:String,
        required:false,
        minlength : 10,
        maxlength : 30
    },
    password:{
        type:String,
        required:true,
        minlength : 5,
        maxlength : 100
    },
    contactNo:{
        type:Number,
        required:false,
        minlength : 10,
        maxlength : 15
    },
    defaultAddress:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'UserAddress',
        required:false
    },
    isApproved:{
        type:Boolean,
        required:true,
        default:false
    },
    userType:{
        type:String,
        required:false,
    },
    role:{
        type:[String],
        required:true
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

const User = mongoose.model('User',userSchema);

 function validateUserForDealer(dealerUser){
    const schema =Joi.object().keys({
        imei : Joi.string().min(10).max(20).trim().required(),
        firstName : Joi.string().min(2).max(30).trim().required(),
        lastName : Joi.string().min(2).max(30).trim().required(),
        email : Joi.string().min(10).trim().max(255).email().required(),
        password : Joi.string().min(5).trim().max(100).required(),
        dealership : Joi.string().min(2).trim().max(30).required(),
        assignDealer: Joi.objectId(),
        city : Joi.string().min(2).max(30).trim().required(),
        contactNo :  Joi.string().min(10).max(15).trim().required()
    })
    return {error} = schema.validate(dealerUser);
    //return const{ error, value } = schema.validate({user});
   // return Joi.validate(user, schema);
}
function validateUserForAudiokraft(audokraftUser){
    const schema =Joi.object().keys({
        enabled : Joi.boolean(),
        firstName : Joi.string().min(2).max(30).trim().required(),
        lastName : Joi.string().min(2).max(30).trim().required(),
        email : Joi.string().min(10).trim().max(30).email().required(),
        password : Joi.string().min(5).trim().max(100).required(),
        reference:Joi.string().min(2).trim().max(30).required(),
        city : Joi.string().min(3).max(30).trim().required(),
        role: Joi.string().required(),
        contactNo :  Joi.string().min(10).max(15).trim().required(),
        imei : Joi.string().min(10).max(20).trim(),
    })
    return {error} = schema.validate(audokraftUser);
}
function validateUserForUpdate(user){
    const schema =Joi.object().keys({
        enabled : Joi.boolean(),
        isApproved : Joi.boolean(),
        userId:Joi.objectId()
    })
    return {error} = schema.validate(user);
}
function validateforDefaultAddress(user){
    const schema =Joi.object().keys({
        userId:Joi.objectId().required(),
        defaultAddress:Joi.objectId().required()
    })
    return {error} = schema.validate(user);
}



module.exports.User = User;
module.exports.validateForDealer = validateUserForDealer;
module.exports.validateForAudiokraft=validateUserForAudiokraft;
module.exports.validateUserForUpdate=validateUserForUpdate;
module.exports.validateforDefaultAddress = validateforDefaultAddress;
module.exports.userSchema = userSchema;