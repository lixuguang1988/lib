/**
 * Created by lixuguang on 2015/12/11.
 */

/**
 * ����Ԫ�ص��ı�����
 * Ϊʲô��ֱ���� element.textContent || element.innerText;
 * @param element
 * @returns {string}
 */
function textContent(element){
    var child, type, s='';
    for(child = element.firstChild ; child != null; child = child.nextSibling){
        type = child.nodeType;
        //Text || CDataSection �ڵ�
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
 *  ûʲô�õ�һ������
 * @param parent ���ڵ�
 * @param child ������Ľڵ� Ҳ�Ƿ���ֵ
 * @param n   ���ڵ���ӽڵ�������λ��
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
 * ���ڵ���뵽ָ���ڵ�ĺ���
 * @param node
 * @param ref
 */
function insertAfter(node, ref){
    ref.parentNode.insertBefore(node, ref.nextSibling);
}


/**
 *  table����
 * @param table �������table
 * @param n ��װtd���������
 * @param comparator  ������
 */
function sortTable(table, n, comparator){
    var tbody = table.tBodies[0], //���û��tbody����������
        rows = tbody.getElementsByTagName("tr"),
        i = 0,
        length = rows.length;

    rows = Array.prototype.slice.call(rows, 0); //������ת��Ϊ����

    //��������
    rows.sort(function(row1, row2){
        var td1 = row1.getElementsByTagName("td")[n],
            td2 = row2.getElementsByTagName("td")[n],
            val1 = td1.textContent || td1.innerText,
            val2 = td2.textContent || td2.innerText;

        if(comparator) return comparator(val1, val2);
        return val1 - val2;
    });

    //��˳����������row
    for( ; i < length; i++ ){
        tbody.appendChild(rows[i]);
    }
}


/**
 * ���th����
 * �����������Էǳ����� thֻ�ܳ���һ����
 * @param table
 */
function makeTableSortable(table){
    var ths = table.getElementsByTagName("th"),
        i = 0,
        len = ths.length;

    for(; i < len; i++){
        (function(n){ //Ƕ�׺���������������������
            ths[n].onclick = function(){
                sortTable(table, n);
            }
        }(i));  //��i��ֵ������ֲ�����n
    }
}


/**
 * ��ָ����Ԫ�ؼӴ�
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
    //����Ѿ�֧��outerHTML���˳�
    if(document.createElement("div").outerHTML){return false;}

    function outerHTMLGetter(){
        var contianer = document.createElement("div");
        //���Ʊ��ڵ㵽��ʱԪ����
        container.appendChild(this.cloneNode(true));
        return container.innerHTML;
    }

    function outerHTMLSetter(value){
        var contianer = document.createElement("div");
        container.innerHTML = value;

        //��value�Ľڵ�Ԫ��ȫ�����뵱ǰԪ�ص�λ��ǰ��
        while(container.firstChild){
            this.parentNode.insertBefore(contianer.firstChild, this);
        }
        //ɾ����ǰ��Ԫ��
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
        //��firefox��__defineSetter__, __defineSetter__
        Element.prototype.__defineSetter__("outerHTML", outerHTMLSetter);
        Element.prototype.__defineGetter__("outerHTML", outerHTMLGetter);
    }

}());

/**
 * ��ָ���ڵ���ӽڵ�����
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
 * ʵ�� Element.insertAdjacentHTML����
 * ��ͬʱ��beforebegin, afterbegin, beforeend, afterend Ϊ  before, atStart, atEnd, after
 */
var Insert = (function(){
    //���Ԫ����insertAdjacentHTML����
    //ֱ�ӷ��������ع��Ķ���
    if(document.createElement("div").insertAdjacentHTML){
        return {
            before : function(element, html){element.insertAdjacentHTML("beforebegin", html);},
            atStart : function(element, html){element.insertAdjacentHTML("afterbegin", html);},
            atEnd : function(element, html){element.insertAdjacentHTML("beforeend", html);},
            after: function(element, html){element.insertAdjacentHTML("afterend", html);}
        }
    }

    //û��insertAdjacentHTML,ʵ��ͬ�����ĸ����뺯������ʹ������������insertAdjacentHTML

    //����һ�����ߺ���������HTML�ַ���������һ��DocumentFragment
    //�������˽������HTML�ı�ʾ

    function frag(html){
        var div = document.createElement("div"),
            frag = document.createDocumentFragment();

        div.innerHTML = html;

        //����ʱdiv������ȫ�����뵽frag����
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


    //�������Ϻ���ʵ��insertAdjacentHTML
    Element.prototype.insertAdjacentHTML = function(pos, html){
        switch(pos.toLowerCase()){
            case "beforebegin" : return Insert.before(this, html); break;
            case "afterbegin" : return Insert.atStart(this, html); break;
            case "beforeend" : return Insert.atEnd(this, html); break;
            case "afterend" : return Insert.after(this, html); break;
        }
    };


    return Insert;  //�����ĸ����뺯��

}());


/**
 * ����Ԫ��
 *
 * @param elem Ҫ�ƶ���Ԫ��
 * @param oncomplete shake��Ļص�����������elemΪ����
 * @param distance  �������
 * @param time  Ԫ�ض������ʱ��
 */

function shake(elem, oncomplete, distance, time){
    //���Ԫ�ز���dom�ڵ㣬���Ԫ��Ϊdom�ڵ�
    if(typeof elem ==="string") elem = document.getElementById(elem);
    //����Ĭ�����Ϊ5px��Ĭ�϶���ʱ��
    if(!distance) distance = 5; // distance = distance || 5;
    if(!time) time = 500;

    var origialStyle = elem.style.cssText,//�洢elemԭ�ȵ���������ʽ
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

            //��25ms����ʱ���������ٴ����к����Բ���ÿ��40֡�Ķ���
            setTimeout(animate, Math.min(25, time-elapsed));
        }else{
            //����Ϊԭ������ʽ
            elem.style.cssText = origialStyle;
            if(typeof oncomplete === "function") oncomplete(elem)
        }
    }
}


function fadeOut(elem, oncomplete, time){
    //���Ԫ�ز���dom�ڵ㣬���Ԫ��Ϊdom�ڵ�
    if(typeof elem ==="string") elem = document.getElementById(elem);
    //����Ĭ��ʱ��
    if(!time) time = 500;

    var start = (new Date()).getTime(),
        ease = Math.sqrt;//��������


    animate();

    function animate(){
        var elapsed = (new Date()).getTime()-start,
            fraction = elapsed / time,
            opacity;

        if(fraction < 1){
            opacity = 1 - ease(fraction);
            elem.style.opacity = String(opacity);
            elem.style.filter = "alpha(opacity=" + Number(opacity)*100 + ")";

            //��25ms����ʱ���������ٴ����к����Բ���ÿ��40֡�Ķ���
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

    //������
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

    //��ͷβ�Ŀո�ȥ��������ո񻻳�һ���ո�
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


//Array.map����
(function(){
    if(Array.prototype.map){return;}
    Array.prototype.map =  function(func, context){
        var self = this.slice(0), //���ı�ԭ����
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

onload(function(){onLoad.loaded = true});


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

//��ͷҪ��һ���ܲ�����
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


var whenReady = (function(){/*����ִ�еĺ���*/
    var ready = false,
        funcs = [] /*��ִ�еĺ�������*/;

    function handler(e){
        if(ready) return;

        //readystatechange ������ �ĵ��������
        if(e.type === "readystatechange" && document.readyState !== "complete"){
            return
        }

        /**
         * ���д�ִ�еĺ�������
         * funcs.length��Ҫ�Ż�Ϊ var length = funcs.length;
         * ��ֹ�¼�����ִ�й����У�funcs����˸����¼�
         */
        for(var i = 0; i < funcs.length ; i++){
            funcs[i].call(document);
        }

        ready = true;
        funcs = null

    }

    //ע��ҳ�������ɵ��¼�
    if(document.addEventListener){
        document.addEventListener("DOMContentLoaded", handler, false);
        document.addEventListener("readystatechange", handler, false);
        window.addEventListener("load", handler, false);
    }else {
        //document.attachEvent("onDOMContentLoaded", handler); //IE8<=û��DOMContentLoaded
        document.attachEvent("onreadystatechange", handler);
        window.attachEvent("onload", handler);
    }


    //����whenReadyΪһ������
    return function(f){
        if(ready){ //���ҳ���Ѿ����غ��ˣ�����ִ�к���
            f.call(document);
        }else{
            funcs.push(f);
        }
    }
}());















