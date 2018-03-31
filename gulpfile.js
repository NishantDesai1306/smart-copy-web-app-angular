var gulp = require('gulp');
var gutil = require("gulp-util");
var sass = require('gulp-sass');
var browerSync = require('browser-sync').create();
var refresh = browerSync.reload;
var nodemon = require('gulp-nodemon');
var webpack = require('webpack');

gulp.task('server', function() {
    nodemon({
        script: './server/server.js',
        watch: ["./server"],
        ext: 'js'
    })
    .on('restart', function() {
        console.log('\n\nRESTARTING SERVER\n\n');
    });
});

gulp.task("webpack", function() {
    webpack(require('./webpack.config.js'), function(err, stats) {
        if(err) throw new gutil.PluginError("webpack", err);
        gutil.log("[webpack]", stats.toString({
            // output options
        }));
    });
});

var compileSass = function() {
 return gulp.src('./client/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./dist'));
};
gulp.task('sass', function () {
  return compileSass();
});
 
gulp.task('sass:watch', function () {
    compileSass();
    gulp.watch('./client/**/*.scss', ['sass']);
});

// gulp.task('serve', function() {
//     browerSync.init({
//         server: './dist',
        
//     });
//     gulp.watch('./client/**/*.scss').on('change', browerSync.reload);    
// });

gulp.task('default', ['sass:watch', 'webpack', 'server']);