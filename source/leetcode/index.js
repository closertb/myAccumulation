// console.log('yess');
let first = true;
first && setTimeout(() => {
    first = false;
    window.calculate();        
}, 10);


window.calculate = () => {
    // [[1,3],[2,6],[8,10],[15,18]];
    // [[1,4],[0,1]] 
    // [[2,3],[4,5],[6,7],[8,9],[1,10]]
    const input = [0,1,0,2,1,0,1,3,2,1,2,1];
    const res =  leetcode(input);
    console.log('res:', res);
    document.querySelector('#res').innerHTML = typeof res === 'object' ? JSON.stringify(res || {}) : res;
    
    window.name = 'global';
}

var leetcode = function stackDecrese(height) {
    const stack = [];
    let res = 0;
    let top = { index: 0, value: height[0] };

    stack.push({ index: 0, value: height[0] });

    for (let i = 1; i < height.length; i++) {
        let target = height[i];

        while(top && target > top.value) {
            top = stack.pop();
            if (!top) {
                break;
            }
            const next = stack[stack.length - 1];
            if (next) {
              const min = Math.min(next.value, target);
              res += (min - top.value) * (i - 1 - next.index);
            }
            top = next;
        }

        top = { index: i, value: target };
        stack.push(top);
    }

    return res;
};