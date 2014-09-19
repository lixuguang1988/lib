;(function($){
	
	function Jsuggest(){
		$('<div class="jsuggest" style="display:none;"><div class="jsuggest-inner"><ul class="jsuggest-content"></ul><div class="jsuggest-bar">关闭</div></div></div>').appendTo($('body'));
		Jsuggest.$content = $(".jsuggest-content");
		Jsuggest.$wrap = $(".jsuggest");
	}
	
	
	Jsuggest.bindEvent =  function(){
		$('.jsuggest-bar').on('click', Jsuggest.close);
	};
	
	Jsuggest.close = function(){
		//console.log(Jsuggest.$wrap + "close");
		Jsuggest.$wrap.hide();
	};
	
	
	Jsuggest.renderPosition = function(obj){
		var _offset = obj.offset(),
			_width = obj.outerWidth(),
			_height = obj.outerHeight(),
			_left = _offset.left,
			_top = _offset.top + _height;
		//console.log(obj + "renderPosition");
		
		Jsuggest.$wrap.css({
			position: 'absolute',
			width : _width,
			height : _height,
			left : _left,
			top : _top
		}).show();
			
	};
	

	
	
	Jsuggest.render = function(data){
		var ulStr = "";
		//console.log(data + "render");
		$.each(data, function(i, item){
			ulStr += '<li data-url='+ item.url +' onclick="Jsuggest.complete(\"'+item.title+'\", \"'+ item.url +'\")">';
			ulStr +='<span class="jsuggest-name">'+ item.title +'</span>';
			if(item.desc){
				ulStr +='<span class="jsuggest-desc">'+ item.desc +'</span>';
			}
			if(item.span){
				ulStr +='<span class="jsuggest-span">'+ item.span +'</span>';
			}
			ulStr +="</li>";
		});
		
		Jsuggest.$content.html(ulStr);
		
		
	};
	
	Jsuggest();
	
	$.fn.jsuggest = function(options){
		var defaults = $.extend({}, options);
 		
		return this.on({
			focus : function(ev){
				var _ = $(this);
				if(this.defaultValue == this.value && !!this.value){return}
				$.ajax({
					url : _.data('suggesthot'),
					dataType : "json",
					type : "POST"
				}).success(function(data){
					//console.log(data + "ajax");
					Jsuggest.render(data);
					Jsuggest.renderPosition(_);
				}).error(function(){
					console.log("errro");
				});
				
				
			},
			keyup : function(){
				var _ = $(this),
					that = this;
				$.ajax({
					url : _.data('suggesturl'),
					dataType : "json",
					type : "POST"
				}).success(function(data){
					//console.log(data + "keyup");
					Jsuggest.render(data, that);
					Jsuggest.renderPosition(_);
				}).error(function(){
					
				});
			},
			blur : function(){
				Jsuggest.close();
			}
		});
	};
})(jQuery);
