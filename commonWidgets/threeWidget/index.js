/**
 * Title:
 * @author Mr Denzel
 * @create Date 2017-12-25 14:07
 * @version 1.0
 * Description:
 */
/**
 *作用：用于坐标系数据最大值与最小值的处理，向上与向下取整；
 *@params:arr 坐标系中要显示的数组；
 *@params:spiltNum 坐标系可接受的最大间隔线；
 */
var image = document.createElement('image');
image.width = 700;
image.height = 500;
image.src = 'bg.jpg';
var chart =echarts.init(document.getElementById('chart'));
var categoryData = [];
var seriesData = [300,600,700,450,380,400,290];
var errorData = [];
var barData = [];
var defaultData = errorData.map(function (t) {
    return [t[0],50,0,0];
});
for (var i = 0; i < seriesData.length; i++) {
    var val = seriesData[i];
    categoryData.push('category' + i);
    errorData.push([
        i,
        seriesData[i],
        seriesData[i]*0.56,
    ]);
    barData.push(echarts.number.round(val, 2));
}
var defaultData = errorData.map(function (t) {
    return [t[0],0,0];
});
function DrawVessel(chart,option,seriesIndex) {
    seriesIndex = seriesIndex===undefined?0:seriesIndex;
    this.max = 0;
    this.chart = chart;
    this.option = option;
    this.serie = option.series[seriesIndex];
    this.serie.renderItem = this.render;
    this.init();
    this.serie.data = this.originData;
    this.chart.setOption(option);
}
DrawVessel.prototype = {
    init:function () {
        this.originData = this.serie.data.map(function (t) {
            return t;
        });
        var defaultData = this.serie.data.map(function (t) {
            return [t[0],0,0];
        });
        this.setYaxis(this.originData,5);
        this.serie.data = defaultData;
        this.chart.setOption(this.option);
    },
    setYaxis:function (sour,splitNum) {
        var spiltFlag = (splitNum !== undefined && Number(splitNum) > 1) ? true : false;
        /*向上取整*/
        splitNum = Number(splitNum);
        var arr = sour.map(function (t) {
            return t[1];
        });
        function getCeilInteger(num) {
            if (num <= 10) {  //处理小于10的情况；
                if (num < 5) {
                    return 5;
                }
                return 10;
            }
            if (num < 90) {  //处理小于10的情况；
                return (Math.floor(num / 10) + 1) * 10;
            }
            var str = num.toString();
            (!spiltFlag) && (str = Math.round(num * (1 + 0.1 / str.length)).toString());

            var firNum = Number(str.charAt(0)), secNum = Number(str.charAt(1));
            if (secNum < 5 && str.length > 3) {  //处理大于1000的情况
                secNum = 5;
            } else if (Number(str) < 190 && Number(str) >= 100) {   //处理大于100小于200的情况,就是最后一位直接取0；
                secNum = secNum + 1;
            } else {
                secNum = 0;
                firNum = firNum + 1;
            }
            return firNum * Math.pow(10, str.length - 1) + secNum * Math.pow(10, str.length - 2);
        }

        /*向下取整*/
        function getFloorInteger(num) {
            var str = num.toString();
            if (num <= 100) {
                return 0;
            }
            var firNum = Number(str.charAt(0)), secNum = Number(str.charAt(1));
            if (secNum > 5 && str.length > 2) {
                secNum = 5;
            } else {
                secNum = 0;
            }
            return firNum * Math.pow(10, str.length - 1) + secNum * Math.pow(10, str.length - 2);
        }

        var temp = arr.concat([]);
        (temp.length === 1) && (temp.push(0))
        temp = temp.sort(function (a, b) {
            return b - a
        }); //降序排列；
        temp = temp.map(function (t) {
            return Math.round(t);
        });
        var originMax = temp[0];
        var max = getCeilInteger(originMax); //这里没有使用shift的原因是，传过来的数组长度可能为1;
        var min = getFloorInteger(temp.pop());
        if (max === min && max > 0) {  //处理传过来的数组只有一个数的情况；
            min = 0;
        }
        var spiltValue;
        if (spiltFlag) {   //处理有固定分割线的情况，重置最大值，保证间隔值为整数
            spiltValue = (max - min) / splitNum;
            if (spiltValue % 10) {
                spiltValue = getCeilInteger(Math.round(spiltValue));
                max = min + spiltValue * splitNum;
                while (max * 3 > originMax * 5) {
                    splitNum = splitNum - 1;
                    max = min + spiltValue * splitNum;
                }
            }
        }
        if(max !== this.max){
            this.option.yAxis.max = max;
            this.max = max;
        }
    },
    update:function (source,category) {
        category && (this.option.xAxis.data = category);
        this.setYaxis(source);
        this.serie.data = source;
        this.chart.setOption(this.option);
    },
    render:function (params, api){
        var xValue = api.value(0);
        var barLayout = api.barLayout({
            count: 1,barCategoryGap:'40%'
        });
        var halfWidth =barLayout[0].width /2,
            point = api.coord([xValue, api.value(1)]),
            pointX = point[0],
            pointY = point[1],
            pointZero = api.coord([xValue,0])[1],
            pointPercent= api.coord([xValue, api.value(2)])[1],
            offsetWidth = halfWidth;
        var posTop={
            lt:[pointX - halfWidth/3, pointY-offsetWidth],
            lb:[pointX - halfWidth,pointY],
            rt:[pointX+5*halfWidth/3,pointY-offsetWidth],
            rb:[pointX + halfWidth,pointY]
        },posBot={
            lt:[pointX - halfWidth/3, pointZero-offsetWidth],
            lb:[pointX - halfWidth,pointZero],
            rb:[pointX+ halfWidth,pointZero],
            rt:[pointX +5*halfWidth/3,pointZero-offsetWidth]
        },posFill={
            lt:[pointX - halfWidth/3, pointPercent-offsetWidth],
            lb:[pointX - halfWidth,pointPercent],
            rb:[pointX+ halfWidth,pointPercent],
            rt:[pointX +5*halfWidth/3,pointPercent-offsetWidth]
        };
        var linerColor = new echarts.graphic.LinearGradient(0, 0, 1, 1, [{
            // 0% 处的颜色
            offset: 0, color: 'rgb(4,145,229)'  },
            {
                // 100% 处的颜色
                offset: 1, color: 'rgb(112,198,239)'
            }], false);

        var style = api.style({
            stroke: '#7ecef4',
            fill: null
        });
        var stylefill = api.style({
            stroke: null,
            fill: linerColor
        });
        var axis =[
            {   //顶面
                type: 'polygon',
                shape:{
                    points: [posTop.lb,posTop.lt,posTop.rt,posTop.rb]
                },
                style: style
            },{   //底面
                type: 'polygon',
                shape:{
                    points: [posBot.lb,posBot.lt,posBot.rt,posBot.rb]
                },
                style: style
            },{  //右侧侧面
                type: 'line',
                shape:{
                    x1: posTop.rt[0],
                    y1: posTop.rt[1],
                    x2: posBot.rt[0],
                    y2: posBot.rt[1]
                },
                style: style
            },{  //左侧面线
                type: 'line',
                shape:{
                    x1: posTop.lt[0],
                    y1: posTop.lt[1],
                    x2: posBot.lt[0],
                    y2: posBot.lt[1]
                },
                style: style
            },{  //填充右侧面
                type: 'polygon',
                shape:{
                    points: [posFill.rb,posFill.rt,posBot.rt,posBot.rb]
                },
                style: stylefill
            },{  //填充近屏面
                type: 'polygon',
                shape:{
                    points: [posFill.lb,posFill.rb,posBot.rb,posBot.lb]
                },
                style: stylefill
            },    //填充面顶面
            {
                type: 'polygon',
                shape:{
                    points: [posFill.lb,posFill.lt,posFill.rt,posFill.rb]
                },
                style: {
                    fill:'rgba(4,145,229,.8)',
                    stroke:'#159ff2'
                }
            },    //填充面顶面
            {
                type: 'image',
                shape:{
                    cx:pointX+halfWidth/3,
                    cy:pointPercent,
                    r:1
                },
                style: {
                    image:'./star.png',
                    x:pointX-halfWidth,
                    y:pointPercent-halfWidth*1.5,
                    width:3*halfWidth,
                    height:halfWidth*2,
                    shadowBlur:2,
                    shadowColor:'red'
                }
            },{  //近屏面
                type: 'polygon',
                shape:{
                    points: [posTop.lb,posTop.rb,posBot.rb,posBot.lb]
                },
                style: style
            }];
        console.log(axis);
        return {
            type: 'group',
            children: axis
        };
    }
};

var option = {
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
    },
    backgroundColor:{  //'rgba(19,37,70,.95)'
        color:{
            image:image,
            repeat:'no-repeat'
        }
    },
    title: {
        text: 'Error bar chart'
    },
    xAxis: {
        data: categoryData
    },
    yAxis: {
        splitLine:{
            show:false
        },
        axisLine:{
            lineStyle:{
                color:'#1f252b'
            }
        }
    },
    series: [ {
        type: 'custom',
        name: 'error',
        itemStyle: {
            normal: {
                borderWidth: 1.5
            }
        },
        renderItem: '',
        encode: {
            x: 0,
            y: [1, 2]
        },
        data: errorData,
        z: 100,
        animationEasing: 'elasticOut',
        animationEasingUpdate:'linear'
    }]
};
/*
option.yAxis.max = 700;
chart.setOption(option);

option.series[0].data = errorData;
chart.setOption(option);*/

var el = new DrawVessel(chart,option);

//el.update(source,category);

/*
setTimeout(function () {
    var newData=[],category=[];
    var series = [700,450,380,400,290,800,500];
    for (var i = 0; i < series.length; i++) {
        var val = series[i];
        newData.push([
            i,
            val,
            val*0.68,
        ]);
    }
    el.update(newData);
},1000);*/
