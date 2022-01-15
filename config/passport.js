const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

/* Load Admin model */
const Admin = require('../models/Admins');

module.exports = async function(passport) {
    passport.use(
      new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
        const foundOne = await Admin.findOne({ email: email });
        if(!foundOne) {
            return done(null, false, { message: 'That email is not registered' });
        }
        const isMatch = await bcrypt.compare(password, foundOne.password);
        if(!isMatch) {
            return done(null, false, { message: 'Password incorrect' });
        } else {
            return done(null, foundOne);
        }
      })
    );
  
    passport.serializeUser(function(user, done) {
      done(null, user.id);
    });
  
    passport.deserializeUser(async function(id, done) {
      const foundOne = await Admin.findById(id);
      done(null, foundOne);
    });
};