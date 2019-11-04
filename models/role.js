const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const methods = require('../constants/constantsmethod');

const roleSchema = new mongoose.Schema({ 
    role : {
        type: String,
        required : true,
       
    },
    type:{
        type: String,
        required : true,
    },
    userType:{
        type: String,
        required : true,
    },
    privileges : {
        type: [String],
        default: undefined
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

const Role = mongoose.model('Role',roleSchema);

function validateRole(roleTest){    
    const schema = Joi.object().keys({
        role : Joi.string().required(),
        type :  Joi.string().required(),
        userType:Joi.string().required()
    })
  return { error} = schema.validate(roleTest);
    //return Joi.validate(roleTest, schema);
}

function validateRolePrivilege(rolePrivilege){    
    const schema = Joi.object().keys({
        roleId : Joi.objectId().required(),
        method : Joi.string().required().valid(methods.METHOD_GET, methods.METHOD_POST, methods.METHOD_PATCH, methods.METHOD_DELETE),
        url : Joi.string().required()
    })
   return { error} = schema.validate(rolePrivilege);
    //return Joi.validate(rolePrivilege, schema);
}

module.exports.Role = Role;
module.exports.validate = validateRole;
module.exports.validatePrivilege = validateRolePrivilege;