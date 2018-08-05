/**
 * Created by Molay on 15/10/30.
 */
var PI = Math.PI, DP = PI * 2, HP = PI / 2;
var UA = PI / 180, AU = 1 / UA;

WS.MathUtil = function () {
};
/*
* @rho x
* @phi y
* theta z
* */
WS.MathUtil.calculateSpherePosition = function (rho, phi, theta) {
    var vector3 = new THREE.Vector3();
    vector3.x = rho * Math.sin(phi) * Math.cos(theta);
    vector3.z = rho * Math.sin(phi) * Math.sin(theta);
    vector3.y = rho * Math.cos(phi);
    return vector3;
};
WS.MathUtil.clamp = function (min, n, max) {
    if (min > max)
    {
        var t = min;
        min = max;
        max = t;
    }
    return Math.min(Math.max(n, min), max);
};
WS.MathUtil.calculateStartIndex = function (numbers, number, cycle) {
    var startIndex;
    for (var i = numbers.length - 1; i >= 0; i--) {
        if (numbers[i] <= number) {
            startIndex = i;
            break;
        }
    }
    if (isNaN(startIndex) && cycle) startIndex = numbers.length - 1;
    return startIndex;
};
WS.MathUtil.calculateEndIndex = function (numbers, number, cycle) {
    var endIndex;
    for (var i = 0; i < numbers.length; i++) {
        if (numbers[i] >= number) {
            endIndex = i;
            break;
        }
    }
    if (isNaN(endIndex) && cycle) endIndex = 0;
    return endIndex;
};