
function convertToArray(nodes){
    var array = null;
    try{
        array = Array.prototype.slice(nodes, 0);
    }catch(ex){
        array = [];
        for(var i = 0, len = nodes.length; i < len; i++){
          array.push(nodes[i]);
        }
    }
    return array;
}
