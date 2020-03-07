// console.log('yess');

const sharedWorker = new SharedWorker('share.js');
// 监听 get 消息的返回数据
sharedWorker.port.onmessage = (e) => {
    const data = e.data;
    const text = '[temp receive] ' + data.msg + ' —— tab ' + data.from;
    console.log('[Shared Worker] receive message:', text);
};
sharedWorker.port.start();