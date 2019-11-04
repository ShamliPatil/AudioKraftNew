const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');
const config = require('config');

aws.config.update({
    secretAccessKey:  config.get('awsS3secretAccessKey'),// config.AWS_SECRET_ACCESS_KEY,
    accessKeyId: config.get('awsS3AccessKeyId'), // config.AWS_ACCESS_KEY_ID,
    region: config.get('awsS3region')
});

//aws.config.loadFromPath('./credentials/awsconfig.json'); 

const s3 = new aws.S3();

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' 
  || file.mimetype === 'image/png' || file.mimetype === 'application/pdf' 
  || file.mimetype === 'application/msword' || file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  || file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.template' 
  || file.mimetype === 'application/vnd.ms-word.document.macroEnabled.12' 
  || file.mimetype === 'application/vnd.ms-word.template.macroEnabled.12' 
  || file.mimetype === 'application/vnd.ms-excel'
  ||  file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ||  file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.template'
  ||  file.mimetype === 'application/vnd.ms-excel.sheet.macroEnabled.12'
  || file.mimetype === 'application/vnd.ms-excel.template.macroEnabled.12'
  || file.mimetype === 'application/vnd.ms-excel.addin.macroEnabled.12'
  || file.mimetype === 'application/vnd.ms-excel.sheet.binary.macroEnabled.12'
  || file.mimetype === 'application/vnd.ms-powerpoint' 
  ||  file.mimetype === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ||  file.mimetype === 'application/vnd.openxmlformats-officedocument.presentationml.template'
  || file.mimetype === 'application/vnd.openxmlformats-officedocument.presentationml.slideshow'
  || file.mimetype === 'application/vnd.ms-powerpoint.addin.macroEnabled.12'
  || file.mimetype === 'application/vnd.ms-powerpoint.presentation.macroEnabled.12'
  || file.mimetype === 'application/vnd.ms-powerpoint.slideshow.macroEnabled.12' ) {
    cb(null, true);
  } else {
    cb( new Error('Invalid file type!'), false);
  }
}

const upload = multer({
  fileFilter,
  storage: multerS3({
    acl: 'public-read',
    s3,
    bucket: '12image',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: 'TESTING_METADATA'});
    },
    key: function (req, file, cb) {
     // for prod :-  cb(null, req.user._id + '/' +  Date.now().toString() + path.extname(file.originalname));
     // for test :-   cb(null, "bv_test/" + req.user._id + '/' +  Date.now().toString() + path.extname(file.originalname));
      // for local :- cb(null, "bv_local/" + req.user._id + '/' +  Date.now().toString() + path.extname(file.originalname));
      cb(null, "AudioKraft/" + req.query.type + '/' +  Date.now().toString() + path.extname(file.originalname));
    }
  })
});

module.exports = upload;