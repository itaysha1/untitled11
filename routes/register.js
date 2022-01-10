var express = require('express');
var cookieParser = require('cookies');
var router = express.Router();
const keys = ['keyboard cat'];
var controller = require('../Controller/controller');
const db = require('../models');

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
    {
        const email = req.body.email;
        const password = req.body.passone;
        return db.Contact.create({email, password})
            .then((contact) =>   res.redirect('/login'))
            .catch((err) => {
            })
    }
});




module.exports = router;