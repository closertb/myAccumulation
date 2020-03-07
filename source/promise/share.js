/** shared.js: Shared Worker 代码 
* Shared Workers don't have a window object so alert, console.log, etc will not work
* 关于构造函数：new SharedWorker(jsPath，workName);
* 第二个workName其实很重要，如果在不同页面采用相同的name，那么这几个页面就共享worker
* 如果页面workname不同，那么他们的worker就是独立的，只是共享了处理代码逻辑
*/
let post = { data: { msg: 'yes', from: 'worker' } };
onconnect = function (e) {
    const port = e.ports[0];
    port.onmessage =  function (event) {
        // console.log('send', event);
        //get 指令则返回存储的消息数据
        if (event.data.get) {
            // console.log('send');
            post.data && port.postMessage(post.data);
            post.data = undefined;
        }
        // // 非 get 指令则存储该消息数据
        else {
            // data = event.data;
            post.data = event.data.data;
            port.postMessage(post.data);
        }
    }
    port.start();
};
