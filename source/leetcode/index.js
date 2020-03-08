// console.log('yess');
let first = true;
first && setTimeout(() => {
    first = false;
    window.calculate();        
}, 10)
window.calculate = () => {
    // [[1,3],[2,6],[8,10],[15,18]];
    // [[1,4],[0,1]] 
    // [[2,3],[4,5],[6,7],[8,9],[1,10]]
    const input = [[2,3],[2,2],[3,3],[1,3],[5,7],[2,2],[4,6]];
    const res =  leetcode(input);
    console.log('res:', res);
    document.querySelector('#res').innerHTML = typeof res === 'object' ? JSON.stringify(res || {}) : res;  
}

var leetcode = function(intervals) {
    let count = 0;
    // 排序；
    intervals.sort((a, b) => a[0] - b[0]);
    console.log('inter', intervals);
    function merge(arr) {
        if (count > arr.length - 2) {
            return intervals;
        };
        const [first, second] = arr.slice(count, count + 2);
        const [a, b] = first;
        const [c,d] = second;
        if (c > b) {
            count++;
        } else {
            second[0] = Math.min(a, c);
            second[1] = Math.max(b,d);
            arr.splice(count, 1);
        }
        merge(arr);
    }
    merge(intervals);
    return intervals;
};