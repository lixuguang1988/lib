;(function($){
	$.fn.concactMsg =  function(options){
		var defaults = {
			width : '50px',
			height : '50px',
			delay : 300,
			timer : false
		};
		var config = $.extend(defaults, options);
		config.offset = parseInt($(".contacts").css('paddingTop'));
		
		this.on('click', function(){
			var _id = $(this).html(),
				_top = $("#" + _id).offset().top - config.offset;
				
			//清楚上次的提示
			$("#popMsg").remove(); 
			clearTimeout(config.timer);
			
			//写提示信息到页面
			$('body').append('<div id="popMsg" class="pop-msg '+ config.wrapClass +'" style="width:'+ config.width +';height:'+ config.height +';">' + _id + '</div>');
			
			//定位页面位置
			$('html, body').animate({
				scrollTop : _top
			}, 150);
			
			//清除提示信息
			config.timer = setTimeout(function(){
				$("#popMsg").remove();
			}, config.delay);			
		});
		return this;
	};
})(jQuery);
