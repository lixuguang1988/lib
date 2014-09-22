;(function($){
	var suggest, timer;
	
	/*
	 * params 
	 * data: 服务器端返回带显示的数据
	 * $obj: input的jQuery对象
	 * kyup: 是否是匹配输入的内容 kyup=="kyup" 为是
	 * 
	 */
	function Jsuggest(data, $obj, kyup){
		//取消resize事件
		$(window).off('resize', this.renderPosition($obj));
		$('.jsuggest').remove();
		
		//存储input的jQuery对象
		this._$input = $obj;
		
		//组装结构
		$('<div class="jsuggest" style="display:none;"><div class="jsuggest-inner"><ul class="jsuggest-content"></ul><div class="jsuggest-bar">关闭</div></div></div>').appendTo($('body'));
		
		//关闭事件
		$('.jsuggest-bar').on('click', this.close);
		
		this.render(data, kyup); //填充数据
		this.renderPosition($obj); //渲染位置
		
		//resize事件
		$(window).on('resize', this.renderPosition($obj));
	}
	
	
	Jsuggest.prototype.close = function(){
		clearTimeout(timer);
		$('.jsuggest').remove();
	};
	
	
	Jsuggest.prototype.renderPosition = function(obj){
		$('.jsuggest').css({
			position: 'absolute',
			width : obj.outerWidth() + "px",
			height : obj.outerHeight() + "px",
			left : obj.offset().left + "px",
			top : (obj.offset().top + obj.outerHeight()) + "px"
		}).show();
	};
	
	
	Jsuggest.prototype.render = function(data, kyup){
		var _ = this,
			ulStr = "";
		//组装数据	
		$.each(data, function(i, item){
			ulStr += '<li>';
			if(item.url) ulStr +='<a href="'+ item.url +'" target="_blank">';
			ulStr +='<span class="jsuggest-name">'+ item.title +'</span>';
			if(item.desc) ulStr +='<span class="jsuggest-desc">'+ item.desc +'</span>';
			if(item.span) ulStr +='<span class="jsuggest-span">'+ item.span +'</span>';
			if(item.url) ulStr +='</a>';
			ulStr +="</li>";
		});
		$(".jsuggest-content").html(ulStr);
		
		//绑定li点击事件
		if(kyup == "kyup"){
			$(".jsuggest-content").find("li").click(function(ev){
				ev.preventDefault();
				_._$input.val($(this).find(".jsuggest-name").html()).parents('form').submit();
				timer = setTimeout( function(){
					_.close();
				}, 50);
			});
		}
	};
	
	
	$.fn.jsuggest = function(options){
		var defaults = $.extend({}, options);
	
		return this.on({
			focus : function(ev){
				var _ = $(this);
				clearTimeout(timer); //清除关闭的定时器
				$.ajax({
					url : _.data('suggesthot'),
					dataType : "json",
					type : "POST"
				}).success(function(data){
					suggest = new Jsuggest(data, _);
				}).error(function(){
					console.log("errro");
				});
			},
			keyup : function(){
				var _ = $(this);
				clearTimeout(timer); //清除关闭的定时器
				$.ajax({
					url : _.data('suggesturl'),
					dataType : "json",
					data : {key : _.val()},
					type : "POST"
				}).success(function(data){
					suggest = new Jsuggest(data, _, 'kyup');
				});
			},
			blur : function(){
				var _ = this;
				clearTimeout(timer);
				timer = setTimeout( function(){
					suggest.close();
				}, 200);
			}
		});
	};
})(jQuery);