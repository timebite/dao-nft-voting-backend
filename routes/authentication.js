const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

const Admin = require('../models/Admins');

const { forwardAuthenticated, ensureGodAuthenticated, ensureAuthenticated } = require('../config/auth');
const { randomString } = require("../util/utils")

router.use(express.static('public'));

router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/dashboard',
      failureRedirect: '/authentication/login',
      failureFlash: true
    })(req, res, next);
});

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/authentication/login');
  });
  
module.exports = router;