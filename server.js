/* Config */
const { config, mongoOptions } = require('./config/config');
const { initAdmin } = require("./util/init_db");

/* Express */
const express = require('express');
const flash = require('connect-flash');
const session = require('express-session');
const app = express();
const bodyParser = require('body-parser')
const cors = require('cors');

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '10mb' }))
app.use(cors({
    origin: '*'
}));

app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
);
app.use(flash());

app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

/* MongoDB */
const mongoose = require('mongoose');
mongoose.connect(config.dbUri, mongoOptions).then(() => {
    console.log(`MongoDB connected to ${config.dbUri}`)
    initAdmin()
}).catch(err => {
    console.log("MongoDB connection error", err)
});

/* Passport */
const passport = require('passport');
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());


app.use('/', require('./routes/index.js'));
app.use('/authentication', require('./routes/authentication.js'));
app.use('/elections', require('./routes/elections.js'));
app.use('/vote', require('./routes/vote.js'));

app.listen(config.port, () => {
    console.log(`DAO NFT Voting - Server started on port ${config.port}`);
});