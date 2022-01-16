var express = require('express');
var cookieParser = require('cookies');
var router = express.Router();
const keys = ['keyboard cat'];
var controller = require('../Controller/controller');
const db = require('../models');


/**
 * this is a post request to the user after the user passed the first step of the registration.
 * The server will start a cookie timer of a minute, and transfers the user to the next step.
 *
 */
router.post('/', function(req, res, next) {
    const cookies = new cookieParser(req, res, { keys: keys })
    const lastVisit = cookies.get('LastVisit', { signed: true })

    if (!lastVisit) {
        cookies.set('LastVisit', new Date().toISOString(), { signed: true, maxAge: 60*1000 });
    }

    res.render('register', { title: 'Choose password' , email: req.body.email});
});

/**
 * this is a post request for the 2nd step of the registration, the server will check that a minute hasn't passed and
 * will proceed as needed.
 */
router.post('/password', function(req, res, next) {

    const cookies = new cookieParser(req, res, { keys: keys })
    const lastVisit = cookies.get('LastVisit', { signed: true })

    if (!lastVisit)
        res.redirect('/')
    else
    {
        const email = req.body.email;
        const password = req.body.passone;
        req.session.signIn = true;
        return db.Contact.create({email, password})
            .then((contact) =>   res.redirect('/login'))
            .catch((err) => {
                res.redirect('/')
            })
    }
});

router.get('/password', controller.showHomePage);
router.get('/', controller.showHomePage);




module.exports = router;