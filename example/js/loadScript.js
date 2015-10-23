function loadScript(url){
    var script = document.createElement("script");
    script.type= "text/javascript";
    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
}


function loadScriptString(code){
    var script = document.createElement("script");
    script.type= "text/javascript";
    try{
        script.appendChild(document.createTextNode(code);
    }catch(ex){
        script.text = code;
    }
    document.getElementsByTagName("head")[0].appendChild(script);
}
