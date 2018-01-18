/**
 * Title:
 * @author Mr Denzel
 * @create Date 2017-10-13 13:04
 * @version 1.0
 * Description:
 */

/**
 *name:计算输入字符占的dom相素
 *@params:输入字符
 *@params:字体大小
 *@params:
 */
function calStrLength(str,single) {
    var l =0,res;
    //检测汉字：
    res = str.match(/[^\x00-\xff]/g)
    res && (l =l+res.length*single);
    //检测数字；
    res = str.match(/[\x00-\xff]/g)
    res && (l =l+res.length*(single/2+1));
    //排除英文冒号和小数点。其只占1/4字节；
    res = str.match(/[\.:]/g);
    res && (l =l - res.length*Math.round(single/4));
    return l;
}

//低版本浏览器不支持一些操作
if (!String.prototype.trim) {
    String.prototype.trim = function () {
        return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    }
}

if (!Array.prototype.forEach) {
    Array.prototype.forEach = function (fun /*, thisp*/) {
        var len = this.length;
        if (typeof fun != "function")
            throw new TypeError();
        var thisp = arguments[1];
        for (var i = 0; i < len; i++) {
            if (i in this)
                fun.call(thisp, this[i], i, this);
        }
    };
}

if (!Array.prototype.filter) {
    Array.prototype.filter = function (fun /*, thisArg */) {
        "use strict";
        if (this === void 0 || this === null)
            throw new TypeError();
        var t = Object(this);
        var len = t.length >>> 0;
        if (typeof fun !== "function")
            throw new TypeError();
        var res = [];
        var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
        for (var i = 0; i < len; i++) {
            if (i in t) {
                var val = t[i];
                if (fun.call(thisArg, val, i, t))
                    res.push(val);
            }
        }
        return res;
    };
}

if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (obj) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == obj) {
                return i;
            }
        }
        return -1;
    }
}

Array.prototype.remove = function(val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};

/**
 *作用：用于坐标系数据最大值与最小值的处理，向上与向下取整；
 *@params:arr 坐标系中要显示的数组；
 *@params:spiltNum 坐标系可接受的最大间隔线；
 */

function getMaxAndMin(arr, spiltNum) {
    var spiltFlag = (spiltNum !== undefined && Number(spiltNum) > 1) ? true : false;
    /*向上取整*/
    spiltNum = Number(spiltNum);
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
        spiltValue = (max - min) / spiltNum;
        if (spiltValue % 10) {
            spiltValue = getCeilInteger(Math.round(spiltValue));
            max = min + spiltValue * spiltNum;
            while (max * 3 > originMax * 5) {
                spiltNum = spiltNum - 1;
                max = min + spiltValue * spiltNum;
            }

        }
    }
    return {
        max: max,
        min: min,
        interval: spiltValue
    };
}