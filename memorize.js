
function memorize(f){
    var cache = {}; //定义一个私有对象，用于缓存
    return function(){
        var key = arguments.length + Array.prototype.join.call(arguments, "");
        if(key in cache){
            return cache[key];
        }else{
           return cache[key] = f.apply(this, arguments);
        }
    }
}

function ala(){

}
for(var i = 0; i < 5; i++){
    (function(e){
        setTimeout(function(){
            console.log(e);
        }, i*100);
    }(i));
}


