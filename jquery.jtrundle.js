;(function($){
	$.fn.jtrundle = function(options){
		var defaults = $.extend({
			content : ".jtd-content", //要移动元素的class名 $(this).find(content)
			prevButton : ".prev-btn", //下一个按钮class名 $(this).find(prevButton)
			nextButton : ".next-btn" //上一个按钮class名 $(this).find(nextButton)
		}, options);
		
		return this.each(function(){
			
			 var _content = $(this).find(defaults.content), //要移动的元素jquery对象,
			 	_next = $(this).find(defaults.nextButton), //显示下一个按钮jquery对象,
			 	_prev = $(this).find(defaults.prevButton), //显示上一个按钮jquery对象,
			 	colsWidth = _content.children().outerWidth(true), //每次移动的宽度,最终移动的大小 step*colsWidth
			 	realWidth = _content.children().length * colsWidth, //要移动的元素的真实宽度，默认是父元素100%宽度
			 	wrapWidth = $(this).width(); //元素的宽度	
			 
			//禁用上一个按钮
			_prev.addClass('disabled');
			
			//进入元素增加.jtd-hover, 移出元素删除.jtd-hover
			$(this).hover(function(){
				$(this).addClass('jtd-hover');
			}, function(){
				$(this).removeClass('jtd-hover');
			});

			 //要移动的元素没有超出,禁用
			 if(realWidth < wrapWidth ){
				 _next.addClass('disabled'); 
				 _prev.addClass('disabled'); 
				 return false;
		     }
			 _content.css('width', realWidth);
			 
			//下一个按钮的click事件
			 _next.on("click", function(){
				 var left = parseInt( _content.css("left") ); //得到带移动元素的Left位置
				 
				 //已经移动到最后一个元素
				 if(realWidth + left <= wrapWidth){
					 _next.addClass('disabled'); 
					 return false;
				 }
				 _content.stop(true, true).animate({
					 left : "-=" + colsWidth
				 }, 500, function(){
					 left = parseInt( _content.css("left") ); //得到带移动元素的Left位置
					 if(realWidth + left <= wrapWidth){
						 _next.addClass('disabled'); 
		             }
					 _prev.removeClass('disabled');
				 });
			 });
			 _prev.on("click", function(){
				 var left = parseInt( _content.css("left") ); //得到带移动元素的Left位置
				 
				 //已经第一个元素在最初的位置
		    	 if(left >= 0){ 
		    		 _prev.addClass('disabled'); 
		    		 return false;
		    	 }
		    	 _content.stop(true, true).animate({
		    		 left : "+=" + colsWidth
		         }, 500, function(){
		        	 if( parseInt( _content.css("left") ) >= 0){
		    		 	_prev.addClass('disabled'); 
		        	 }
		        	 _next.removeClass('disabled');
		         });
		     });
			
		});
	};
	
})(jQuery);
