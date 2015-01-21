/**
 *	StringBuffer的构造函数,用户字符串的拼接
 */
function StringBuffer(){
	this.__string__  = new Array;
}

/**
 * 追加新的字符串 
 * @param {Object} str
 */
StringBuffer.prototype.append =  function(str){
	this.__string__.push(str);
};

/**
 * 返回拼接好的字符串 
 */
StringBuffer.prototype.toString = function(){
	return this.__string__.join('');
};
