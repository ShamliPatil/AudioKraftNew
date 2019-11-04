const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const specificationSchema = new mongoose.Schema({ 
    title:{type:String,minlength:2,maxlength:100,required:true},
    data :[{
            key:{type:String,minlength:2,maxlength:100,required:true},
            value:{type:String,minlength:2,maxlength:100,required:true}
    }]
},{ timestamps: false });
const Specification = mongoose.model('Specification',specificationSchema);

function validateSpecification(specification){    
    const schema = Joi.object().keys({
       title: Joi.string().min(2).max(100).required(),
       data:Joi.array().items(Joi.object({
       key:Joi.string().min(2).max(100).required(),
       value:Joi.string().min(2).max(100).required()

    }))
    })
     return { error} = schema.validate(specification);
   // return Joi.validate(specification, schema);
}


module.exports.Specification = Specification;
module.exports.validate = validateSpecification;
module.exports.specificationSchema=specificationSchema;
