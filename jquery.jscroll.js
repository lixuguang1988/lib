;(function($){
	$.fn.jscroll = function(options){
		var defaults = $.extend({
			content : ".jscroll-wrap", //要移动元素的class名 $(this).find(content)
			prevButton : ".jscroll-prev", //下一个按钮class名 $(this).find(prevButton)
			type : 'rtl',  //水平滚动、垂直滚动[rtl, utd]
			nextButton : ".jscroll-next" //上一个按钮class名 $(this).find(nextButton)
		}, options);
		
		return this.each(function(){
			
			 var _this = $(this),
			 	_content = _this.find(defaults.content), //要移动的元素jquery对象,
			 	_next = _this.find(defaults.nextButton), //显示下一个按钮jquery对象,
			 	_prev = _this.find(defaults.prevButton), //显示上一个按钮jquery对象,
			 	_offset = _content.data('offset') ? _content.data('offset') : 0, //滚动几个了
			 	_length = _content.children().length, //
			 	_itemWidth = _content.children().outerWidth(true), //每次移动的宽度,最终移动的大小 step*colsWidth
			 	_realWidth = 0; //要移动的元素的真实宽度，默认是父元素100%宽度
			 	
			 	if(defaults.type === 'rtl'){
			 		_realWidth = _length * _itemWidth;
			 	}

				if(offset == 0){ _prev.css('opacity', '0.2');}
				_next.on('click', function(){
					if(offset + cols >= length ){ return false}
					
					scrollUL.stop(true, true).animate({
						top: '-=' + scrollUL.find('li').eq(offset).outerHeight(true)
					},500);
					
					offset += 1;
					downbtn.css('opacity', '1');
					if(offset + cols == length){
						_next.css('opacity', '0.2');	
					}
				
				});
			
				downbtn.on('click', function(){
					
					if(offset == 0 ){ return false}
					
					scrollUL.stop(true, true).animate({
						top: '+=' + scrollUL.find('li').eq(offset + cols -1).outerHeight(true)
					},500);
					
					offset -= 1;
					_next.css('opacity', '1');
					if(offset == 0){
						downbtn.css('opacity', '0.2');
					}			
				});		
			

			

			 

			
		});
	};
	
})(jQuery);
