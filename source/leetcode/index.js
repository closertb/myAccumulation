// console.log('yess');

window.calculate = () => {
    const input = [2,0,1,0,0,2,1,1,2,0];
    return leetcode(input);
}

var leetcode = function(nums) {
    const length = nums.length - 1;
    let start = 0;
    let end = length;
    let sval;
    let eval;
    function swap(start, end) {
        const temp = nums[start];
        nums[start] = nums[end];
        nums[end] = temp; 
    }
    while(start <= length && end >= 0) {
        let [sval, eval] = start < end ? [nums[start], nums[end]] : [nums[end], nums[start]];
        if (sval > 0 && sval <= eval) {
            end--;
        } else if(sval === 0) {
            start++;
        } else {
            swap(start, end);
            start++
        }
    }
    return nums;
};