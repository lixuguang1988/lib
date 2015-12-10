function  Set(){
    this.values = {};
    this.n = 0;
    this.add.apply(this, arguments); //调用实例的add方法
}


Set.prototype.add = function(){
    var i = 0,
        len = arguments.length,
        value = null;
    for(; i < len; i++){
        value = Set._v2s(arguments[i]);
        if(!this.values.hasOwnProperty(value)){
            this.values[value] = arguments[i];
            this.n++;
        }
    }
    return this; //保持链式调用
}


Set.prototype.remove =  function(){
    var i = 0,
        len = arguments.length,
        value = null;
    for(; i < len; i++){
        value = Set._v2s(arguments[i]);
        this.values[value] = arguments[i];
        if(this.values.hasOwnProperty(value)){
            delete this.values[value];
            this.n--;
        }
    }
    return this; //保持链式调用
}


Set.prototype.contains = function(val){
    return this.values.hasOwnProperty(Set._v2s(val));
}



Set.prototype.size = function(){
    return this.n;
}

Set.prototype.foreach = function(f, context){
    for(var prop in this.values){
        //只遍历自有属性
        if(this.values.hasOwnProperty(prop)){
            f.call(context, this.values[prop]);
        }
    }
    return this; //保持链式调用
}


/**
 * 生成值的唯一键名
 * @param val
 * @returns {*}
 * @private
 */
Set._v2s =  function(val){
    switch(val){
        case undefined : return "u" ; break;
        case null : return "n" ; break;
        case true : return "t"; break;
        case false : return "f";break;
        default: switch(typeof val){
            case "number" : return "#" + val; break;
            case "string" : return '"'+ val; break;
            default : return "@" + objectID(val)
        }
    }

    function objectID(o){
        var prop = "|**object**|";
        if(!o.hasOwnProperty(prop)){
            o[prop] = Set._v2s.next++;
        }
        return o[prop];
    }
}


Set._v2s.next = 100;


//var set = new Set(1, 2, {});
//set.add("li xuguang", true, false).add("li xuguang", true, false, null, undefined);
//console.log(set)
//console.log(set.contains(true));
//set.remove(true);
//
////set.foreach(console.log, null); //Illegal invocation
//
//set.foreach(log, null)
//function log(val){
//    console.log(val);
//}




