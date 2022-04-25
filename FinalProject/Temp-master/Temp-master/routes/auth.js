var passport = require('passport');
var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
  res.render('mailer', {})
})

router.post('/login',
    passport.authenticate('local', { successRedirect: '/contacts',
                                     failureRedirect: '/login_fail',
                                  })
);

router.get('/login', function (req, res) {
  res.render('login', {});
});

router.get('/login_fail', function (req, res) {
  res.render('login_fail', {});
});

router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/login');
});



module.exports = router;
