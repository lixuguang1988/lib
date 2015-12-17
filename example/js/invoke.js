/**
 * Created by lixuguang on 2015/12/10.
 */

/**
 * var timer = invoke(function(){console.log("1s")}, 0, 1000)
 * clearTimeout(timer.id);
 * @param f  待执行的函数
 * @param start  首次执行的延迟
 * @param interval 每次执行的间隔时间
 * @param end   执行多长时间/执行的次数 < (end-start)/interval
 * @returns {invoke}
 */
function invoke(f, start, interval, end){
    var self = this;
    start = start || 0;
    if(arguments.length <= 2){
        self.id = setTimeout(f, start);
    }else{
        self.id = setTimeout(fn, start); //设置首次执行
        function fn(){
            f();//执行函数
            self.id = setTimeout(fn, interval); //设置下次执行
        }
        if(end){
            setTimeout(function(){
                clearTimeout(self.id);
            }, end)
        }
    }
    return this;
}
