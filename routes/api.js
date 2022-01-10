var express = require('express');
var router = express.Router();
var controller = require('../Controller/controller');

router.post('/register', controller.checkEmailExist);

router.post('/save', controller.savePicForUser);

router.post('/delete', controller.deletePicForUser);

router.post('/clear', controller.deleteAll);

module.exports = router;