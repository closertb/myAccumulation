// console.log('yess');
let first = true;
first && setTimeout(() => {
    first = false;
    // window.calculate();        
}, 10)
window.calculate = () => {
    // [[1,3],[2,6],[8,10],[15,18]];
    // [[1,4],[0,1]] 
    // [[2,3],[4,5],[6,7],[8,9],[1,10]]
    const input = [186,419,83,408]; // [1, 2, 5];
    const another = 6249;
    const res =  leetcode(input, another);
    console.log('res:', res);
    document.querySelector('#res').innerHTML = typeof res === 'object' ? JSON.stringify(res || {}) : res;  
}
 
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
};