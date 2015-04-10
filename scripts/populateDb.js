var fs = require('fs');
var r = require('rethinkdb');

var dir = __dirname + "/../resume/";

r.connect({
    host: 'localhost',
    port: 28015,
    db: 'resume'
}).then(function (conn) {
    r.db('resume')
        .tableCreate('resume')
        .run(conn, function (err, result) {
            if (err) console.log(err);
            console.log(result);

            fs.readdir(dir, function (err, files) {
                if (err) throw err;

                files.forEach(function (file) {
		    if(file.indexOf('~') > -1){
			return;
		    }
		    fs.readFile(dir + file, function (err, data) {
                        if (err) throw err;
                        var resume = JSON.parse(data);
                        var resumeObj = {
                            name: file.split('.')[0],
                            username: 'futureEmployer',
                            password: 'hiregrant2015',
                            resume: resume
                        }
                        r.table('resume')
                            .insert(resumeObj)
                            .run(conn, function (err, result) {
                                console.log(result);
                            });
                    });
                })

            });
        })
}).error(function (error) {
    console.error(error);
})