/**
 *
 *把字符串解析为xml文档
 *
 */
function parseXml(xml){
    var xmldoc = null,
        errors;
    if(typeof DOMParse != "undefined"){
        xmldoc = (new DOMParse).parseFromString(xml, "text/xml");
        errors = xmldoc.getElementsByTagName("parseError");
        if(errors.length){
            throw new Error("XML parsing error:" + errors[0].textContent);
        }
    }else if(typepf ActiveXObject  != "undefined"){
        xmldoc = createDocument();
        xmldoc.loadXML(xml);
        if(xmldoc.parseError != 0){
            throw new Error("XML parsing error:" + xmldoc.parseError.reason);        
        }
    }else{
        throw new Error("No XML parser available.");
    }
    return xmldoc;
}

/**
 *
 *把xml文档序列化为字符串
 *
 */
function serializeXml(xmldoc){
    if(typeof  XMLSerializer != "undefined"){
        return (new XMLSerializer).serializeToString(xmldoc);
    }else if(typeof xmldoc.xml){
        return xmldoc.xml;
    }else{
        throw new Error("Cound not serialize XML DOM.");
    }
}

function createDocument(){
    var versions = ["MSXML2.DOMDocument.6.0", "MSXML2.DOMDocument.3.0", "MSXML2.DOMDocument"],
        i = 0, len = versions.length;
    if(typeof arguments.callee.activeXString != "string"){
        for( ; i < len ; i++){
            try{
                new ActiveXObject(versions[i]);
                arguments.callee.activeXString = versions[i];
                break;
            }catch(ex){
                
            }
        }
    }
    return new ActiveXObject(arguments.callee.activeXString);
}
