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
    let errorHandled = false; // Flag to track error handling

    try {
        console.log(`Processing login for email: ${userDetails.email}`);

        const user = await userModel.findOne({ email: userDetails.email }).exec();

        if (user) {
            const decrypted = encryptor.decrypt(user.password);

            if (decrypted === userDetails.password) {
                // Return all user information except the password
                const { password, ...userData } = user.toObject();
                return userData;
            } else {
                throw new Error("User Validation Failed");
            }
        } else {
            throw new Error("User not found in the database");
        }
    } catch (error) {
        if (!errorHandled) {
            console.error(`Error in loginUserDBService for email: ${userDetails.email}`);
            errorHandled = true; // Set the flag to indicate error handling
        }
    }
};



