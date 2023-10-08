var userModel = require('./userModel');
var key = '130713071307maumau';
var encryptor = require('simple-encryptor')(key);

module.exports.createUserDBService = (userDetails) => {
    return new Promise(async function myFn(resolve, reject) {
        try {
            var userModelData = new userModel();

            userModelData.firstname = userDetails.firstname;
            userModelData.lastname = userDetails.lastname;
            userModelData.email = userDetails.email;
            userModelData.password = userDetails.password;
            userModelData.role = userDetails.role;
            userModelData.group = userDetails.group;
            var encrypted = encryptor.encrypt(userDetails.password);

            userModelData.password = encrypted;

            const result = await userModelData.save();
            resolve(true);
        } catch (error) {
            reject(false);
        }
    });
}

module.exports.loginUserDBService = (userDetails) => 
{
    return new Promise(function myFn(resolve, reject)
    {
        userModel.findOne({ email: userDetails.email},function getresult(errorvalue, result)
        {
            if(errorvalue)
            {
                reject({status: false, msg: "Invalid Data"});
            }
            else 
            {
                if(result !=undefined && result !=null)
                {
                    var decrypted = encryptor.decrypt(result.password);

                    if(decrypted == userDetails.password)
                    {
                        resolve({status: true,msg: "User Validated Successfully"});
                    }
                    else 
                    {
                        reject({status: false,msg: "User Validation Failed"});
                    }
                }
                else
                {
                    reject({status: false, msg: "User Errored Details"});
                }
            }
        });
    });
}