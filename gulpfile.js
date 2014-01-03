var util = require('util');
    node_static = require('node-static'),
    gulp = require('gulp'),
    gulpUtil = require('gulp-util');
    // lr = require('tiny-lr'),
    pkg = require('./package.json'),
    jshint = require('gulp-jshint'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    // refresh = require('gulp-livereload'),
    template = require('gulp-template'),
    _ = require('lodash'),

    appServer = require('http').createServer(function (request, response) {
        var static = new node_static.Server('./dist')
        request.addListener('end', function () {
            static.serve(request, response);
        }).resume();
    }).listen(8080);


    // createServers = function (port, lrport) {
    //     var lrServer = lr(),
    //     staticServer = new static.Server('./dist'),
    //     app;

    //     lrServer.listen(lrport, function (err) {
    //         if (err) { return gulpUtil.log(err); }
    //         gulpUtil.log('Live reload listening on port ' + lrport);
    //     });

    //     appServer = require('http').createServer(function (request, response) {
    //         request.addListener('end', function () {
    //             staticServer.serve(request, response);
    //         }).resume();
    //     }).listen(port);

    //     return {
    //         lr: lrServer,
    //         app: appServer
    //     }
    // },

    // servers = createServers(8080, 35729);

pkg = _.extend(pkg, {
    date: (function (d) {
        return util.format('%d/%d/%d', d.getFullYear(), d.getMonth(), d.getDate());
    })(new Date()),
    env: 'dev',
    selDOMjs: pkg.name + '.js',
    selDOMjs_min: pkg.name + '.min.js',
    selDOMjs_ref: (pkg.env === 'prod') ? pkg.selDOMjs_min : pkg.selDOMjs
});

// Lint JS
gulp.task('lint', function() {
  gulp.src('./src/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// Template Replace, Concat & Minify JS
gulp.task('minify', function(){
    gulp.src(['./src/*.js'])
        .pipe(template(pkg))
        .pipe(concat(pkg.name + '.js'))
        .pipe(gulp.dest('./dist'))
        .pipe(rename(pkg.name + '.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist'));
});

// Default
gulp.task('default', function(){
    gulp.watch("./src/*.js", function(event) {
        gulp.run('lint', 'minify');
        gulpUtil.log(gulpUtil.colors.cyan(event.path), 'changed');
        // servers.lr.changed({
        //     body: {
        //         files: [event.path]
        //     }
        // });
    });
    gulp.run('lint', 'minify');
});