/**
 * Created by lixuguang on 2015/12/1.
 */
Object.defineProperty(Object.prototype, "extend", {
    writable : true,
    enumerable : false,
    configurable : true,
    value : function(o){
        var names = Object.getOwnPropertyNames(o), //得到所有的自有属性，包含不可枚举的属性
            i = 0,
            len = names.length,
            desc;
        for( ; i < len; i++){
            if(names[i] in this) continue; //如果属性已经存在，则调过
            desc = Object.getOwnPropertyDescriptor(o, names[i]); //得到属性描述符
            Object.defineProperty(this, names[i], desc); //设置属性
        }
    }
});