/**
 * Created by lixuguang on 2015/12/1.
 */

function classof(o){
    if(o === null) return "Null";
    if(o === undefined) return "Undefined";
    return Object.prototype.toString.call(o).slice(8, -1);
}


/**
 * ���Ǹ�����
 * String(Math.floor(Math.abs(i))) === i;
 *
 */