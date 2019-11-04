const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const manageStockSchema = new mongoose.Schema({ 
    productColorCombinationId:{
         type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref : 'ProductColorCombination'
    },
    productId:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref : 'Product'
    },
    productName:{
        type: String,
        required:true,
    },
    companyId:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref : 'Company'
    },
    companyName:{
        type: String,
        required:true,
    },
    companyModelId:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref : 'CompanyModel'
    },
    companyModelName:{
        type: String,
        required:true,
    },
    vendorName:{
        type: String,
        minlegth : 2,
        maxlength : 30,
        required:false
    },
    inVoiceNo:{
        type : Number,
        require : false
    },
    colorMajor:{
        type: String,
        minlegth : 2,
        maxlength : 30,
        required:true,
    },
    colorMinor:{
        type: String,
        minlegth : 2,
        maxlength : 30,
        required:true,
    },
    addStock : {
        type : Number,
        require : true,
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
const ManageStock = mongoose.model('ManageStock',manageStockSchema);

function validateManageStock(manageStock){    
    const schema = Joi.object().keys({
        productId : Joi.objectId().required(),
        productColorCombinationId : Joi.objectId().required(),
        companyId : Joi.objectId().required(),
        companyModelId : Joi.objectId().required(),
        colorMajor : Joi.string().min(2).max(30).required(),
        colorMinor : Joi.string().min(2).max(30).required(),
        addStock : Joi.number().required(),
        vendorName: Joi.string().min(2).max(30),
        inVoiceNo : Joi.number()

     
    })
      return { error} = schema.validate(manageStock);
    //return Joi.validate(manageStock, schema);
}

module.exports.ManageStock = ManageStock;
module.exports.validate = validateManageStock;