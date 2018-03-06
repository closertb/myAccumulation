## Echarts图标自动轮播插件 ##
支持line,bar,map,scatter，radar系列的轮播,以前的RadarAutoTip.create=function (chart, target, option, autoOption)；已经被封装到autoShowTip.js中

### 引入autoShowTip.js文件 ###
支持imports,require或则script直接引用；

### 参数说明 ###
function AutoShowTip(chart, option, interval, params)
 - @parame chart ：     初始化后的echarts实例
 - @parame option ：    echarts对象的option配置
 - @parame interval ：  轮播间隔时间
 - @parame params ：    配置你自己的autoOption，可不设置
 针对于line,bar,map,scatter系列
  	 -params.loopSeries boolean类型，默认为false。true表示循环所有series的tooltip，false则显示指定seriesIndex的tooltip
  	 -params.seriesIndex（默认为0）指定某个系列（option中的series索引）循环显示tooltip，不指定则所有series都循环，当loopSeries为true时，默认从0开始，此属性无效
  	 -params.refreshOption 更新option配置的函数（主要是更新数据，刷新echarts）
  	 -params.isRefresh 轮播结束是否刷新（当总条数大于每页限制显示的条数则轮播时需要刷新echarts）
 针对于radar系列
     -params.hoverEnable: true, //是否开启hover效果
     -params.autoShow: true,  //是否开启自动轮播
     -params.formatter:''  //hover或则自动轮播显示数据的格式，formatter(v)，v中包含一个维度的text,max和value值；

### Echarts实例setOption后创建自动轮播 ###
const option = {...};
const chart = echart.init(domTarget);
chart.setOption(option);
new AutoShowTip(myChart,option,2000);

### 更多说明 ###
 由于本解决方案是模仿Echarts画了一个看不见的雷达图,但其半径生成的算法并为研究透，**所以雷达的半径需要数值直接指定**
 比如radius:60；关于指定了半径还怎么自适应，很简单啊，你在js中设定option参数的时候,就先把雷达的半径算好；
 更多使用说明请查看html文件
