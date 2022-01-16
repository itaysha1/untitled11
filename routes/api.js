var express = require('express');
var router = express.Router();
var controller = require('../Controller/controller');

router.get('/register', controller.checkEmailExist);

router.post('/save', controller.savePicForUser);

router.delete('/delete', controller.deletePicForUser);

router.delete('/clear', controller.deleteAll);

module.exports = router;