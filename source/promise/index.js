// promise 三个状态
const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

let count = 1;

class Promize {
  constructor(task) {
    // console.log('task', task);
    this.task = task;
    this.status = PENDING;
    this.value = undefined;
    this.reason = undefined;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];
    this._resolve = this._resolve.bind(this);
    this._reject = this._reject.bind(this);
   
    try {
      // console.log('step 1');
      task(this._resolve, this._reject);
    } catch (e) {
      this._reject(e);
    }
  }
  _resolve(value) { // value成功态时接收的终值
    const that = this;
    // console.log('step 2', value, value instanceof Promize);
    if(value instanceof Promize) {
        return value.then(this._resolve, this._reject);
    }
    // 为什么resolve 加setTimeout?
    // 2.2.4规范 onFulfilled 和 onRejected 只允许在 execution context 栈仅包含平台代码时运行.
    // 注1 这里的平台代码指的是引擎、环境以及 promise 的实施代码。实践中要确保 onFulfilled 和 onRejected 方法异步执行，且应该在 then 方法被调用的那一轮事件循环之后的新执行栈中执行。
  
    setTimeout(() => {
        // console.log('next step 1');
        // 调用resolve 回调对应onFulfilled函数
        if (that.status === PENDING) {
            // 只能由pending状态 => fulfilled状态 (避免调用多次resolve reject)
            that.status = FULFILLED;
            that.value = value;
            that.onFulfilledCallbacks.forEach(cb => cb(that.value));
        }
    });
  }
  _reject(reason) { // reason失败态时接收的拒因
    const that = this;
    setTimeout(() => {
        // 调用reject 回调对应onRejected函数
        if (that.status === PENDING) {
            // 只能由pending状态 => rejected状态 (避免调用多次resolve reject)
            that.status = REJECTED;
            that.reason = reason;
            that.onRejectedCallbacks.forEach(cb => cb(that.reason));
        }
    });
  }
  _resolvePromise(nextThen, nextPromise, resolve, reject) {
    if (nextThen === nextPromise) {  // 如果从onFulfilled中返回的x 就是promise2 就会导致循环引用报错
        return reject(new TypeError('循环引用'));
    }

    let called = false; // 避免多次调用
    // 如果x是一个promise对象 （该判断和下面 判断是不是thenable对象重复 所以可有可无）
    if (nextPromise instanceof Promize) { // 获得它的终值 继续resolve
        if (nextPromise.status === PENDING) { // 如果为等待态需等待直至 nextPromise 被执行或拒绝 并解析y值
            nextPromise.then(y => {
                nextPromise._resolvePromise(nextThen, y, resolve, reject);
            }, reason => {
                reject(reason);
            });
        } else { // 如果 nextPromise 已经处于执行态/拒绝态(值已经被解析为普通值)，用相同的值执行传递下去 promise
            nextPromise.then(resolve, reject);
        }
        // 如果 nextPromise 为对象或者函数
    } else if (nextPromise != null && ((typeof nextPromise === 'object') || (typeof nextPromise === 'function'))) {
        try { // 是否是thenable对象（具有then方法的对象/函数）
            let then = nextPromise.then;
            if (typeof then === 'function') {
                then.call(nextPromise, y => {
                    if(called) return;
                    called = true;
                    nextPromise._resolvePromise(nextThen, y, resolve, reject);
                }, reason => {
                    if(called) return;
                    called = true;
                    reject(reason);
                })
            } else { // 说明是一个普通对象/函数
                resolve(nextPromise);
            }
        } catch(e) {
            if(called) return;
            called = true;
            reject(e);
        }
    } else {
        resolve(nextPromise);
    }
  }
  then(onResolve = (value) => value, onReject = (reson) => reason) {
    let newPromise;
    const that = this;
    if (this.status === FULFILLED) { // 执行完成
      return newPromise = new Promize((resolve, reject) => {
        setTimeout(() => {
          try {
            let x = onResolve(that.value);
            that._resolvePromise(newPromise, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      });
    }

    if (this.status === REJECTED) { // 执行完成
      return newPromise = new Promize((resolve, reject) => {
        setTimeout(() => {
          try {
            let x = onReject(that.reason);
            that._resolvePromise(newPromise, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      });
    }

    if (this.status === PENDING) {
      return newPromise = new Promize((resolve, reject) => {
        that.onFulfilledCallbacks.push((value) => {
          try {
            let x = onResolve(value);
            that._resolvePromise(newPromise, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
        that.onRejectedCallbacks.push((reason) => {
          try {
            let x = onReject(reason);
            that._resolvePromise(newPromise, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      });
    }
  }
  catch(errFun) {
    this.then(undefined, errFun);
  }
}



function create(p, flag) {
  return new Promize((rel, rej) => {
    setTimeout(() => {
      if(flag === 0) {
        rej(p + ' fail');
      } else {
        rel(p + ' ok')
      }
    }, 1000);
  });
}

create('p0', 1).then((info) => {
  console.log('resolve:', info);
  return create('p1', 0);
}, (error) => {
  console.log('reject:', error);
}).catch((error) => {
  console.log('rej:', error);
});