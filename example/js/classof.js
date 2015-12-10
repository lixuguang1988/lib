/**
 * Created by lixuguang on 2015/12/1.
 */

function classof(o){
    if(o === null) return "Null";
    if(o === undefined) return "Undefined";
    return Object.prototype.toString.call(o).slice(8, -1);
}


/**
 * 检测非负整数
 * String(Math.floor(Math.abs(i))) === i;
 *
 */