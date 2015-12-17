/**
 * Created by lixuguang on 2015/12/10.
 */

/**
 * var timer = invoke(function(){console.log("1s")}, 0, 1000)
 * clearTimeout(timer.id);
 * @param f  ��ִ�еĺ���
 * @param start  �״�ִ�е��ӳ�
 * @param interval ÿ��ִ�еļ��ʱ��
 * @param end   ִ�ж೤ʱ��/ִ�еĴ��� < (end-start)/interval
 * @returns {invoke}
 */
function invoke(f, start, interval, end){
    var self = this;
    start = start || 0;
    if(arguments.length <= 2){
        self.id = setTimeout(f, start);
    }else{
        self.id = setTimeout(fn, start); //�����״�ִ��
        function fn(){
            f();//ִ�к���
            self.id = setTimeout(fn, interval); //�����´�ִ��
        }
        if(end){
            setTimeout(function(){
                clearTimeout(self.id);
            }, end)
        }
    }
    return this;
}
