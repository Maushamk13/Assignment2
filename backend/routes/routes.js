var express = require('express');
var userController = require ("../user/userController.js");
const router = express.Router();

router.route('/user/login').post(userController.loginUserControllerFn);
router.route('/user/create').post(userController.createUserControllerFn);
router.route('/user/all').get(userController.getAllUsersControllerFn);

module.exports = router; 