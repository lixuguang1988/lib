//link一定要添加到head里,才能保证浏览器兼容
function loadStyle(url){
    var link = document.createElement("link");
    link.rel="stylesheet";    
    link.type= "text/style";
    link.href = url;
    document.getElementsByTagName("head")[0].appendChild(link);
}


//IE<=8把style视为一个特殊的节点，不允许DOM访问的它的子节点.但是可以通过styleSheet属性的cssText来设置
//safari 3.0之前不能正确支持text属性
function loadStyleString(code){
    var style = document.createElement("style");
    style.type= "text/css";
    try{
        style.appendChild(document.createTextNode(code));
    }catch(ex){
        style.styleSheet.cssText = code;
    }
    document.getElementsByTagName("head")[0].appendChild(style);
}
