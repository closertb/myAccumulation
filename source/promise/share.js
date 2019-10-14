/* shared.js: Shared Worker 代码 */
let data = null;
console.log('in');
onconnect = function (e) {
    const port = e.ports[0];
    console.log('init');
    port.onmessage =  function (event) {
        console.log('send', event);
        // get 指令则返回存储的消息数据
        if (event.data.get) {
            console.log('send');
            data && port.postMessage(data);
        }
        // 非 get 指令则存储该消息数据
        else {
            data = event.data;
        }
    }
    port.start();
};
