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















