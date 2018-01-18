var gulp = require('gulp'),
    babel = require('gulp-babel'),
    es = require('babel-preset-es2015'),
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

var path ={
    awesomeCanvas:{  //炫酷canvas组件
        animateNav:{  //星星闪烁，流星飞逝组件
            path:'awesomeCanvas/animateNav'
        },
        rotateBall:{  //3D旋转球组件
            path:'awesomeCanvas/rotateBall/'
        },
        bubbling:{  //柱状冒泡组件
            path:'awesomeCanvas/bubbling/'
        },
        weatherDrop:{  //动态雨雪天气组件
            path:'awesomeCanvas/weatherDrop/'
        },
        path:'awesomeCanvas/'
    },
    commonWidgets:{  //通用组件
        uedCityPicker:{  //省市区三级联动
            path:'./commonWidgets/uedCityPicker/'
        },
        taskFlow:{  //流程编辑器
            path:'commonWidgets/task-flow/'
        },
        path:'awesomeCanvas/'
    },
    specialWidgets:{  //订制类组件
        EchartsRadarAutoTip:{  //Echarts雷达图单轴hover组件
            path:'specialWidgets/EchartsRadarAutoTip/'
        },
        questionaire:{  //Echarts雷达图单轴hover组件
            path:'specialWidgets/questionaire/'
        },
        path:'specialWidgets/'
    },
    tempModule:{  //组件开发模板
        path:'tempModule/'
    },
    test:{  //测试类组件，不同步git
        path:'test/',
        ZrenderTest:{
            path:'test/ZrenderTest/'
        },
        g2Test:{
            path:'test/g2Test/'
        },
        threeStart:{
            path:'test/threeStart/'
        },
        threeWidget:{
            path:'test/threeWidget/'
        }
    }
}

var editPath = path.awesomeCanvas.bubbling.path;  //要使用服务的组件路径
/**
 * name:新建组件的文件夹名称
 * eg: 一级目录组件创建 gulp create --name dirName 依据指定的微件文件夹名称生成对应的微件
 * eg: 二级目录组件创建 gulp create --name awesomeCanvas/uedPse
 * */
gulp.task('create', function () {
    var widgetName = '';
    if (!gulp.env.name || gulp.env.name === true) {
        console.error('输入的文件名不能为空');
        return;
    } else {
        widgetName = gulp.env.name;
    }
    return gulp.src(path.tempModule.path+'*')
        .pipe(gulp.dest( widgetName + '/'));
});
gulp.task('revCss', function () {
    console.log('start');
    return gulp.src(editPath+'index.scss')
        .pipe(sass())//{compatibility: 'ie8'}minifyCss()
        .pipe(gulp.dest(editPath));

});
gulp.task('spCss', function () {
    console.log('start');
    return gulp.src(editPath+'css/extend.scss')
        .pipe(sass())//{compatibility: 'ie8'}minifyCss()
        .pipe(gulp.dest(editPath+'css/'));

});

gulp.task('jsMin', function () {
    return gulp.src(editPath+'index.js')
   //     .pipe(babel({       //es6语法编译
    //        presets: [es]
      //  }))
    //    .pipe(uglify())//{compatibility: 'ie8'}
        .pipe(rename('index.min.js'))
        .pipe(gulp.dest(editPath));
});
//启动热更新
gulp.task('default', function () {
    runSequence(
        "revCss","jsMin"    //,"spCss"
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
/*    gulp.watch([editPath+'css/extend.scss'], function () {
        runSequence('spCss',browserSync.reload);
    });*/
    //监控文件变化，自动更新
    gulp.watch([editPath+'index.html'], function () {
        runSequence('revCss',browserSync.reload);
    });
    //监控文件变化，自动更新
    gulp.watch([editPath+'index.js'], function () {
        runSequence('jsMin',browserSync.reload);
    });
});