var userModel = require('./userModel');
var key = '130713071307maumau';
var encryptor = require('simple-encryptor')(key);

module.exports.createUserDBService = (userDetails) => {


    return new Promise(function myFn(resolve, reject){
        var userModelData = new userModel();

        userModelData.firstname = userDetails.firstname;
        userModelData.lastnname = userDetails.lastname;
        userModelData.email = userDetails.email;
        userModelData.password = userDetails.password; 
        userModelData.role = userDetails.role; 
        userModelData.group = userDetails.group;
        var encrypted = encryptor.encrypt(userDetails.password);

        userModelData.password = encrypted;

        userModelData.save(function resultHandle(error, result){
            if (error){
                reject(false);
            } else {
                resolve(true);
            }
        });
    });
}