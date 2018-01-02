/**
 * Title:
 * @author Mr Denzel
 * @create Date 2017-12-25 14:07
 * @version 1.0
 * Description:
 */
var nameInput = document.querySelector('#node-name-input'),
    descInput = document.querySelector('#node-desc-input'),
    saveSequence = document.querySelector('.side-content .edit-sequence-save'),
    svgContainer = document.querySelector('.editor-graph-svg');
var nodeFn = {
    nodeArr: [],
    /**
     * 作用：初始化svg画布；
     * */
    init: function () {
        var item = sessionStorage.getItem('taskNode');
        if(!!item){
            item=JSON.parse(item);
            document.querySelector('.top-bar .pro-name').innerText = item.name;
            this.initSvg(item.nodes);
        };
        this.fixEvent();
        this.initEvent();
    },
    /**
     * 作用：右侧编辑框提示信息显示，显示3秒后，自动消失
     * @params；mes 被显示的信息；
     * */
    showAlert: function (mes) {
        var mesDom = document.querySelector('.side-content .alert-info');
        document.querySelector('.side-content').classList.add('show-alert');
        mes && (mesDom.innerText = mes);
        setTimeout(function () {
            document.querySelector('.side-content').classList.remove('show-alert');
        }, 3000);
    },
    /**
     * 作用：删除节点：主要思想就是递归调用
     * @params；node 被删除的节点对象；
     * */
    deleteNode: function (node) {
        var childNode = {}, parentNode = {}, id;
        switch (node.nodeType) {
            case 'tree':
                if (node.related.child.tree === '') {  //支线节点，且为最后一个支线节点
                    id = node.related.parent.match(/[\d]+$/g)[0];
                    parentNode = this.nodeArr[id];
                    parentNode.updateChild('tree');
                    this.removeChild(node);
                } else {
                    id = node.related.child.tree.match(/[\d]+$/g)[0];
                    childNode = this.nodeArr[id];
                    /*替换有用信息*/
                    node.info = childNode.info;
                    node.updateText();
                    //    node.related.child = childNode.related.child;
                    this.deleteNode(childNode); //替换完，删除被替换的子节点；
                }
                break;
            case 'main':
                if (node.related.child.tree !== '') {  //有支线节点，则只需要节点替换，并删除最后一个支线节点
                    id = node.related.child.tree.match(/[\d]+$/g)[0];
                    childNode = this.nodeArr[id];
                    /*替换有用信息*/
                    node.info = childNode.info;
                    node.updateText();
                    //    node.related.child.tree = childNode.related.child.tree;
                    this.deleteNode(childNode); //替换完，删除被替换的子节点；
                } else if (node.related.child.main === '') {  //无支线子节点，且无主线子节点，即最后一个节点，直接删除；
                    id = node.related.parent.match(/[\d]+$/g)[0];
                    parentNode = this.nodeArr[id];
                    parentNode.updateChild('main');
                    this.removeChild(node);
                } else {   //无支线子节点，有主线子节点。采用主线节点替换；情况最复杂。
                    /**
                     * 第一步：替换节点为下一节点
                     * 第二步：判断是否有子节点，
                     * 第三步：先去跳个楼。。。。。。
                     * */
                    id = node.related.child.main.match(/[\d]+$/g)[0];
                    childNode = this.nodeArr[id];
                    /*替换有用信息*/
                    node.info = childNode.info;
                    node.updateText();
                    node.related.child.tree = childNode.related.child.tree;
                    //还差一步，更新子节点的信息
                    if (node.related.child.tree !== '') {
                        var treeId = node.related.child.tree.match(/[\d]+$/g)[0];
                        this.updateTreeNode(this.nodeArr[treeId], node); //更新子节点位置和父节点信息；
                    }
                    childNode.related.child.tree = ''; //因为将要删除的这个节点，其子节点是不含分支节点的，所以替换后，要删除其有的分支节点；
                    this.deleteNode(childNode); //替换完，删除被替换的子节点；
                }
                break;
        }
    },
    /**
     * 作用：删除节点辅助函数，用于更新分支节点
     * @params；node 被更新的分支节点；
     * @params；parentNode 被更新的分支节点父节点；
     * */
    updateTreeNode: function (node, parentNode) {
        var childNode = {}, id;
        /*更新信息*/
        parentNode.nodeType === 'main' && (node.related.parent = parentNode.nodeId);
        node.position.x = parentNode.position.x;
        node.updateNode();
        if (node.related.child.tree !== '') {  //支线节点，且为最后一个支线节点
            id = node.related.child.tree.match(/[\d]+$/g)[0];
            childNode = this.nodeArr[id];
            this.updateTreeNode(childNode, node);
        }
    },
    /**
     * 作用：删除节点实际操作
     * @params；node 被删除的节点对象；
     * */
    removeChild: function (node) {
        svgContainer.removeChild(document.querySelector('#' + node.nodeId));
        node.state = 'invalid';
        this.updateSvg();
    },
    /**
     * 作用：历史流程再编辑后复现；
     * */
    initSvg:function (nodes) {
        this.nodeArr.length =0,that=this;
        nodes.forEach(function (t) {
            that.nodeArr.push(new TaskNode(t.position, t.nodeType, t.sequence,t.related.parent,t.info,t.related.child));
        });
    },
    /**
     * 作用：更新svg画布；
     * */
    updateSvg: function () {
        svgContainer.innerHTML = svgContainer.innerHTML;
        this.initEvent();
    },
    /**
     * 作用：检测输入值是否为空，或非中文，英文，数字；
     * */
    checkInvalid: function () {
        var reg = /^[A-Za-z-0-9-\u4e00-\u9fa5]+$/, str = nameInput.value;
        if (reg.test(str)) {
            return true;
        }
        str === '' ? this.showAlert('（名称不能为空）') : this.showAlert('（名称只能由中文，英文与数字）');
        return false;
    },
    /**
     * 作用：检测是否有空节点，或报错的节点；
     * */
    checkNode: function () {
        if (document.querySelector('.editor-graph-svg .empty-node') || document.querySelector('.editor-graph-svg .error')) {
            alert('请将错误的节点正确编辑');
            document.querySelector('.editor-graph-svg').classList.add('show-error');
            return false;
        }
        document.querySelector('.editor-graph-svg').classList.contains('show-error') && document.querySelector('.editor-graph-svg').classList.remove('show-error');
        return true;
    },
    /**
     * 作用：有节点删除时，有效节点的重排序；
     * */
    sortNode: function () {
        var nodes, tempNode={},id, that = this;
        /*第一步：筛选有效的主节点和支线*/
        console.log('sort');
        nodes = that.nodeArr.filter(function (t) {
            return t.state === 'valid';
        });
        /*第二步：更新每个节点的序列号*/
        nodes = nodes.map(function (t,index) {
            if (t.sequence !== index) {
                t.sequence = index;
            }
            return t;
        });
        function findNode(id) {
            var index =0;
            var temp = nodes.some(function (t,dex) {
                index = dex;
                return t.nodeId === id;
            });
            return nodes[index];
        }
        /*第三步：主节点序列号与数组序列号不一致的，更新序列号*/
        nodes = nodes.map(function (t,index) {
            var oldIndex = t.nodeId.match(/[\d]+$/g)[0];
            /*更新自己的信息*/
            t.nodeId = 'node' + index;
            t.position.sequence = index;
            t.position.nodeId = t.nodeId;
            /*更新关联子主节点的信息*/
            if (t.related.child.main !== '') {
                id = t.related.child.main;
                tempNode = findNode(id);
                tempNode.related.parent = t.nodeId;
                t.related.child.main = 'node' +tempNode.sequence;
            }
            /*更新关联子分支节点的信息*/
            if (t.related.child.tree !== '') {
                id = t.related.child.tree;
                tempNode = findNode(id);
                tempNode.related.parent = t.nodeId;
                t.related.child.tree =  'node' +tempNode.sequence;
            }
            return t;
        });
        return nodes;
    },
    /**
     * 作用：保存所有节点的信息，最后更新保存当前节点的数组；
     * */
    saveNodesInfo: function () {
        var res = {};
        res.name = document.querySelector('.top-bar .pro-name').innerText;
        var deleteFlag = this.nodeArr.some(function (t) {
            return t.state ==='invalid';
        });
        res.nodes= deleteFlag ? this.sortNode():this.nodeArr;
        this.nodeArr = res.nodes;
        sessionStorage.setItem('taskNode',JSON.stringify(res));

        var re = sessionStorage.getItem('taskNode');
        console.log(re);
    },
    /**
     * 作用：固定节点事件声明
     * */
    fixEvent: function () {
        var that = this, node, dbFlag = false;
        //流程保存事件声明
        document.querySelector('.top-bar .pro-save').addEventListener('click', function () {
             if(!that.checkNode()){
                 return;
            }
            that.saveNodesInfo();
        });
        //流程清空事件声明
        document.querySelector('.top-bar .pro-cancel').addEventListener('click', function () {
            console.log('id');
        });
        //右侧编辑栏，采用事件监听
        document.querySelector('.side-content').addEventListener('click', function (e) {
            if (!saveSequence.getAttribute('sequence')) {
                that.showAlert('（请先选择节点）');
                return;
            }
            //节点编辑信息保存
            if (e.target.classList.contains('btn-sure')) {
                if (!that.checkInvalid()) {
                    return;
                }
                node = that.nodeArr[+saveSequence.getAttribute('sequence')];
                node.saveInfo();
            }
            //节点编辑信息重置
            if (e.target.classList.contains('btn-cancel')) {
                nameInput.value = '';
                descInput.value = '';
                nameInput.focus();
            }
            //节点删除
            if (e.target.classList.contains('del-node')) {
                node = that.nodeArr[+saveSequence.getAttribute('sequence')];
                that.deleteNode(node);
            }
        });
        //svg画布，单击事件声明
        document.querySelector('.editor-graph-svg').addEventListener('click', function (e) {
            var outId = setTimeout(function () {
                if (dbFlag) {
                    return;
                }
                document.querySelector('.editor-graph-svg .selected')
                && document.querySelector('.editor-graph-svg .selected').classList.remove('selected');
                saveSequence.setAttribute('sequence', '');
                saveSequence.classList.remove('show-del-btn');
                nameInput.value = '';
                descInput.value = '';
                clearTimeout(outId);
            }, 300);
        });
        //svg画布，双击事件声明，主要作用就是保存编辑好的节点数据
        document.querySelector('.editor-graph-svg').addEventListener('dblclick', function (e) {
            dbFlag = true;
            var dom = document.querySelector('.editor-graph-svg .selected');
            if (!dom) { //如果当前没有选中的id
                return;
            }
            if (!that.checkInvalid()) {
                return;
            }
            var id = dom.id, sequence = id.match(/[\d]+$/g)[0];
            node = that.nodeArr[sequence];
            node.saveInfo();
            dom.classList.remove('selected');
            dbFlag = false;
        });
    },
    /**
     * 作用：svg动态添加节点事件声明
     * */
    initEvent: function () {
        var that = this,
            positionArr,  //编辑节点坐标字符串split转化出的数组
            type,  //编辑节点类型
            position,  //编辑节点坐标对象
            sequence, //编辑节点序列号
            id,  //编辑节点id
            node;  //编辑节点对象
        /**
         * 节点选中编辑事件
         * */
        document.querySelector('.editor-graph-svg .edit-node')  //先判断编辑节点是否存在，然后再绑定点击事件
        && document.querySelectorAll('.editor-graph-svg .edit-node').forEach(function (t, k) {
            t.addEventListener('click', function (e) {
                e.stopPropagation();
                id = this.id, sequence = id.match(/[\d]+$/g)[0];
                document.querySelector('.editor-graph-svg .selected')
                && document.querySelector('.editor-graph-svg .selected').classList.remove('selected');
                this.classList.add('selected');
                node = that.nodeArr[sequence];
                node.editInfo();
                console.log('edit', this, sequence);
            });
        });
        /**
         * 添加节点选中添加事件
         * */
        document.querySelectorAll('.editor-graph-svg .edit-add-node').forEach(function (t) {
            t.addEventListener('click', function (e) {
                e.stopPropagation();
                var parent = this.parentNode;
                type = this.getAttribute('type');
                if (parent.classList.contains('empty-node')) {
                    !parent.classList.contains('error') && parent.classList.add('error');
                    if (type === 'tree') {  //判断当前节点是否为最后一个主线节点，若是，不允许添加并联支线节点;
                        return;
                    }
                }
                positionArr = this.getAttribute('position').split(',');
                id = this.id;
                position = {
                    x: +positionArr[0],
                    y: +positionArr[1]
                };
                if (id.indexOf('root-node') === -1) {
                    id = parent.id
                    sequence = id.match(/[\d]+$/g)[0];
                    node = that.nodeArr[sequence];
                    if (node.nodeType === 'main' && type === 'tree' && node.related.child.main === '') {  //判断当前节点是否为最后一个主线节点，若是，不允许添加并联支线节点;
                        return;
                    }
                    node.addChild(type, that.nodeArr.length);
                }
                that.nodeArr.push(new TaskNode(position, type, that.nodeArr.length, id));
            });
        });
    }
}
/**
 * 作用：节点对象
 * @params；position [object]:位置信息
 * @params；type     [string]:节点类型 main或tree
 * @params；sequence [number]:节点序列号
 * @params；parentId [string]:节点父节点id
 * @params；child:   [object]:节点子节点的信息
 * */
function TaskNode(position, type, sequence, parentId,info,child) {
    this.sequence = sequence;  //在全局节点数组中保存的序列号
    this.info = {
        name: '节点' + (sequence + 1),
        desc: ''
    };
    info&&(this.info=info);
    this.position = {
        x: position.x,
        y: position.y,
        sequence: sequence,
        nodeId: 'node' + sequence
    };
    this.related = {
        parent: parentId,  //父节点保存位置
        child: {
            main: '',  //主干子节点保存位置
            tree: ''   //分支子节点保存位置
        }
    };
    child&&(this.related.child=child);
    this.state = 'valid';
    this.nodeType = type;  //'分两种，主干node：main，分支tree'
    this.nodeId = 'node' + sequence;
    this.isNew = info?'':'empty-node';
    this.createNode(this.nodeType);
}
TaskNode.prototype = {
    /**
     * 创建节点
     * @params type 节点类型
     * */
    createNode: function (type) {
        var appNode = document.querySelector('.editor-graph-svg');
        appNode.innerHTML = appNode.innerHTML + this.addNode(type, this.position);
        nodeFn.initEvent();
        //    appNode.appendChild(this.addNode('addNode',this.position))
    },
    /**
     * 更新节点位置信息
     * */
    updateNode: function () {
        var currDom = document.getElementById(this.nodeId);  //获取其dom
        var newPos = this.position.x + ',' + this.position.y;
        currDom.querySelector('.edit-add-node').setAttribute('position', newPos);
        currDom.setAttribute('transform', 'translate(' + newPos + ')');
    },
    /**
     * 添加节点：返回节点字符串
     * @params type 节点类型
     * @params type 节点位置信息
     * */
    addNode: function (type, option) {
        var template = '', height;
        switch (type) {
            case 'main':  //主线节点 empty-node
                template = `<g transform="translate(${option.x},${option.y})" class="edit-node ${this.isNew}" id="${option.nodeId}">
                    <path class="pipeline placeholder" stroke-width="3.2" d="M -107 0 l 41 0 c 12 0 12 12 12 12 l 0 46 c 0 12 12 12 12 12 l 36 0" fill="none"></path>
                    <line class="lint-to-next pipeline placeholder" stroke-width="3.2" x1="0" y1="0" x2="120" y2="0"></line>
                    <line class="outer-group pipeline" stroke-width="3.2" x1="0" y1="0" x2="-107" y2="0"></line>
                    <g transform="translate(120,0)" class="edit-add-node"  position="${option.x + 120},${option.y}" type="main">
                        <g>
                            <circle  r="11" stroke-width="1.7">
                            </circle>
                            <g class="result-status-glyph" transform="rotate(45)">
                                <polygon points="4.67 -3.73 3.73 -4.67 0 -0.94 -3.73 -4.67 -4.67 -3.73 -0.94 0 -4.67 3.73 -3.73 4.67 0 0.94 3.73 4.67 4.67 3.73 0.94 0"></polygon>
                            </g>
                        </g>
                        <circle r="18.9" cursor="pointer" class="pipeline-node-hittarget" fill-opacity="0" stroke="none"></circle>
                    </g>
                    <g transform="translate(0,70)" class="edit-add-node"  position="${option.x},${option.y + 70}" type="tree">
                        <g>
                            <circle  r="11" stroke-width="1.7">
                            </circle>
                            <g class="result-status-glyph" transform="rotate(45)">
                                <polygon points="4.67 -3.73 3.73 -4.67 0 -0.94 -3.73 -4.67 -4.67 -3.73 -0.94 0 -4.67 3.73 -3.73 4.67 0 0.94 3.73 4.67 4.67 3.73 0.94 0"></polygon>
                            </g>
                        </g>
                        <circle r="18.9" cursor="pointer" class="pipeline-node" fill-opacity="0" stroke="none"></circle>
                    </g>
                    <text transform="translate(-16,-25)" class="node-info">${this.info.name}</text>
                    <circle class="node-outer" r="12.5"> </circle>
                    <circle class="node-inner" r="9.3"></circle>
                    <svg class="alerticon" width="20px" height="20px" viewBox="13 9 20 20">
                    <g id="Group-10" stroke="none" stroke-width="1" fill="none" transform="translate(15, 9)">
                        <g id="Triangle-2">
                            <use fill="#CE373A" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#path-1">
                            </use>
                            <use stroke="#FFFFFF" mask="url(#mask-2)" stroke-width="2" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#path-1"></use>
                        </g>
                        <use id="Rectangle-17" stroke="#FFFFFF" mask="url(#mask-4)" stroke-width="2" fill="#D8D8D8" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#path-3"></use>
                        <use id="Rectangle-17-Copy" stroke="#FFFFFF" mask="url(#mask-6)" stroke-width="2" fill="#D8D8D8" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#path-5">
                        </use>
                        </g>
                    </svg>
                </g>`;
                break;
            case 'tree':  //支线节点 empty-node
                height = option.y - 60;
                template = `<g transform="translate(${option.x},${option.y})" class="edit-node ${this.isNew}" id="${option.nodeId}">
              <path class="pipeline placeholder" stroke-width="3.2" d="M -107 ${0 - height} l 41 0 c 12 0 12 12 12 12 l 0 ${height + 46} c 0 12 12 12 12 12 l 36 0" fill="none"></path>
              <path class="pipeline" stroke-width="3.2" d="M -107 ${0 - height} l 41 0 c 12 0 12 12 12 12 l 0 ${height - 24} c 0 12 12 12 12 12 l 36 0" fill="none"></path>
              <path class="pipeline" stroke-width="3.2" d="M  0 0 l 41 0 c 12 0 12 -12 12 -12 l 0 ${24 - height} c 0 -12 12 -12 12 -12 l 45 0" fill="none"></path>
              <g transform="translate(0,70)" class="edit-add-node"  position="${option.x},${option.y + 70}" type="tree">
              <g>
              <circle  r="11" stroke-width="1.7">
              </circle>
              <g class="result-status-glyph" transform="rotate(45)">
              <polygon points="4.67 -3.73 3.73 -4.67 0 -0.94 -3.73 -4.67 -4.67 -3.73 -0.94 0 -4.67 3.73 -3.73 4.67 0 0.94 3.73 4.67 4.67 3.73 0.94 0"></polygon>
              </g>
              </g>
              <circle r="18.9" cursor="pointer" class="pipeline-node" fill-opacity="0" stroke="none"></circle>
              </g>
              <text transform="translate(-16,-25)" class="node-info">${this.info.name}</text>
              <circle class="node-outer" r="12.5"> </circle>
              <circle class="node-inner" r="9.3"></circle>
               <svg class="alerticon" width="20px" height="20px" viewBox="13 9 20 20">
                <g id="Group-10" stroke="none" stroke-width="1" fill="none" transform="translate(15, 9)">
                    <g id="Triangle-2">
                        <use fill="#CE373A" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#path-1">
                        </use>
                        <use stroke="#FFFFFF" mask="url(#mask-2)" stroke-width="2" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#path-1"></use>
                    </g>
                    <use id="Rectangle-17" stroke="#FFFFFF" mask="url(#mask-4)" stroke-width="2" fill="#D8D8D8" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#path-3"></use>
                    <use id="Rectangle-17-Copy" stroke="#FFFFFF" mask="url(#mask-6)" stroke-width="2" fill="#D8D8D8" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#path-5">
                    </use>
                    </g>
                </svg></g>`;
                break;
            default:
             ;
        }
        return template;
    },
    /**
     * 编辑节点信息
     * */
    editInfo: function () {
        nameInput.value = this.info.name;
        descInput.value = this.info.desc;
        saveSequence.setAttribute('sequence', this.sequence);
        saveSequence.classList.add('show-del-btn');
        nameInput.focus();
    },
    /**
     * 保存节点信息
     * */
    saveInfo: function () {
        this.info.name = nameInput.value;
        this.info.desc = descInput.value;
        this.updateInfo();
        this.updateText();
    },
    /**
     * 更新节点状态信息
     * */
    updateInfo: function () {
        var dom = document.querySelector('#' + this.nodeId);
        dom.classList.contains('empty-node') && dom.classList.remove('empty-node');
        dom.classList.contains('error') && dom.classList.remove('error');
    },
    /**
     * 计算节点文字在Html中所占的长度
     * @params str 要计算长度的字符串
     * */
    calLength: function (str) {
        var regEn = /[A-Za-z-0-9]/g, regCn = /[\u4e00-\u9fa5]/g, length, cnLength, k;
        length = str.match(regEn) ? str.match(regEn).length * 6 : 0;
        cnLength = str.match(regCn) ? str.match(regCn).length * 12 : 0;
        return length + cnLength;
    },
    /**
     * 更新节点文字信息
     * */
    updateText: function () {
        var dom = document.querySelector('#' + this.nodeId + ' .node-info');
        var xPos = -1 * this.calLength(this.info.name) / 2;
        dom.setAttribute('transform', 'translate(' + xPos + ',-25)');
        dom.textContent = this.info.name;
    },
    /**
     * 添加子节点id信息
     * @params type 子节点类型
     * @params sequence 子节点序列号
     * */
    addChild: function (type, sequence) {
        this.related.child[type] = 'node' + sequence;
    },
    /**
     * 更新节点子节点信息
     * */
    updateChild: function (type) {
        this.related.child[type] = '';
    }
};
nodeFn.init();
