/**
 * 一个对象添加一个私有属性
 * 在同一个作用域链中定义的两个闭包，共享同样的局部变量和变量
 * @param o object 待添加私有变量的名称
 * @param name any
 * @param predicate function 一个验证函数
 */
function addPrivateProperty(o, name, predicate){
    var value ;

    o["get" + name] = function(){return value;}

    o["set" + name] = function(v){
        if(predicate && !predicate(v)){
            throw Error(name + "is Invalid value");
        }else{
            value = v;
        }
    }
}