const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const userAddressSchema = new mongoose.Schema({ 
    addressTitle:{
        type: String,
        required : true,
        minlength: 2,
        maxlength: 30,
    },
    contactNo:{
        type:Number,
        required:true,
        minlength : 10,
        maxlength : 15
    },
    pincode : {
        type: String,
        required : true,
        minlength: 6,
        maxlength: 6,
    },
   buildingName : {
        type: String,
        required : true,
        minlength: 2,
        maxlength: 30,
    },
    area:{
        type:String,
        required:true,
        minlength:2,
        maxlength:30
    },
    city:{
        type:String,
        required:true,
        minlength:2,
        maxlength:30

    },
    state:{
        type:String,
        required:true,
        minlength:2,
        maxlength:30
    },
    landmark:{
        type:String,
        required:false,
        minlength:2,
        maxlength:30
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
const UserAddress = mongoose.model('UserAddress',userAddressSchema);

function validateUserAddress(userAddress){    
    const schema = Joi.object().keys({
        pincode : Joi.string().min(6).max(6).required(),
        buildingName : Joi.string().min(2).max(300).required(),
        area : Joi.string().min(2).max(30).required(),
        city : Joi.string().min(2).max(30).required(),
        state : Joi.string().min(2).max(30).required(),
        landmark : Joi.string().min(2).max(30).required(),
        addressTitle : Joi.string().min(2).max(30).required(),
        contactNo : Joi.number().min(10).max(15).trim()
        
    })
    return {error} = schema.validate(userAddress);
    //return Joi.validate(userAddress, schema);
}
function validateUserAddressUpdate(userAddress){    
    const schema = Joi.object().keys({
        pincode : Joi.string().min(6).max(6),
        buildingName : Joi.string().min(2).max(100),
        area : Joi.string().min(2).max(100),
        city : Joi.string().min(2).max(100),
        state : Joi.string().min(2).max(100),
        landmark : Joi.string().min(2).max(100),
        addressId:Joi.objectId().required()
       
    })
     return {error} = schema.validate(userAddress);
};


module.exports.UserAddress = UserAddress;
module.exports.validate = validateUserAddress;
module.exports.userAddressSchema=userAddressSchema;
module.exports.validateUserAddressUpdate = validateUserAddressUpdate;
