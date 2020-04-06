// console.log('yess');
let first = true;
first && setTimeout(() => {
    first = false;
<<<<<<< HEAD
    window.calculate();        
}, 10);


=======
    // window.calculate();        
}, 10)
>>>>>>> 607fadfa611304f313de792f91e1f185afb1f278
window.calculate = () => {
    // [[1,3],[2,6],[8,10],[15,18]];
    // [[1,4],[0,1]] 
    // [[2,3],[4,5],[6,7],[8,9],[1,10]]
<<<<<<< HEAD
    const input = [0,1,0,2,1,0,1,3,2,1,2,1];
    const res =  leetcode(input);
=======
    const input = [186,419,83,408]; // [1, 2, 5];
    const another = 6249;
    const res =  leetcode(input, another);
>>>>>>> 607fadfa611304f313de792f91e1f185afb1f278
    console.log('res:', res);
    document.querySelector('#res').innerHTML = typeof res === 'object' ? JSON.stringify(res || {}) : res;
    
    window.name = 'global';
}
<<<<<<< HEAD

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
=======
 
var leetcode = function(coins, amount) {
    coins.sort((a, b) => b - a);
    let cache = {};
    let min = coins[coins.length - 1];
    let max = amount / min;
    function self(coins, amount, start = 0) {
        if (amount < 0) {
            return -1;
        }
        if (amount === 0) {
            return start;
        }
        if (cache[amount] !== undefined) {
            return cache[amount];
        }
        let count = start;
        let res = max;
        let change = false;
        for (let i = 0; i < coins.length; i++) {
            let next = amount - coins[i];
            if (next < 0) {
                continue;
            }
            const now = self(coins, next, count);
            // 如果now 增长，说明能兑换；
            if (now >= count) {
                change = true;
                res = Math.min(res, now + 1);
            }
        }
        cache[amount] =  change ? res : -1;
        return cache[amount];
    }

    return self(coins, amount, 0);
>>>>>>> 607fadfa611304f313de792f91e1f185afb1f278
};