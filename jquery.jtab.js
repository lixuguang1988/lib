;(function($){
	$.fn.jtab = function(options){
		var defaults = $.extend({
			trigger : "mouseover", //触发事件[mouseover, click]
			currentClass : "current", //tab上的当前类
			preventDefault : true  //阻止默认事件 [true, false]
 		}, options);
 		
		return this.each(function(){
			var navs = $(this).find('.jtab-nav').children(),
				panels = $(this).find('.jtab-panels').children(),
				mores = $(this).find('.jtab-more').children();
			
			navs.on(defaults.trigger, function(ev){
				if(defaults.preventDefault){ 
					ev.preventDefault();
				}
				var i = $(this).index(); 
				$(this).addClass(defaults.currentClass).siblings().removeClass(defaults.currentClass);
				mores.hide().eq(i).show();
				panels.hide().eq(i).show();
			});
			
		});
	};
})(jQuery);
