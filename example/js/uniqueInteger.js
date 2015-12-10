/**
 * Created by lixuguang on 2015/12/9.
 */


var UniqueInteger = (function(){
        var count = 0;
        return function(){
            return count++;
        }
}());


function counter(){
    var count = 0;
    return {
        count: function(){ return count++; },
        reset: function(){ count = 0; }
    };
}

function counterSimple(){
    var count = 0;
    return function(){
        return count++;
    }
}