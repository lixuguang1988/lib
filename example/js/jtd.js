/**
 * Created by lixuguang on 2015/12/11.
 */

/**
 * 返回元素的文本内容
 * 为什么不直接用 element.textContent || element.innerText;
 * @param element
 * @returns {string}
 */
function textContent(element){
    var child, type, s='';
    for(child = element.firstChild ; child != null; child = child.nextSibling){
        type = child.nodeType;
        //Text || CDataSection 节点
        if(type === 3 || type === 4 ){
            s += child.nodeValue;
        }
        if(type === 1){
            s += textContent(child);
        }
    }
    return s;
}

/**
 *  没什么用的一个方法
 * @param parent 父节点
 * @param child 带插入的节点 也是返回值
 * @param n   父节点的子节点中索引位置
 */
function insertAt(parent, child, n){
    if(n < 0 || n > parent.childNodes.length) throw new Error("Invalid index");
    if(n == parent.childNodes.length){
        parent.appendChild(child);
    }else{
        parent.insertBefore(child, parent.childNodes[n]);
    }
}

/**
 * 将节点插入到指定节点的后面
 * @param node
 * @param ref
 */
function insertAfter(node, ref){
    ref.parentNode.insertBefore(node, ref.nextSibling);
}


/**
 *  table排序
 * @param table 带排序的table
 * @param n 安装td排序的索引
 * @param comparator  排序函数
 */
function sortTable(table, n, comparator){
    var tbody = table.tBodies[0], //如果没有tbody会隐身创建的
        rows = tbody.getElementsByTagName("tr"),
        i = 0,
        length = rows.length;

    rows = Array.prototype.slice.call(rows, 0); //类数组转换为数字

    //数组排序
    rows.sort(function(row1, row2){
        var td1 = row1.getElementsByTagName("td")[n],
            td2 = row2.getElementsByTagName("td")[n],
            val1 = td1.textContent || td1.innerText,
            val2 = td2.textContent || td2.innerText;

        if(comparator) return comparator(val1, val2);
        return val1 - val2;
    });

    //按顺序重新排列row
    for( ; i < length; i++ ){
        tbody.appendChild(rows[i]);
    }
}


/**
 * 点击th排序
 * 本函数局限性非常明显 th只能出现一行内
 * @param table
 */
function makeTableSortable(table){
    var ths = table.getElementsByTagName("th"),
        i = 0,
        len = ths.length;

    for(; i < len; i++){
        (function(n){ //嵌套函数用来创建本地作用域
            ths[n].onclick = function(){
                sortTable(table, n);
            }
        }(i));  //将i的值赋予给局部变量n
    }
}


/**
 * 给指定的元素加粗
 * @param node
 */
function  embolden(node){
    var parent,
        b;

    if(typeof  node === "string") node = document.getElementById(node);

    parent = node.parentNode;
    b = document.createElement("b");

    parent.replaceChild(b, node);
    b.appendChild(node);

}



(function(){
    //如果已经支持outerHTML就退出
    if(document.createElement("div").outerHTML){return false;}

    function outerHTMLGetter(){
        var contianer = document.createElement("div");
        //复制本节点到临时元素上
        container.appendChild(this.cloneNode(true));
        return container.innerHTML;
    }

    function outerHTMLSetter(value){
        var contianer = document.createElement("div");
        container.innerHTML = value;

        //把value的节点元素全部插入当前元素的位置前面
        while(container.firstChild){
            this.parentNode.insertBefore(contianer.firstChild, this);
        }
        //删除当前的元素
        this.parentNode.removeChild(this);
    }

    if(Object.defineProperty){
        Object.defineProperty(Element.prototype, "outerHTML", {
            set : outerHTMLSetter,
            get : outerHTMLGetter,
            enumerable : false,
            configurable : true
        })
    }else{
        //用firefox的__defineSetter__, __defineSetter__
        Element.prototype.__defineSetter__("outerHTML", outerHTMLSetter);
        Element.prototype.__defineGetter__("outerHTML", outerHTMLGetter);
    }

}());

/**
 * 对指定节点的子节点排序
 * @param node
 */
function reverse(node){
    var frag = document.createDocumentFragment();

    while(node.lastChild){
        frag.appendChild(node.lastChild);
    }

    node.appendChild(frag);
}

/**
 * 实现 Element.insertAdjacentHTML方法
 * 并同时把beforebegin, afterbegin, beforeend, afterend 为  before, atStart, atEnd, after
 */
var Insert = (function(){
    //如果元素有insertAdjacentHTML方法
    //直接方法返回重构的对象
    if(document.createElement("div").insertAdjacentHTML){
        return {
            before : function(element, html){element.insertAdjacentHTML("beforebegin", html);},
            atStart : function(element, html){element.insertAdjacentHTML("afterbegin", html);},
            atEnd : function(element, html){element.insertAdjacentHTML("beforeend", html);},
            after: function(element, html){element.insertAdjacentHTML("afterend", html);}
        }
    }

    //没有insertAdjacentHTML,实现同样的四个插入函数，并使用它们来定义insertAdjacentHTML

    //定义一个工具函数，传入HTML字符串，返回一个DocumentFragment
    //它包含了解析后的HTML的表示

    function frag(html){
        var div = document.createElement("div"),
            frag = document.createDocumentFragment();

        div.innerHTML = html;

        //把临时div的内容全部插入到frag里面
        while(div.firstChild){
            frag.appendChild(div.firstChild);
        }

        return frag;
    }


    var  Insert = {
        before : function(element, html){
            element.parentNode.insertBefore(frag(html), element);
        },
        atStart : function(element, html){
            element.insertBefore(frag(html), element.firstChild);
        },
        atEnd : function(element, html){
            element.appendChild(frag(html));
        },
        after: function(element, html){
            element.parentNode.insertBefore(frag(html), element.nextSibling);
        }
    };


    //基于以上函数实现insertAdjacentHTML
    Element.prototype.insertAdjacentHTML = function(pos, html){
        switch(pos.toLowerCase()){
            case "beforebegin" : return Insert.before(this, html); break;
            case "afterbegin" : return Insert.atStart(this, html); break;
            case "beforeend" : return Insert.atEnd(this, html); break;
            case "afterend" : return Insert.after(this, html); break;
        }
    };


    return Insert;  //返回四个插入函数

}());


/**
 * 抖动元素
 *
 * @param elem 要移动的元素
 * @param oncomplete shake完的回调函数，传入elem为参数
 * @param distance  设置振幅
 * @param time  元素抖动多久时间
 */

function shake(elem, oncomplete, distance, time){
    //如果元素不是dom节点，获得元素为dom节点
    if(typeof elem ==="string") elem = document.getElementById(elem);
    //设置默认振幅为5px，默认抖动时间
    if(!distance) distance = 5; // distance = distance || 5;
    if(!time) time = 500;

    var origialStyle = elem.style.cssText,//存储elem原先的内联的样式
        start = (new Date()).getTime();
    elem.style.position = "relative";

    animate();

    function animate(){
        var elapsed = (new Date()).getTime()-start,
            fraction = elapsed / time,
            x;

        if(fraction < 1){
            x = distance * Math.sin(fraction * 4 * Math.PI);
            elem.style.left = x + "px";

            //在25ms或总时间的最后尝试再次运行函数以产生每秒40帧的动画
            setTimeout(animate, Math.min(25, time-elapsed));
        }else{
            //重置为原来的样式
            elem.style.cssText = origialStyle;
            if(typeof oncomplete === "function") oncomplete(elem)
        }
    }
}


function fadeOut(elem, oncomplete, time){
    //如果元素不是dom节点，获得元素为dom节点
    if(typeof elem ==="string") elem = document.getElementById(elem);
    //设置默认时间
    if(!time) time = 500;

    var start = (new Date()).getTime(),
        ease = Math.sqrt;//缓动函数


    animate();

    function animate(){
        var elapsed = (new Date()).getTime()-start,
            fraction = elapsed / time,
            opacity;

        if(fraction < 1){
            opacity = 1 - ease(fraction);
            elem.style.opacity = String(opacity);
            elem.style.filter = "alpha(opacity=" + Number(opacity)*100 + ")";

            //在25ms或总时间的最后尝试再次运行函数以产生每秒40帧的动画
            setTimeout(animate, Math.min(25, time-elapsed));
        }else{
            elem.style.opacity = "0";
            elem.style.filter = "alpha(opacity=0)";
            if(typeof oncomplete === "function") oncomplete(elem)
        }
    }
}





function classList(e){
    if(e.classList){
        return e.classList;
    }else{
        return new CSSClassList(e);
    }
}

function CSSClassList(e){
    this.e = e;
}

CSSClassList.prototype.contains =  function(c){
    var classes = this.e.className,
        reg = new RegExp("\\b" + c + "\\b", "g");
    if(!c || c.length == 0 || c.indexOf(" ") > -1 || c.indexOf("\"") > -1 || c.indexOf("'") > -1){
        throw new Error("Invalid Class Name")
    }

    //常规检查
    if(!classes) return false;
    if(classes === c) return true;

    return reg.test(classes);
};

CSSClassList.prototype.add = function(c){
    var classes = this.e.className;

    if(!this.contains(c)){
        this.e.className = (classes.length > 0) ? (classes + " " + c) : c;
    }
};

CSSClassList.prototype.remove =  function(c){
    var classes = this.e.className,
        classArray = classes.split(/\s+/g),
        i = 0,
        len = classArray.length;

    if(!this.contains(c)) {
        return ;
    }

    for(; i < len; i++){
        if(c === classArray[i] || classArray[i] == ""){
            delete classArray[i];
        }
    }
    console.log(classArray)

    //把头尾的空格去掉，多个空格换成一个空格
    this.e.className = classArray.join(" ").replace(/^\s+|\s+$/g, "").replace(/\s+/g, " ");
};

CSSClassList.prototype.toggle = function(c){
    if(this.contains(c)){
        this.remove(c)
        return false;
    }else{
        this.add(c);
        return true;
    }
};

CSSClassList.prototype.toString =  function(){
    return this.e.className;
};

CSSClassList.prototype.toArray =  function(){
    return this.e.className.split(/\s+/g);
};

//var x = classList(document.querySelector("h1"));
//x.add("xxxx")
//x.add("uuu");
//x.contains("xxxx");
//x.remove("xxxx");


//Array.map方法
(function(){
    if(Array.prototype.map){return;}
    Array.prototype.map =  function(func, context){
        var self = this.slice(0), //不改变原数组
            result = [];
        for(var i = 0; i < self.length ; i++){
            result.push(func.call(context, self[i], i, self));
        }
        return result;
    }
}());



function onLoad(func){
    if(onLoad.loaded){
        setTimeout(func, 0);
    }else if(window.addEventListener){
        window.addEventListener("load", func, false);
    }else{
        window.attachEvent("onload", func);
    }
}
onLoad.loaded = false;

onLoad(function(){onLoad.loaded = true});


//function onLoad2(func){
//    if(onLoad2.loaded){
//        setTimeout(func, 0);
//    }else{
//        onLoad2.delayList.push(func);
//        window.onload = function(){
//            for(var i = 0; i < onLoad2.delayList.length; i++){
//                onLoad2.delayList.shift()();
//            }
//        }
//    }
//}
//onLoad2.loaded = false;
//onLoad.delayList = [];

//回头要试一下能不能用
//var loaded = (function(){
//    var funcs = [],
//        loaded = false,
//        register = false;
//
//    return function(func){
//       if(loaded){
//           setTimeout(func, 0);
//       }else{
//           funcs.push(func);
//           if(!register){
//               window.onload = function(){
//
//                   for(var i = 0; i < funcs.length; i++){
//                       funcs[i]();
//                   }
//                   loaded = true;
//                   funcs = null;
//               }
//               register = true;
//           }
//       }
//    }
//
//}());


var whenReady = (function(){/*立即执行的函数*/
    var ready = false,
        funcs = [] /*待执行的函数队列*/;

    function handler(e){
        if(ready) return;

        //readystatechange 但不是 文档加载完成
        if(e.type === "readystatechange" && document.readyState !== "complete"){
            return
        }

        /**
         * 运行待执行的函数队列
         * funcs.length不要优化为 var length = funcs.length;
         * 防止事件队列执行过程中，funcs添加了更多事件
         */
        for(var i = 0; i < funcs.length ; i++){
            funcs[i].call(document);
        }

        ready = true;
        funcs = null

    }

    //注册页面加载完成的事件
    if(document.addEventListener){
        document.addEventListener("DOMContentLoaded", handler, false);
        document.addEventListener("readystatechange", handler, false);
        window.addEventListener("load", handler, false);
    }else {
        //document.attachEvent("onDOMContentLoaded", handler); //IE8<=没有DOMContentLoaded
        document.attachEvent("onreadystatechange", handler);
        window.attachEvent("onload", handler);
    }


    //返回whenReady为一个函数
    return function(f){
        if(ready){ //如果页面已经加载好了，立即执行函数
            f.call(document);
        }else{
            funcs.push(f);
        }
    }
}());


/**
 *
 * @param elementToDrag 带拖动的元素,
 * @param event  mousedown的事件对象
 */

function drag(elementToDrag, event){
    //把鼠标的相对视口的坐标转换为文档坐标
    var scroll = getScrollOffsets();
    var startX = event.clientX + scroll.x;
    var startY = event.clientY + scroll.y;

    //获得元素相对于文档的坐标
    var origX = elementToDrag.offsetLeft;
    var origY = elementToDrag.offsetTop;


    var deltaX = startX - origX;
    var deltaY = startY - origY;

    //绑定mousemove和mouseup事件
    //用事件捕获
    if(elementToDrag.addEventListener){
        elementToDrag.addEventListener("mousemove", movehandle, true);
        elementToDrag.addEventListener("mouseup", uphandle, true);
    }else{
        elementToDrag.setCapture(); //设置元素为捕获
        elementToDrag.attachEvent("onmousemove", movehandle);
        elementToDrag.attachEvent("onmouseup", uphandle);
        elementToDrag.attachEvent("onlosecapture", uphandle);
    }

    //阻止事件的默认行为
    if(event.preventDefault){
        event.preventDefault();
    }else{
        event.cancelBubble = true;
    }

    //阻止事件冒泡,不让其他元素看到
    if(event.stopPropagation){
        event.stopPropagation();
    }else{
        event.returnValue = false;
    }


    function movehandle(e){
        e = e || window.event; //或者事件对象

        var scroll = getScrollOffsets();

        elementToDrag.style.left = e.clientX + scroll.x - deltaX + "px";
        elementToDrag.style.top = e.clientY + scroll.y - deltaY + "px";

        //阻止事件冒泡，不让其他元素看到
        if(e.stopPropagation){
            e.stopPropagation();
        }else{
            e.returnValue = false;
        }

    }


    function uphandle(e){
        e = e || window.event; //或者事件对象

        if(elementToDrag.removeEventListener){
            elementToDrag.removeEventListener("mousemove", movehandle, true);
            elementToDrag.removeEventListener("mouseup", uphandle, true);
        }else{
            elementToDrag.detachEvent("onlosecapture", uphandle);
            elementToDrag.detachEvent("onmousemove", movehandle);
            elementToDrag.detachEvent("onmouseup", uphandle);
            elementToDrag.releaseCapture();
        }

        //阻止事件冒泡，不让其他元素看到
        if(e.stopPropagation){
            e.stopPropagation();
        }else{
            e.returnValue = false;
        }
    }

}

/**
 * 得到滚动条卷轴的高度、长度
 * @param w window对象或者iframe的window对象
 * @returns {*}
 */
function getScrollOffsets(w){
    var doc;

    w = w || window;

    //如果支持window.pageXOffset
    // 0 != null ==>true
    // undefined != null ==>false
    if(w.pageXOffset != null){
        return {x : w.pageXOffset, y: w.pageYOffset};
    }

    doc = w.document;
    //IE8及以前的标准文档模式
    if(doc.documentMode === "CSS1Compat"){
        return {
            x : doc.documentElement.scrollLeft,
            y : doc.documentElement.scrollTop
        }
    }else{
        return {
            x : doc.body.scrollLeft,
            y : doc.body.scrollTop
        }
    }

}



function enclose(content, framewidth, frameheight, contentX, contentY){
    framewidth = Math.max(framewidth, 50);
    frameheight = Math.max(frameheight, 50);
    contentX = Math.min(contentX, 0) || 0;
    contentY = Math.min(contentY, 0) || 0;


    var frame = document.createElement("div")
    frame.className = "enclose";
    frame.style.width = framewidth + "px";
    frame.style.height =  frameheight + "px"
    frame.style.overflow = "hidden";
    frame.style.boxSizing = "border-box";
    frame.style.webkitBoxSizing = "-webkit-border-box";
    frame.style.mozBoxSizing = "-moz-border-box";

    //把frame作为content的父节点
    content.parentNode.insertBefore(frame, content);
    frame.appendChild(content);

    //更新content位置
    content.style.position = "relative";
    content.style.left = contentX + "px";
    content.style.top = contentY + "px";


    //不能放到其他项目上用
    //firefox、chrome、safari、opera navigator.userAgent都包含Gecko的字符串
    var isMacWebkit = navigator.userAgent.indexOf("Macintosh") !== -1 && navigator.userAgent.indexOf("Webkit") !== -1;
    var isSupportDOMMouseScroll = (function() {
        var div = document.createElement("div"), result;
        result = "onDOMMouseScroll" in div;
        div = null;
        return result;
    }());

    //注册mousewheel事件处理程序
    frame.onwheel = wheelHandler;
    frame.onmousewheel = wheelHandler;

    if(isSupportDOMMouseScroll){
        frame.addEventListener("DOMMouseScroll", wheelHandler, false);
    }


    function wheelHandler(event){
        var e = event || window.event; //获得事件对象

        var deltaX = e.deltaX * -30 || e.wheelDeltaX/4 || 0;
        var deltaY = e.deltaY * -30 || e.wheelDelta/4 || (e.wheelDeltaY === undefined && e.wheelDelta/4) || e.detail* -10 || 0;

        if(isMacWebkit){
            deltaX /= 30;
            deltaY /= 30;
        }

        deltaY  /= 50;
        console.log(deltaX);

        if(isSupportDOMMouseScroll  && e.type !== "DOMMouseScroll"){
            frame.removeEventListener("DOMMouseScroll", wheelHandler, false);
        }

        var contentbox = content.getBoundingClientRect();
        var contentwidth = contentbox.right - contentbox.left;
        var contentheight = contentbox.bottom - contentbox.top;

        if(e.altKey){
            if(deltaX){
                framewidth -= deltaX;
                framewidth = Math.min(framewidth, contentwidth);
                framewidth = Math.max(framewidth, 50);
                frame.style.width = framewidth + "px";
            }
            if(deltaY){
                frameheight -= deltaX;
                frameheight = Math.min(frameheight, contentheight);
                frameheight = Math.max(frameheight, 50);
                frame.style.width = frameheight + "px";
            }
        }else{
            if(deltaX) {
                var minoffset = Math.min(framewidth - contentwidth, 0);
                contentX = Math.max(contentX + deltaX, minoffset);
                contentX = Math.min(contentX, 0);
                content.style.left = contentX + "px"
            }
            if(deltaY){
                var minoffset = Math.min(frameheight - contentheight, 0);
                contentY = Math.max(contentY + deltaY, minoffset);
                contentY = Math.min(contentY, 0);
                console.log(contentY);
                content.style.top = contentY + "px"
            }
        }

        //阻止事件的默认行为
        if(e.preventDefault){
            e.preventDefault();
        }else{
            e.cancelBubble = true;
        }

        //阻止事件冒泡,不让其他元素看到
        if(e.stopPropagation){
            e.stopPropagation();
        }else{
            e.returnValue = false;
        }
        return false;


    }
}


/**
 *  返回parent是否是child的父级(祖先)节点
 * @param child 待判定的子节点
 * @param parent 待判定的子节点
 * @returns {boolean}
 */

function isChild(child, parent){
    for( ; child ; child = child.parentNode){
        if(child === parent){
            return true;
        }
    }
    return false;
}


function dnd(list){
    //保存list的原始类
    var original_class = list.className,
        entered = 0 ; //跟踪进入和离开  dragenter ,dragleave事件是冒泡的

    //处理拖放目标的dragenter、dragover、dragleave、drop事件
    list.ondragenter = function(e){
        e = e || window.event;//获得事件对象或者IE<=8的事件对象
        var from = e.relatedTarget; //标准里面通过relatedTarget判断从哪里来的， IE<=8 里通过entered来判断


        entered++;
        console.log("dragenter: " + entered);

        //从list外面首次进入list
        if( (from && !isChild(from, list)) || entered == 1){
            var dt = e.dataTransfer, //获取DnD的 dataTransfer
                types = dt.types; //dataTransfer中可用的数据类型 IE<=8中不存在
            console.log(dt);
            //如果没有任何类型的数据ie8 或 可用数据是纯文本格式
            //高亮显示
            //同时返回false通知浏览器
            if(!types || (types.contains && types.contains("text/plain")) &&  types.indexOf && types.indexOf("text/plain") != -1 ){
                list.className = original_class + " droppable";
                return false;
            }

            return; //没有取消
        }

        return false; //如果不是第一次进入，继续返回false通知浏览器
    }

    //程序返回false，否则拖放操作就取消了
    list.ondragover = function(){return false;}

    list.ondragleave =  function(e){
        e  =  e || window.event;
        var to = e.relatedTarget;

        entered--;
        console.log("dragleave:" + entered);

        //如果离开list 或者 打破离开进入次数的平衡
        //那么取消高亮显示列表
        if((to && !isChild(to, list)) &&  entered <=0){
            list.className = original_class;
            entered = 0;
        }
        return false;
    }


    list.ondrop = function(e){
        e = e || window.event;

        var dt = e.dataTransfer,//得到dataTransfer
            text = dt.getData("Text");

        console.log(text);
        if(text){
            list.appendChild(document.getElementById(text));

            list.className = original_class;
            entered = 0 ;
            return false;
        }
    }

    var items = list.getElementsByTagName('li');
    for(var i = 0 ; i < items.length ; i++){
        items[i].draggable = true;
    }


    //设置拖动源的dragstart、dragend事件
    list.ondragstart = function(e){
        e = e || window.event;
        var target = e.target || e.srcElement,
            dt  = e.dataTransfer;

        //如果拖动的不是li
        if(target.tagName !== "LI") {return false;}

        console.log(target.textContent);
        //设置拖动数据和拖动效果
        dt.setData("Text", target.id);
        dt.effectAllowed = "copyMove";

    }

    list.ondragend = function(e){
        e = e || window.event;
        var target = e.target || e.srcElement;


        //if(e.dataTransfer.dropEffect === "move"){
        //    target.parentNode.removeChild(target);
        //}
    }

    //网上说可以fixedie9，这里没有用
    list.onselectstart = function(evt) {
        this.dragDrop();
        return false;
    };


}

/**
 * keyppress对中文没多大用
 * @param element
 * @returns {boolean}
 */
function inputFilter(element){
    //如果是字符串就获得node节点
    if(typeof element  === "string") element = document.getElementById(element);

    var allowChars = element.getAttribute("data-allow-chars"),
        messageid = element.getAttribute("data-messageid"),
        messageNode = messageid ? document.getElementById(messageid) : undefined;

    if(!!allowChars === false){
        return false;
    }

    if(element.addEventListener){
        element.addEventListener("keypress", filter, false);
        element.addEventListener("textinput", filter, false);
        element.addEventListener("textInput", filter, false); //早期非标准事件
    }else{
        element.attachEvent("onkeypress", filter); //ie8< 不支持textinput事件
    }



    function filter(event){
        event = event || window.event;
        var target = event.target || event.srcElement,
            code, //输入文本的charcode
            text,//输入的文本
            char;
        console.log(event);
        if(event.type === "textinput" || event.type === "textInput"){
            text = event.data;
        }else{
            code = event.keyCode || event.charCode;
            if(code < 32 || event.charCode == 0 /*firefox*/ ){
                return;
            }else{
                text = String.fromCharCode(code);
            }
        }


        for(var i = 0; i < text.length; i++){
            char = text.charAt(i);
            if(allowChars.indexOf(char) === -1){
                if(messageNode){
                    messageNode.style.visibility = "visible";
                }
                if(event.preventDefault){
                    event.preventDefault()
                }else{
                    event.returnValue = false;
                }
                return false; //这个是退出for
            }
        }
        if(messageNode){
            messageNode.style.visibility = "hidden";
        }

    }
}

function forceToUpperCase(element) {
    if (typeof element === "string") element = document.getElementById(element);
    element.oninput = upcase;
    element.onpropertychange = upcaseOnPropertyChange;

    // Easy case: the handler for the input event
    function upcase(event) {
        this.value = this.value.toUpperCase();
    }
    // Hard case: the handler for the propertychange event
    function upcaseOnPropertyChange(event) {
        var e = event || window.event;
        // If the value property changed
        if (e.propertyName === "value") {
            // Remove onpropertychange handler to avoid recursion
            this.onpropertychange = null;
            // Change the value to all uppercase
            this.value = this.value.toUpperCase();
            // And restore the original propertychange handler
            this.onpropertychange = upcaseOnPropertyChange;
        }
    }
}



//implement XMLHttpRequest for ie <=6
(function(){
    if(window.XMLHttpRequest === undefined){
        window.XMLHttpRequest = function(){
            try{
                return new ActiveXObject("Msxml2.XMLHTTP.6.0");
            }catch(e1){
                try{
                    return new ActiveXObject("Msxml2.XMLHTTP.3.0");
                }catch(e2){
                    throw new Error("don't support XMLHttpReqeust");
                }
            }
        }
    }
}());

/**
 * 把传入的对象转为表单数据 a=xx&b=yy&c=ddd;
 * @param data
 * @returns {*}
 */
function encodeFormData(data){
    if(!data) return "";
    var pairs = [],
        value;
    for(var name in data){
        value = data[name];
        if(!data.hasOwnProperty(name) || (typeof value === "function") ) continue;
        name = encodeURIComponent(name);
        value = encodeURIComponent(value);
        pairs.push(name + "=" + value);
    }
    return pairs.join("&");
}


function postData(url, data, callback){
    var xhr = new XMLHttpRequest(); //实例化XMLHttpRequest对象
    xhr.open("POST", url, true); //调用open方法
    //注册readystatechange事件
    xhr.onreadystatechange = function(){
        if( (xhr.status == 304 || (xhr.status >= 200 && xhr.status < 300) ) && xhr.readyState === 4 && callback){
             callback(xhr.responseText);
        }
    };
    //设置请求头
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    //发送数据
    xhr.send(encodeFormData(data));
}


function postQuery(url, what, where, radius, callback){
    var xhr = new XMLHttpRequest(); //实例化XMLHttpRequest对象
    xhr.open("POST", url, true); //调用open方法
    //注册readystatechange事件
    xhr.onreadystatechange = function(){
        if((xhr.status == 304 || (xhr.status >= 200 && xhr.status < 300) ) && xhr.readyState === 4 && callback){
            callback(xhr.responseText);
        }
    };

    //穿件xml数据
    //<query>
    //  <find zipcode="200100" radius="1000">
    //      pizza
    //  </find>
    //</query>
    var doc = document.implementation.createDocument("", "query", null);
    var query = doc.documentElement;
    var find = document.createElement("find");
    find.setAttribute("zipcode", where);
    find.setAttribute("radius", radius);
    find.appendChild(document.createTextNode(what));
    query.appendChild(find);


    //发送数据xml会自动设置requestHeader格式
    xhr.send(doc);
}



function createDropFileUpload(target, url){
    var uploading = false;

    target.ondragenter = function(event){
        if(uploading) return;//正在上传，就忽略
        var types = event.dataTransfer.types;
        //进来的里面有文件
        if(types && ( (types.contains && types.contains("Files")) || (types.indexOf && types.indexOf("Files") !== -1) ) ){
            target.classList.add("wantdrop");
            return false;
        }
    }

    target.ondragover = function(){
        //如果没有在上传就，就通知浏览器保持兴趣
        if(!uploading){
            return false;
        }
    }

    target.ondragleave = function(){
        if(!uploading){
            target.classList.remove("wantdrop");
        }
    }

    target.ondrop = function(event){
        if(uploading){return false;}
        var files = event.dataTransfer.files;
        if(!files || files.length == 0){return false;}

        uploading = true;

        var xhr = new XMLHttpRequest(),
            formdata = new FormData(),
            total = 0;

        xhr.open("post", url, true);



        formdata.append("filelength", files.length);
        for(var i = 0 ; i < files.length ; i++){
            formdata.append("file"+ i, files[i]);
            total +=files[i]["size"];
        }

        xhr.upload.onprogress = function(event){
            target.innerHTML = event.total + ":" + event.loaded;
        };

        xhr.upload.onload = function(){
            uploading = false;
            target.innerHTML = "";
            target.classList.remove("wantdrop");
        }
        xhr.upload.onload = function(){
            uploading = false;
            target.innerHTML = "";
            target.classList.remove("wantdrop");
        }
        xhr.send(formdata);
        target.innerHTML = total + ": 0";
        return false;
    }
}

/**
 * 得到JSONP的函数
 *
 * getJSONP("http://api.example.com/profile.php?id=10235", function(data){process(data)});
 * 请求的地址可能为：http://api.example.com/profile.php?id=10235&jsonp=getJSONP.cb22
 * 返回值
 * getJSONP.cb22({
 *  name : "lixuguang",
 *  age : 27
 * })
 * @param url
 * @param callback
 */
function getJSONP(url, callback){
    var cbnum = "cb" + getJSONP.counter++;
    var cbname = "getJSONP." + cbnum;

    if(url.indexOf("?") === -1){
        url += "?jsonp=" + cbname;
    }else{
        url += "&jsonp=" + cbname;
    }

    var script = document.createElement("script");

    getJSONP[cbnum] = function(respone){
        try{
            callback(respone);
        }finally{
            delete  getJSONP[cbnum];
            script.parentNode.removeChild(script);
        }
    };

    script.src= url;
    document.body.appendChild(script);

}












