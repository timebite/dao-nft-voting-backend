module.exports = {
    ensureAuthenticated: function(req, res, next) {
      if (req.isAuthenticated()) {
        return next();
      }
      req.flash('error_msg', 'Please log in to view that resource');
      res.redirect('/authentication/login');
    },
    ensureGodAuthenticated: function(req, res, next) {
      if (req.isAuthenticated() && req.user.god_mode) {
        return next();
      }
      req.flash('error_msg', 'Please log in as a God to view that resource');
      res.redirect('/authentication/login');
    },
    forwardAuthenticated: function(req, res, next) {
      if (!req.isAuthenticated()) {
        return next();
      }
      res.redirect('/dashboard'); 
    }
};