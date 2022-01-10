var express = require('express');
const controller = require("../Controller/controller");
var router = express.Router();

/* GET home page. */
router.get('/', controller.showHomePage);

router.post('/login', controller.loginFromHomePage);

router.get('/login', controller.loginAfterSignIn);

router.post('/nasa', controller.checkLoginToNasaPage);

module.exports = router;
