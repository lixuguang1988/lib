function outputAttributes(element){
    var pairs = [],
        i = 0,
        attrs = element.attributes
        len = attrs.length,
        attrName,
        attrValue;
    
    for( ; i < len ; i++){
        if(attrs[i].specified){
            attrName = attrs[i].nodeName;
            attrValue = attrs[i].nodeValue;
            pairs.push(attrName + "=" + attrValue;
        }
    }
    pairs.join(";");
}
