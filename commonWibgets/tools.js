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