/**
 * Created by lixuguang on 2015/11/30.
 */

/**
 * ��p�п�ö�ٵ����Ը��Ƶ�o�У�������o
 * ���o��p�к���ͬ�����ԣ��򸲸�o�е�����
 * ���������������getter��setter�Լ���������
 * �����������jquery��$.extend(defaultObject, sourceObject);
 * @param o Object
 * @param p Object
 * @returns o Object
 */
function extend(o, p){
    for(var prop in p){ //����p�е���������
        o[prop] = p[prop]; //��ӻ򸲸�o��
    }
    return o;
}

/**
 * ��p�п�ö�ٵ����Ը��Ƶ�o�У�������o
 * ���o��p�к���ͬ���������ԣ�o�е����Խ�����Ӱ��
 * ���������������getter��setter�Լ���������
 * @param o Object
 * @param p Object
 * @returns o Object
 */
function merge(o, p){
    for(var prop in p){ //����p�е���������
        if(o.hasOwnProperty(prop)) continue; //���˵�o��ͬ������������
        o[prop] = p[prop];
    }
    return o;
}

/**
 * ��o�е�������p��û��ͬ�����ԣ����o��ɾ���������
 * ������o
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
 * ��o�е�������p����ͬ�����ԣ����o��ɾ���������
 * ������o
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
 * ����һ��ͬʱӵ��o,p�����ԵĶ���
 * ���o��p�����������ԣ�ʹ��p�е�����ֵ
 * @param o Object
 * @param p Object
 * @returns o Object
 */
function union(o, p){
    //��ֱ���� extend(o, p)��ɶ������;
    return extend(extend({}, o), p);
}

/**
 * ����һ��o,p��ͬʱӵ�����ԵĶ���
 * ���o��p�����������ԣ�ʹ��o�е�����ֵ
 * @param o Object
 * @param p Object
 * @returns o Object
 */
function intersection(o, p){
    return restrict(extend({}, o), p);
}

/**
 * ����һ�����飬
 * ��������а�������o�п�ö�ٵ��������Ե�����
 * ���o��p�����������ԣ�ʹ��o�е�����ֵ
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





















