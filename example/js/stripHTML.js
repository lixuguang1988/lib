/**
 * 去掉所有的HTML标签 <xxx>
 */
String.prototype.stripHTML = function(){
	return this.replace(/<(?:.|\s)*?>/g, "");
};

