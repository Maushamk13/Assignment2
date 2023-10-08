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

module.exports.loginUserDBService = async (userDetails) => {
    try {
        const result = await userModel.findOne({ email: userDetails.email }).exec();

        if (result) {
            const decrypted = encryptor.decrypt(result.password);

            if (decrypted === userDetails.password) {
                return { status: true, msg: "User Validated Successfully" };
            } else {
                throw { status: false, msg: "User Validation Failed" };
            }
        } else {
            throw { status: false, msg: "User Errored Details" };
        }
    } catch (error) {
        throw { status: false, msg: "Invalid Data" };
    }
};
