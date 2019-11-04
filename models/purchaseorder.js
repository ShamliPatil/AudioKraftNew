const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);
const { userAddressSchema } = require('../models/useraddress');
const {seatCoverSchema} = require('../models/seatcover');
const { productSchema } = require('../models/product');
const{userSchema} = require('../models/user');

const purchaseOrderSchema = new mongoose.Schema({ 
    dealer: {
        type:userSchema,
        required : true
    },
    deliveryAddress: {
            type :userAddressSchema,
            required :true
    },
    products:[
        {
            product:{type:productSchema,required:true},
            quantity:{type:Number,required:true},
            majorColor:{type:String,required:true,minlength:2,maxlength:100},
            minorColor:{type:String,required:true,minlength:2,maxlength:100},
            data:{type:seatCoverSchema,required:false}
        }
    ],
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

const PurchaseOrder = mongoose.model('PurchaseOrder',purchaseOrderSchema);

function validatePurchaseOrder(purchaseOrder){    
    const schema = Joi.object().keys({
        deliveryAddress: Joi.string().required(),
        products : Joi.array().required()
    })
   return { error} = schema.validate(purchaseOrder);
    //return Joi.validate(purchaseOrder, schema);
}


module.exports.PurchaseOrder = PurchaseOrder;
module.exports.validate = validatePurchaseOrder;
