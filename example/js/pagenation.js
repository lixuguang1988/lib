/**
 * ex:
 * xbuildPage({
 *		total : 20, 
 *		cur: 5, 
 *		first : null,
 *		last: null,
 *		target : "#pages"
 * });
 * @param {Object} options
 */
function xbuildPage(options){
	var config  = $.extend({
			prev : '上一页',
			next : '下一页',
			first : '首页',
			last: '末页',
			show : 10,
			dot : '...',
			target : "#pagination"
		}, options),
		cur = config.cur,
		total = config.total,
		pagenation = '<span>总' + config.total + '页</span>',
		start = config.cur - config.show > 0 ?  config.cur - config.show  : 1,
		end = config.cur + config.show < config.total ? config.cur + config.show : total;
	
	if(!options.total || !options.cur || options.total < options.cur ){return false;}
	
	
	//上一页
	if(cur != 1 && config.prev){
		pagenation +="<a href='javascript:void(0);' data-page='" + (cur-1) + "'>"+config.prev+"</a>";
	}
	//首页
	if(cur != 1 && config.first){
		pagenation +="<a href='javascript:void(0);' data-page='" + (1) + "'>"+config.first+"</a>";
	}
	//前省略页
	if(start > 1 && config.dot){
		pagenation +="<span>...</span>";	
	}
	//当前页前面几页
	for( ; start <  cur ; start++ ){
		pagenation +="<a href='javascript:void(0);' data-page='" + start + "'>"+ start +"</a>";
	}
	//当前页
	pagenation +="<a class='current' href='javascript:void(0);' data-page='" + cur + "'>"+ cur +"</a>";
	//当前页后面几页
	for(var i = cur + 1 ; i <= end ; i++ ){
		pagenation +="<a href='javascript:void(0);' data-page='" + i + "'>"+ i +"</a>";
	}
	//后省略页
	if(end < total && config.dot){
		pagenation +="<span>...</span>";	
	}
	//末页
	if(cur != total && config.last){
		pagenation +="<a href='javascript:void(0);' data-page='" + total + "'>"+config.last+"</a>";
	}
	//下一页
	if(cur != total && config.next){
		pagenation +="<a href='javascript:void(0);' data-page='" + (cur+1) + "'>"+config.next+"</a>";
	}
	//写到页面
	$(config.target).html(pagenation);
}			