/**
 * Created by lixuguang on 2015/11/30.
 */

/**
 * 把p中可枚举的属性复制到o中，并返回o
 * 如果o和p中含有同名属性，则覆盖o中的属性
 * 这个函数并不处理getter和setter以及复制属性
 * 这个方法类似jquery中$.extend(defaultObject, sourceObject);
 * @param o Object
 * @param p Object
 * @returns o Object
 */
function extend(o, p){
    for(var prop in p){ //遍历p中的所有属性
        o[prop] = p[prop]; //添加或覆盖o中
    }
    return o;
}

/**
 * 把p中可枚举的属性复制到o中，并返回o
 * 如果o和p中含有同名自有属性，o中的属性将不受影响
 * 这个函数并不处理getter和setter以及复制属性
 * @param o Object
 * @param p Object
 * @returns o Object
 */
function merge(o, p){
    for(var prop in p){ //遍历p中的所有属性
        if(o.hasOwnProperty(prop)) continue; //过滤掉o中同名的自有属性
        o[prop] = p[prop];
    }
    return o;
}

/**
 * 把o中的属性在p中没有同名属性，则从o中删除这个属性
 * 并返回o
 * @param o Object
 * @param p Object
 * @returns o Object
 */
function restrict(o, p){
    var prop;
    for(prop in p){
        if(!(prop in o)) delete o[prop];
    }
    return o;
}

/**
 * 把o中的属性在p中有同名属性，则从o中删除这个属性
 * 并返回o
 * @param o Object
 * @param p Object
 * @returns o Object
 */
function subtract(o, p){
    var prop;
    for(prop in p){
        delete o[prop];
    }
    return o;
}

/**
 * 返回一个同时拥有o,p中属性的对象
 * 如果o和p中有重名属性，使用p中的属性值
 * @param o Object
 * @param p Object
 * @returns o Object
 */
function union(o, p){
    //跟直接用 extend(o, p)有啥区别呢;
    return extend(extend({}, o), p);
}

/**
 * 返回一个o,p中同时拥有属性的对象
 * 如果o和p中有重名属性，使用o中的属性值
 * @param o Object
 * @param p Object
 * @returns o Object
 */
function intersection(o, p){
    return restrict(extend({}, o), p);
}

/**
 * 返回一个数组，
 * 这个数组中包含的是o中可枚举的自有属性的名称
 * 如果o和p中有重名属性，使用o中的属性值
 * @param o Object
 * @returns o array
 */
function keys(o){
    if(typeof o !== "object") throw TypeError();
    if(o.keys()){
        return o.keys();
    }
    var result = [], prop;
    for(prop in o){
        if(o.hasOwnProperty(prop)){
            result.push(prop);
        }
    }
    return result;
}





















