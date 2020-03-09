var gulp = require('gulp'),
    rename = require("gulp-rename"),
    through2 = require('through2'),
    runSequence = require('run-sequence');
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
        commonPicker:{  //Picker组件
            path:'./commonWidgets/commonPicker/'
        },
        taskFlow:{  //流程编辑器
            path:'commonWidgets/task-flow/'
        },
        list:{  //流程编辑器
            path:'commonWidgets/list/'
        },
        listSpecial:{  //流程编辑器
            path:'commonWidgets/list-special/'
        },
        listSimple:{  //流程编辑器
            path:'commonWidgets/list-simple/'
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
    D3Render: {  //three.js学习相关
      path: 'threed/',
      threed: {
        path: 'D3Render/threed/'
      },
      jd: {
        path: 'D3Render/jd/'
      },
      baseGl: {
        path: 'D3Render/baseGl/'
      }
    },
    test:{  //测试类组件，不同步git
        path:'test/',
        ZrenderTest:{
            path:'test/ZrenderTest/'
        },
        g2Test:{
            path:'test/g2Test/'
        },
        mapTest:{
            path:'test/mapTest/'
        },
        threeStart:{
            path:'test/threeStart/'
        },
        threeWidget:{
            path:'test/threeWidget/'
        },
        esLearn:{
            path:'test/esLearn/'
      },
      zepto: {
        path: 'test/rotateNav/'
      }
    },
    source: {
        promise: {
            path: 'source/promise/'
        },
        leetcode: {
            path: 'source/leetcode/'
        }
    }
}


var editPath = path.source.leetcode.path;  //要使用服务的组件路径

function filterEmpty(arr){
    return arr.filter((item) =>{
        if(item.sub.length > 0){
            item.sub = filterEmpty(item.sub);
        }
        return item.name.indexOf('——') === -1;
    })
}
function createJs(){
    return through2.obj(function(file, encoding, done){
        let content =String(file.contents);
        let json = JSON.parse(content);
        json = filterEmpty(json);
        file.contents = new Buffer(JSON.stringify(json));
        this.push(file);
        done();
    })
}
gulp.task('made', function(){
    return gulp.src(editPath+'city.js')
        .pipe(createJs())
        .pipe(rename('newCity.js'))
        .pipe(gulp.dest("test"));

}); 

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
    return gulp.src(editPath+'*.js')
   //     .pipe(babel({       //es6语法编译
    //        presets: [es]
      //  }))
        .pipe(gulp.dest(editPath));
});

gulp.task('watch', function () {
    browserSync.init({
        port: 80,
        server: {
            baseDir: [editPath]
        }
    });
    //监控文件变化，自动更新
    gulp.watch([editPath+'*.html'], function () {
        browserSync.reload();
    });
/*    gulp.watch([editPath+'css/extend.scss'], function () {
        runSequence('spCss',browserSync.reload);
    });*/
    //监控文件变化，自动更新
    gulp.watch([editPath+'index.js'], function () {
        runSequence('jsMin',browserSync.reload);
    });
});
//启动热更新
gulp.task('default', gulp.parallel(['jsMin', 'watch']));