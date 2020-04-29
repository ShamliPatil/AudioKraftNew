const _ = require('lodash');
const { CompanyModel , validate ,validateCompanyModelUpdate} = require('../models/companymodel');
const auth = require('../middleware/auth');
const express = require('express');
const mongoose = require('mongoose'); 
const router = express.Router();

router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send({ statusCode : 400, error : 'Bad Request' , message : error.message });

    let companymodel = await CompanyModel.findOne({ name : req.body.name });
    if(companymodel) return res.status(400).send({ statusCode : 400, error : 'Bad Request' , message : 'CompanyModel name already added.' });
   
   // if(!brand.enabled) return res.status(401).send({ statusCode : 401, error : 'Unauthorized' , message : 'Brand is disabled. Please contact Admin.' });

    companymodel = new CompanyModel(_.pick(req.body, [ 'companyId','name','description','imgUrl','order']));
    companymodel.createdBy = req.user._id;
    companymodel = await companymodel.save();
    return res.status(200).send({ statusCode : 200,message : 'CompanyModel Successfuly added.' });
});

router.get('/getCompanyModelsByCompanyId', auth, async (req, res) => {
  const companyId = req.query.companyId;
  if(!mongoose.Types.ObjectId.isValid(companyId)) return res.status(400).send({statusCode:400,error:'Bad Request',message:'Please provide valid companyId'}); 
  if(!companyId || companyId.length == 0)return res.status(400).send({ statusCode : 400, error : 'Bad Request' , message : 'Please provide CompanyId.' });
  let companymodel = await CompanyModel.find({companyId:companyId}).select(['_id','name']).sort('name');
  if(!companymodel ||companymodel.length == 0 ) return res.status(404).send({ statusCode : 404, error : 'Not Found' , message : 'CompanyModel not found.' }); //Not Found
  return res.status(200).send(companymodel);

});

router.get('/getCompanyModels', auth, async (req, res) => {
  const searchText = req.query.name;
  if(!searchText || searchText.length == 0)return res.status(400).send({ statusCode : 400, error : 'Bad Request' , message : 'Please provide companyModelName.' });
  let companymodel = await CompanyModel.find({ 'name' : { '$regex' : searchText, '$options' : 'i' }}).sort({name : 1}) .select('_id name');
  //let companymodel = await CompanyModel.findOne({name:name}).select(['_id','name']);
  if(!companymodel ||companymodel.length ==0 ) return res.status(404).send({ statusCode : 404, error : 'Not Found' , message : 'companyModelName not found.' }); //Not Found
  return res.status(200).send(companymodel);

});

router.get('/getAllCompanieModels',auth, async (req, res) => {
  let companymodel = await CompanyModel.find().sort({'createdAt':-1});
  if(!companymodel) return res.status(404).send({ statusCode : 404, error : 'Not Found' , message : 'CompanyModel not found.' }); //Not Found
  return res.status(200).send(companymodel);

});
router.patch('/updateCompanyModelOrEnabledStatusById',auth,async (req, res) => {
  const { error } = validateCompanyModelUpdate(req.body); 
  if (error) return res.status(400).send({ statusCode : 400, error : 'Bad Request' , message : error.message });
  let companymodel = await CompanyModel.findOne({_id:req.body.companymodelId});
  if(!companymodel) return res.status(404).send({ statusCode : 404, error : 'Not Found' , message : 'Companymodel not found please provide categoryId.' });
  if(req.body.name && req.body.name.length > 0 ) companymodel.name = req.body.name;
  if(req.body.companyId && req.body.companyId.length > 0 ) companymodel.companyId = req.body.companyId;
  companymodel.enabled = req.body.enabled;
 
  companymodel = await companymodel.save();
  return res.status(200).send(companymodel);
});

router.delete('/deleteCompanyModelByCompanyModelId',auth,async (req, res) => {
companymodelId = req.query.companymodelId;
if(!mongoose.Types.ObjectId.isValid(companymodelId)) return res.status(400).send({statusCode:400,error:'Bad Request',message:'Please provide valid companymodelId.'});
let companymodel =  await CompanyModel.findByIdAndDelete({ _id :companymodelId });
if(!companymodel) return res.status(404).send({ statusCode : 404, error : 'Not Found' , message : 'CompanyModel not found.' }); //Not Found
return res.status(200).send({statusCode : 200,message : 'Companymodel Successfuly delete.' });

});
module.exports = router;