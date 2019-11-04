const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const seatCoverSchema =new mongoose.Schema({
    majorColor:{
       type:String,
        required:true,
        minlength : 2,
        maxlength : 30
    },
    minorColor:{
       type:String,
        required:true,
        minlength : 2,
        maxlength : 30
    },
    colorDetailing:{
         type:String,
        required:true,
        minlength : 2,
        maxlength : 200
    },
    vehicleModel:{
        type:String,
        required:true,
        minlength : 2,
        maxlength : 200
    },
    percentage:{
        type:String,
        required:true
    },
    frontArmRest:{
        type:String,
        required:true,
        minlength : 2,
        maxlength : 30
    },
    rearArmRest:{
        type:String,
        required:true,
        minlength : 2,
        maxlength : 30
    },
    type:{
        type:String,
        required:true,
        minlength : 2,
        maxlength : 30
    },
    
    touchOrfull:{
        type:String,
        required:true,
        minlength : 2,
        maxlength : 30
    },
    purchaseQuantity:{
        type:Number,
        required:true
    },
    rearHeadRest:{
        type:Number,
        required:true
    },
    leatherRange:{
        type:String,
        required:true,
        minlength : 2,
        maxlength : 30
    },
    leatherColor:{
        type:String,
        required:true,
        minlength : 2,
        maxlength : 30
    },
    designSelected:{
        type:String,
        required:true
    },
    customLogo:{
        type:String,
        required:true,
        minlength : 2,
        maxlength : 30
    },
    doorTims:{
        type:String,
        required:true,
        minlength : 2,
        maxlength : 30
    },
    stearingWheel:{
        type:String,
        required:true,
        minlength : 2,
        maxlength : 30
    },
    gearKnob:{
        type:String,
        required:true,
        minlength : 2,
        maxlength : 30
    },
    handBrake:{
        type:String,
        required:true,
        minlength : 2,
        maxlength : 30
    },
    otherRequirement:{
        type:String,
        required:true,
        minlength : 2,
        maxlength : 100
    },
    remark:{
        type:String,
        required:true,
        minlength : 2,
        maxlength : 100
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
},{timestamps: true});

const SeatCover = mongoose.model('SeatCover',seatCoverSchema);

function validateSeatCover(seatCover){    
    const schema = Joi.object().keys({
        majorColor : Joi.string().min(2).max(50).required(),
        minorColor : Joi.string().min(2).max(50).required(),
        colorDetailing : Joi.string().min(2).max(200).required(), 
        vehicleModel : Joi.string().min(2).max(200).required(),
        percentage : Joi.string().required(),
        frontArmRest : Joi.string().min(2).max(30).required(),
        rearArmRest : Joi.string().min(2).max(30).required(),
        type : Joi.string().min(2).max(30).required(),
        touchOrfull : Joi.string().min(2).max(30).required(),
        purchaseQuantity : Joi.number().required(),
        rearHeadRest : Joi.number().required(),
        leatherRange : Joi.string().min(2).max(30).required(),
        leatherColor: Joi.string().min(2).max(30).required(),
        designSelected: Joi.string().min(2).max(30).required(),
        customLogo: Joi.string().min(2).max(30).required(),
        doorTims :Joi.string().min(2).max(30).required(),
        stearingWheel: Joi.string().min(2).max(30).required(),
        gearKnob: Joi.string().min(2).max(30).required(),
        handBrake : Joi.string().min(2).max(30).required(),
        otherRequirement: Joi.string().min(2).max(30).required(),
        remark:  Joi.string().min(2).max(30).required()
    })
     return { error} = schema.validate(seatCover);
    //return Joi.validate(seatCover, schema);
}

module.exports.SeatCover = SeatCover;
module.exports.validateSeatCover = validateSeatCover;
module.exports.seatCoverSchema=seatCoverSchema;