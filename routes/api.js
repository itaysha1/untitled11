var express = require('express');
var router = express.Router();
var controller = require('../Controller/controller');

router.post('/register', (req, res, next) => {
    let resource = {flag : true};

    if (!controller.checkEmail(req.body.currEmail))
        resource.flag = false;

    res.json(resource);
});


module.exports = router;