/**
 * Created by lixuguang on 2015/12/1.
 */

var serialnum = {
    //_num��_��ͷ��ʾ˽������
    //��������ı�ʾ����,���ǹ���
    _num : 1,
    get next() { return this._num++;},
    set next(newNum) {
        if(newNum > this._num){
            this._num = newNum;
        }else{
            throw new Error("���кŵ�ֵҪ�ȵ�ǰֵ��...");
        }
    }
};


/*
 * ��ȡ next, ��ô���� next
 * ��ȡ: serialnum.next;
 * ����: serialnum.next = 1111;
 */


var random =  {
    get octet() { return Math.floor(Math.random() * 256);},
    get uint16(){ return Math.floor(Math.randon() * 65536); },
    get int16(){return Math.floor(Math.random() * 65536) - 32768;}
};