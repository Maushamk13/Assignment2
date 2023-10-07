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

module.exports = {createUserControllerFn};