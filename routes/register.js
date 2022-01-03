var express = require('express');
var cookieParser = require('cookies');
var router = express.Router();
const keys = ['keyboard cat'];
var controller = require('../Controller/controller');






router.post('/', function(req, res, next) {



    const cookies = new cookieParser(req, res, { keys: keys })
    const lastVisit = cookies.get('LastVisit', { signed: true })

    if (!lastVisit) {
        cookies.set('LastVisit', new Date().toISOString(), { signed: true, maxAge: 60*1000 });
    }

    res.render('register', { title: 'Choose password' , email: req.body.email});
});

router.post('/password', function(req, res, next) {

    const cookies = new cookieParser(req, res, { keys: keys })
    const lastVisit = cookies.get('LastVisit', { signed: true })

    if (!lastVisit)
        res.redirect('/')
    else
        controller.pushEmail({Email : req.body.email , Password : req.body.passone});
        res.redirect('/login');
});





module.exports = router;