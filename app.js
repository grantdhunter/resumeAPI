var express = require('express');
var renderer = require('./render');
var path = require('path');
var passport = require("passport");
var BasicStrategy = require('passport-http').BasicStrategy;

var config = require('./config');
var resumeJson = require('./resume');

passport.use(new BasicStrategy(function (username, password, done) {
    if (username && password) {
        if (username === config.username && password === config.password) {
            return done(null, {
                username: username,
                password: password
            });
        }
    }
    
    done(null, false);
}));

var app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());

app.use(passport.authenticate('basic', {
    session: false
}), function (req, res, next) {
    next();
});

app.get('/resume', function (req, res) {
    res.json(resumeJson);
});

app.get('/resume/pretty', function (req, res) {
    res.send(renderer.render(resumeJson));
});

app.get('/resume/:attr', function (req, res) {
    var error = {
        error: "sorry no attribute by that name",
        validAttributes: Object.keys(resumeJson)
    }
    res.json(resumeJson[req.params.attr] || error);
});

app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.listen(4242)