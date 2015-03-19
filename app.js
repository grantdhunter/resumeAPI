var express = require('express');
var renderer = require('./render');
var path = require('path');
var passport = require("passport");
var BasicStrategy = require('passport-http').BasicStrategy;
var fs = require('fs');

/*
 * all config settings are stored in a config.json file which should contain
 * these attributes:
 *      username       --> User name Employers user to view resume
 *      password       --> password Employers use to view resume
 *      resumeDir      --> Directory that contains all resumes
 *      domain         --> base http url of the site
 *      secureDomain   -->  https domain the resumeAPI is hosted on 
 */
var config = require('./config');


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
//static directory that contains such things like pictures
app.use(express.static(path.join(__dirname, 'public')));

//setup basic auth using passport
app.use(passport.initialize());
app.use(passport.authenticate('basic', {
    session: false
}), function (req, res, next) {
    next();
});

//redirect root to unsecured domain
app.get('/', function (req, res) {
    req.redirect(confing.domain);
});

//serve up raw json representation of the resume
app.get('/resume/:name', function (req, res) {
    getResume(req.params.name, function (err, resume) {
        if (err) return res.send(err);
        res.json(resume);
    });
});

//serve up a pretty html rendering of the resume
app.get('/resume/:name/pretty', function (req, res) {
    getResume(req.params.name, function (err, resume) {
        if (err) return res.send(err);
        res.send(renderer.render(resume));
    });

});

//serve up a specific portion of the resume in raw json
app.get('/resume/:name/:attr', function (req, res) {
    getResume(req.params.name, function (err, resume) {
        if (err) return res.send(err);
        var error = {
            error: "sorry no attribute by that name",
            validAttributes: Object.keys(resume),
            docs: "https://github.com/grantdhunter/resumeAPI"
        }
        res.json(resume[req.params.attr] || error);
    });
});

app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.listen(4242)


//fetch the resume json file from the specific path
function getResume(name, cb) {
    fs.readFile(config.resumeDir + name + '.json', function (err, data) {
        cb(err, JSON.parse(data));
    });
}