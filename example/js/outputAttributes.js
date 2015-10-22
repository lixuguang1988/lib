function outputAttributes(element){
    var pairs = [],
        i = 0,
        attrs = element.attributes
        len = attrs.length,
        attrName,
        attrValue;
    
    while( i < len ){
        //只返回指定值的属性
        //ie7<=会把没设置属性的属性都打印出来
        //class = "" 是设置的属性
        if(attrs[i].specified){
            attrName = attrs[i].nodeName;
            attrValue = attrs[i].nodeValue;
            pairs.push(attrName + "=" + attrValue;
        }
        i++;
    }
    pairs.join(";");
}
