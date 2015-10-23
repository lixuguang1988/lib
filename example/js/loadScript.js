function loadScript(url){
    var script = document.createElement("script");
    script.type= "text/javascript";
    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
}


//IE<=8把script视为一个特殊的节点，不允许DOM访问的它的子节点.但是可以通过text属性指定javascript代码
//safari 3.0之前不能正确支持text属性
function loadScriptString(code){
    var script = document.createElement("script");
    script.type= "text/javascript";
    try{
        script.appendChild(document.createTextNode(code));
    }catch(ex){
        script.text = code;
    }
    document.getElementsByTagName("head")[0].appendChild(script);
}
