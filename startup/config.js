const config = require('config');

module.exports = function (){
    if (!config.get('jwtPrivateKey')){
        throw new Error('FATEL ERROR : jwtprivate key not defined..');    
    }

    if(!config.get('dbConnection')){
        throw new Error('FATEL ERROR : swagliv system database not defined..');    
    }  

    // if(!config.get('awsS3AccessKeyId')){
    //     throw new Error('FATEL ERROR : awsS3AccessKeyId not defined..');    
    // }  

    // if(!config.get('awsS3secretAccessKey')){
    //     throw new Error('FATEL ERROR : awsS3secretAccessKey not defined..');    
    // }  

    // if(!config.get('awsS3region')){
    //     throw new Error('FATEL ERROR : aws s3 region not defined..');    
    // }  
}