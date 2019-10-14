const sharedWorker = new SharedWorker('share.js');
sharedWorker.port.start();

document.querySelector('#test4').addEventListener('click', () => {
  sharedWorker.port.postMessage({ get: true });
  console.log('send 4 data');
});

// 监听 get 消息的返回数据
sharedWorker.port.onmessage = (e) => {
   const data = e.data;
   const text = '[index receive] ' + data.msg + ' —— tab ' + data.from;
   console.log('[Shared Worker] receive message:', text);
};