function addList() {
  const ulContainer = document.getElementById("list-with-big-data");

  // 防御性编程
  if (!ulContainer) {
    return;
  }

  const total = 10000; // 插入数据的总数
  const batchSize = 4; // 每次批量插入的节点个数，个数越多，界面越卡顿
  const batchCount = total / batchSize; // 批处理的次数
  let batchDone = 0; // 已完成的批处理个数

  function appendItems() {  
    // 使用 DocumentFragment 减少 DOM 操作次数，对已有元素不进行回流
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < batchSize; i++) {
      const liItem = document.createElement("li");
      liItem.innerText = batchDone * batchSize + i + 1;
      fragment.appendChild(liItem);
    }

    // 每次批处理只修改 1 次 DOM
    ulContainer.appendChild(fragment);
    batchDone++;
    // doAppendBatch();
  }

  function doAppendBatch() {
    if (batchDone < batchCount) {
      // 在重绘之前，分批插入新节点
      window.requestAnimationFrame(appendItems);
    }
  }
  const clear = mockSetInterval(() => {
    if (batchDone >= batchCount) {
      // 在重绘之前，分批插入新节点
      clear();
    }
    appendItems();
  });
  // kickoff
  // doAppendBatch();

  // 使用 事件委托 ，利用 JavaScript 的事件机制，实现对海量元素的监听，有效减少事件注册的数量
  ulContainer.addEventListener("click", function(e) {
    const target = e.target;

    if (target.tagName === "LI") {
      alert(target.innerText);
    }
  });
};