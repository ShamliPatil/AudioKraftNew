const express = require('express');
const upload = require('../services/file-upload');
const singleUpload = upload.single('file');
const auth = require('../middleware/auth');
const router = express.Router();


router.post('/', auth , async function(req, res) {

     await singleUpload(req, res, function(err) {
       if (err) {
         return res.status(422).send({errors: [{title: 'file Upload Error', detail: err.message}]});
      }  else{
        return res.status(200).send({ statusCode : 200, message : 'File successfully upload.', fileUrl : req.file.location});
      }
     });
  });


// router.post('/others/file-upload/:id', auth , async (req, res) => {
//   if(!req.params.id) return res.status(400).send( boom.badRequest('Invalid user id.')); 
//   if(!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).send( boom.badRequest('Invalid user id.')); 

//   //req.user._id
//   let user = await User.findById(req.params.id).select('email');
//   if(!user) return res.status(400).send(boom.badRequest("user not found."));

//   req.user._id = req.params.id;
//   singleUpload(req, res, function(err) {
//     if (err) {
//       return res.status(422).send({errors: [{title: 'File Upload Error', detail: err.message}]});
//     }

//     return res.status(200).send({'fileUrl': req.file.location});
//   });
// });

// router.post('/others/file-upload/virtualId/:id', auth , async (req, res) => {
//   if(!req.params.id) return res.status(400).send( boom.badRequest('Please enter virtual id.'));   
//   var p = req.params.id;
//   if((!isNumber(p)) || (p.length != 16)) return res.status(400).send( boom.badRequest('Please enter valid virtual id.')); 

//   let user = await User.findOne({ virtualId : p }).select(['id','email']);
//   if(!user) return res.status(404).send(boom.notFound('Virtual id user information not found'));
  
//   req.user._id = user.id;
//   singleUpload(req, res, function(err) {
//     if (err) {
//       return res.status(422).send({errors: [{title: 'File Upload Error', detail: err.message}]});
//     }       
//     return res.status(200).send({'fileUrl': req.file.location});
//   });
// });
  
module.exports = router;