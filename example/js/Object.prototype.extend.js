/**
 * Created by lixuguang on 2015/12/1.
 */
Object.defineProperty(Object.prototype, "extend", {
    writable : true,
    enumerable : false,
    configurable : true,
    value : function(o){
        var names = Object.getOwnPropertyNames(o), //�õ����е��������ԣ���������ö�ٵ�����
            i = 0,
            len = names.length,
            desc;
        for( ; i < len; i++){
            if(names[i] in this) continue; //��������Ѿ����ڣ������
            desc = Object.getOwnPropertyDescriptor(o, names[i]); //�õ�����������
            Object.defineProperty(this, names[i], desc); //��������
        }
    }
});