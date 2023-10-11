var userService = require('./userService');

var createUserControllerFn = async (req, res) => 
{
    try
    {
        console.log(req.body);
        var status = await userService.createUserDBService(req.body);
        console.log(status);

        if(status){
            res.send({ "status": true, "message": "User created successfully" });
        }
        else {
            res.send({ "status": false, "message": "Error creating user" });
        }
    }
catch(error)
{
    console.log(error);
}
}

var loginUserControllerFn = async (req, res) => {
    try {
        const user = await userService.loginUserDBService(req.body);
        if (user) {
            res.send({ "status": true, "user": user, "message": "User Validated Successfully" });
        } else {
            res.send({ "status": false, "message": "User Validation Failed" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ "status": false, "message": "Internal Server Error" });
    }
}

var getAllUsersControllerFn = async (req, res) => {
    try {
        const users = await userService.getAllUsersDBService();
        res.send({ "status": true, "users": users, "message": "All users retrieved successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ "status": false, "message": "Internal Server Error" });
    }
}

module.exports = {createUserControllerFn, loginUserControllerFn, getAllUsersControllerFn};