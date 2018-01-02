## Echarts雷达图单轴hover和轮播使用说明 ##

### 第一步 引入RadarAutoTip.js文件 ###
代码支持imports,require或则script直接引用；

### 第一步 Echarts实例setOption后创建自动轮播 ###
使用用例详见html文件

        RadarAutoTip.create=function (chart, target, option, autoOption)；
        /**给初始化后的echarts对象绑定一个自动轮播的属性
         * @parame chart ：初始化后的echarts对象
         * @parame target ：echarts对象挂载的dom元素,仅支持原生Dom选择
         *   eg:document.getElementById('highOpinionChart'),document.querySelector('.highOpinionChart')
         * @parame option ： echarts对象的option配置
         * @parame autoOption ：配置你自己的autoOption
         */
例如例子中的：
        myChart.setOption(option);
        RadarAutoTip.create(myChart,target, option, radarAutoInfo);

 ### 第三步其他说明 ###
     autoOption详细配置说明：
     {
         hoverEnable: true, //是否开启hover效果
         autoShow: true,  //是否开启自动轮播
         time: 2000,  //自动轮播间隔，默认1000ms
         formatter:''  //hover或则自动轮播显示数据的格式，formatter(v)，v中包含一个维度的text,max和value值；
     }

 由于本解决方案是模仿Echarts画了一个看不见的雷达图,但其半径生成的算法并为研究透，**所以雷达的半径需要数值直接指定**
 比如radius:60；
 关于指定了半径还怎么自适应，很简单啊，你在js中设定option参数的时候,就先把雷达的半径算好；
