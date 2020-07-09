const _ = require('lodash');
const { Company , validate ,validateCompanyUpdate} =  require('../models/company');
const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send({ statusCode : 400, error : 'Bad Request' , message : error.message });

    let company = await Company.findOne({name :req.body.name }).select('name');
    if(company) return res.status(409).send({ statusCode : 409, error : 'Conflict' , message : 'Company already exits.'});

   // if(!brand.enabled) return res.status(401).send({ statusCode : 401, error : 'Unauthorized' , message : 'Brand is disabled. Please contact Admin.' });

    company = new Company(_.pick(req.body, [ 'name','description','imgUrl','order']));
    company.createdBy = req.user._id;
    company = await company.save();
    return res.status(200).send({ statusCode : 200,message : 'Company Successfuly added.' });
});

router.get('/getAllCompanies', auth, async (req, res) => {
  let company = await Company.find().sort({'createdAt':-1});
  if(!company) return res.status(404).send({ statusCode : 404, error : 'Not Found' , message : 'Company not found.' }); //Not Found
  return res.status(200).send(company);

});
router.patch('/updateCompanyOrEnabledStatusById', auth, async (req, res) => {
  const { error } = validateCompanyUpdate(req.body); 
  if (error) return res.status(400).send({ statusCode : 400, error : 'Bad Request' , message : error.message });
  let company = await Company.findOne({_id:req.body.companyId});
  if(!company) return res.status(404).send({ statusCode : 404, error : 'Not Found' , message : 'Company not found please provide categoryId.' });

  if(req.body.name && req.body.name.length > 0 ) company.name = req.body.name;
  if(req.body.enabled) company.enabled = req.body.enabled
  company = await company.save();
  return res.status(200).send(company);
});

router.delete('/deleteCompanyByCompanyId',auth,async (req, res) => {
companyId = req.query.companyId;
if(!mongoose.Types.ObjectId.isValid(companyId)) return res.status(400).send({statusCode:400,error:'Bad Request',message:'Please provide valid companyId.'});
let company =  await Company.findByIdAndDelete({ _id :companyId });
if(!company) return res.status(404).send({ statusCode : 404, error : 'Not Found' , message : 'Company not found.' }); //Not Found
return res.status(200).send({statusCode : 200,message : 'Company Successfuly delete.' });

});
module.exports = router;