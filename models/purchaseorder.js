const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);
const { userAddressSchema } = require('../models/useraddress');
const {seatCoverSchema} = require('../models/seatcover');
const { productSchema } = require('../models/product');
const{userSchema} = require('../models/user');
const status = require('../constants/constantsorderstatus');

const purchaseOrderSchema = new mongoose.Schema({ 
    deliveryAddress: {
            type :mongoose.Schema.Types.ObjectId,
            ref:'UserAddress',
            required :true
    },
    dealerId: {
        type :mongoose.Schema.Types.ObjectId,
        ref:'User',
        required :true
     },
    
    products:[
        {
            product:{type:mongoose.Schema.Types.ObjectId,required:true},
            quantity:{type:Number,required:true},
            majorColor:{type:String,required:true,minlength:2,maxlength:100},
            minorColor:{type:String,required:true,minlength:2,maxlength:100},
            date:{type:String,required:false,default:0},
            status:{type:String,required:false,enum:[status.ORDER_STATUS_PENDING,status.ORDER_STATUS_CONFIRMED,status.ORDER_STATUS_REJECTED,status.ORDER_STATUS_DISPATCHED,status.ORDER_STATUS_DELIVERED]},
            data:{type:seatCoverSchema,required:false}
        }
    ],
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

const PurchaseOrder = mongoose.model('PurchaseOrder',purchaseOrderSchema);

function validatePurchaseOrder(purchaseOrder){    
    const schema = Joi.object().keys({
        deliveryAddress: Joi.string().required(),
        dealerId: Joi.string().required(),
        products : Joi.array().required(),
    })
   return { error} = schema.validate(purchaseOrder);
    //return Joi.validate(purchaseOrder, schema);
}
function validatePurchaseOrderforUpdateStatus(purchaseOrder){    
    const schema = Joi.object().keys({
        statusId : Joi.objectId().required(), 
        status : Joi.string().valid(status.ORDER_STATUS_PENDING,status.ORDER_STATUS_CONFIRMED,status.ORDER_STATUS_REJECTED,status.ORDER_STATUS_DISPATCHED,status.ORDER_STATUS_DELIVERED)

    })
   return { error} = schema.validate(purchaseOrder);
}


module.exports.PurchaseOrder = PurchaseOrder;
module.exports.validate = validatePurchaseOrder;
module.exports.validatePurchaseOrderforUpdateStatus = validatePurchaseOrderforUpdateStatus;
