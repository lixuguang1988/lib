/**
 * Created by lixuguang on 2015/12/1.
 */

var serialnum = {
    //_num以_开头表示私有属性
    //这个社区的表示方法,不是规则
    _num : 1,
    get next() { return this._num++;},
    set next(newNum) {
        if(newNum > this._num){
            this._num = newNum;
        }else{
            throw new Error("序列号的值要比当前值大...");
        }
    }
};


/*
 * 读取 next, 怎么设置 next
 * 读取: serialnum.next;
 * 设置: serialnum.next = 1111;
 */


var random =  {
    get octet() { return Math.floor(Math.random() * 256);},
    get uint16(){ return Math.floor(Math.randon() * 65536); },
    get int16(){return Math.floor(Math.random() * 65536) - 32768;}
};