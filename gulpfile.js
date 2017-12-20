var gulp = require('gulp'),
    reqOptimize = require('gulp-requirejs-optimize'),
    rename = require("gulp-rename"),
    contact = require('gulp-concat'),
    rev = require('gulp-rev'),
    filter = require('gulp-filter'),
    through2 = require('through2'),
    clean = require('gulp-clean'),
    uglify = require('gulp-uglify'),
    runSequence = require('run-sequence'),
    sass = require('gulp-sass'),
    minifyCss = require('gulp-minify-css');
var browserSync = require("browser-sync").create();//创建服务

var editPath = './uedCityPiker/';  //./awesomeCanvas/animateNav/
gulp.task('revCss', function () {
    console.log('start');
    return gulp.src(editPath+'*.scss')
        .pipe(sass())//{compatibility: 'ie8'}minifyCss()
        .pipe(gulp.dest(editPath));

});
//启动热更新
gulp.task('default', function () {
    runSequence(
        "revCss"
    );
    browserSync.init({
        port: 80,
        server: {
            baseDir: [editPath]
        }
    });
    //监控文件变化，自动更新
    gulp.watch([editPath+'*.scss'], function () {
        runSequence('revCss',browserSync.reload);
    });
    //监控文件变化，自动更新
    gulp.watch([editPath+'index.html',editPath+'*.js'], function () {
        runSequence('revCss',browserSync.reload);
    });
})