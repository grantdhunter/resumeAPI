var express = require('express');
var renderer = require('./render');
var path = require('path');
var passport = require("passport");
var BasicStrategy = require('passport-http').BasicStrategy;
var fs = require('fs');
var morgan = require('morgan');
var r = require('rethinkdb');
var wkhtmltopdf = require('wkhtmltopdf');

/*
 * all config settings are stored in a config.json file which should contain
 * these attributes:
 *      username       --> User name Employers user to view resume
 *      password       --> password Employers use to view resume
 *      resumeDir      --> Directory that contains all resumes
 *      domain         --> base http url of the site
 *      secureDomain   --> https domain the resumeAPI is hosted on
 *      port           --> port to listen on
 */
var config = require('./config');
var app = express();


/*
 * static directory that contains such things like pictures
 */
app.use(express.static(path.join(__dirname, 'public')));

/*
 * setup basic auth using passport
 */
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
app.use(passport.initialize());
app.use(passport.authenticate('basic', {
    session: false
}), function (req, res, next) {
    next();
});



/*
 * setup access logging
 */
var dir = '/logs'
if (!fs.existsSync(__dirname + dir)) {
    fs.mkdirSync(__dirname + dir);
}
var accessLogStream = fs.createWriteStream(__dirname + dir + '/access.log', {
    flags: 'a'
});

morgan.token('ip', function (req) {
    if (req.headers['x-forwarded-for']) {
        return req.headers['x-forwarded-for']
    }
    return req.ip
})
app.use(morgan(':ip :remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"', {
    stream: accessLogStream
}));

/*
 * redirect root to unsecured domain
 */
app.get('/', function (req, res) {
    res.redirect(config.domain);
});

/*
 * serve up raw json representation of the resume
 */
app.get('/resume/:name', function (req, res) {
    console.log(req.headers);
    getResume(req.params.name, function (err, resume) {
        if (err) return res.send(err);
        res.json(resume);
    });
});

/*
 * serve up a pretty html rendering of the resume
 */
app.get('/resume/:name/pretty', function (req, res) {
    getResume(req.params.name, function (err, resume) {
        if (err) return res.send(err);
        res.send(renderer.render(resume));
    });

});

app.get('/resume/:name/download', function (req, res) {
    getResume(req.params.name, function (err, resume) {
        var pdf = renderer.render(resume);
        wkhtmltopdf(pdf)
            .pipe(res);
    });
});

/*
 * serve up a specific portion of the resume in raw json
 */
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





app.listen(config.port)
    //r.connect({
    //    host: 'localhost',
    //    port: 28015,
    //    db: 'resume'
    //}).then(function (conn) {
    //    app.listen(config.port)
    //
    //}).error(function (error) {
    //    console.error(error);
    //})





/*
 * fetch the resume json file from the specific path
 */
function getResume(name, cb) {
    fs.readFile(config.resumeDir + name + '.json', function (err, data) {
        cb(err, JSON.parse(data));
    });
}