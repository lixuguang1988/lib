//base on 
//https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/now
if(!Date.now){
	Date.now = function(){
		return (new Date).valueOf();
	};
}
