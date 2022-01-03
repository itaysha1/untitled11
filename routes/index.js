var express = require('express');
const controller = require("../Controller/controller");
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Register' });
});

router.post('/login', function(req, res, next) {
    res.render('login', { title: 'Login' });
});

router.get('/login', function(req, res, next) {
  if (req.session.LoginFailed)
  {
    req.session.LoginFailed = false;
    res.render('login', { title: 'Your email or password incorrect' });
  }
    res.render('login', { title: 'Congratulation, now login' });
});

router.post('/nasa', function(req, res, next) {
  if (controller.checkAvailableUser({Email : req.body.email, Password : req.body.password}))
      res.render('nasa', {user : req.body.email});
  else
      req.session.LoginFailed = true;

  res.redirect('/login');
});


module.exports = router;
