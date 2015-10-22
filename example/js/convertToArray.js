//ie8以前的NodeList是com对象
function convertToArray(nodes){
    var array = null;
    try{
        array = Array.prototype.slice.call(nodes, 0);
    }catch(ex){
        array = [];
        for(var i = 0, len = nodes.length; i < len; i++){
          array.push(nodes[i]);
        }
    }
    return array;
}
