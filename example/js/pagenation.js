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
			show : 10, //前后显示的页码
			first : 1,
			dot : '...',
			target : "#pagination"
		}, options),
		cur = config.cur, //当前页码
		total = config.total, //总页码
		pagestr = '<span>总' + config.total + '页</span>',
		start = 1,
		end = config.show + cur > total ? total : config.show + cur;
	
	
	if(!options.total || !options.cur || options.total < options.cur ){return false;}
	
	config.last = config.last ? config.last : total;
	
	//前面的页码数大于要显示的页面
	if(cur - config.show > 0){
		start = cur - config.show;
		//后面页面不够显示,前面页码加上后面不够的
		if(config.total - cur < config.show){
			start -= (config.show + cur - total);
			//开始页码小于1
			start = start < 1 ? 1 : start;
		}
	}
	//后面页码数大于 要显示的页面
	if(end > config.show){
		//前面页码不够显示,后面页码加上前面不够的
		if(cur < config.show){
			end += config.show - cur;
			end = end > total ? total : end;
		}
	}
	
	//上一页
	if(cur != 1 && config.prev){
		pagestr +="<a href='javascript:void(0);' data-page='" + (cur-1) + "'>"+config.prev+"</a>";
	}
	
	//前省略页
	if(start > 1 && config.dot){
		pagestr +="<a href='javascript:void(0);' data-page='" + (1) + "'>" + config.first +"</a>";
		if(start != 2){
			pagestr +="<span>...</span>";	
		}
	}
	//当前页前面几页
	for( ; start <  cur ; start++ ){
		pagestr +="<a href='javascript:void(0);' data-page='" + start + "'>"+ start +"</a>";
	}
	//当前页
	pagestr +="<a class='current' href='javascript:void(0);' data-page='" + cur + "'>"+ cur +"</a>";
	//当前页后面几页
	for(var i = cur + 1 ; i <= end ; i++ ){
		pagestr +="<a href='javascript:void(0);' data-page='" + i + "'>"+ i +"</a>";
	}
	//后省略页
	if(end < total && config.dot){
		pagestr +="<span>...</span>";
	}
	//最后一页
	if(total - end > 0){
		pagestr +="<a href='javascript:void(0);' data-page='" + total + "'>"+config.last+"</a>";
	}
	//下一页
	if(cur != total && config.next && (total-cur) !=1){
		pagestr +="<a href='javascript:void(0);' data-page='" + (cur+1) + "'>"+config.next+"</a>";
	}
	//写到页面
	$(config.target).html(pagestr);
}			