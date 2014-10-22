;(function($){
    /*
     * param 
     * jo jquery对象
     * options {}
     */
	function JTip(jo, options){
		this.cfg = options;
		this.timer  = null;
		this.render(jo);
		this.renderPosition(jo);
	};

	JTip.prototype.render = function(jo){
		var _ = this;
		_.$tip = $('<div class="jtip jtip-' + _.cfg.position + ' ' + _.cfg.wrapClass + '"/>').css({
			opacity : "0",
			width : _.cfg.width
		});
		_.$tip.append('<div class="jtip-content">' + jo.data("tip") + '</div><s></s>');
		$('body').append(_.$tip);
	};
	
	JTip.prototype.renderPosition = function(jo){
		var _ = this,
			jleft = jo.offset().left,
			jtop = jo.offset().top,
			jwidth = jo.outerWidth(),
			jheight = jo.outerHeight(),
			theight = _.$tip.outerHeight(),
			twidth = _.$tip.outerWidth(),
			fleft,
			ftop;
		
		if(_.cfg.position === "left"){
			ftop = jtop + Math.ceil(jheight/2) - Math.ceil(theight/2);
			fleft = jleft - twidth - 8; 
		}else if(_.cfg.position === "right"){
			ftop = jtop + Math.ceil(jheight/2) - Math.ceil(theight/2);
			fleft = jleft + jwidth + 8; 
			
		}else if(_.cfg.position === "top"){
			ftop = jtop - theight - 8;
			fleft = jleft + Math.ceil(jwidth/2) - Math.ceil(twidth/2); 
		}else{
			ftop = jtop + jheight + 8;
			fleft = jleft + Math.ceil(jwidth/2) - Math.ceil(twidth/2); 
		}
		
		
		_.$tip.css({
			"opacity": "1",
			"left" : fleft,
			"top" : ftop
		});
	};
	
	JTip.prototype.destory = function(){
		this.$tip.remove();
	};
	
	
	$.fn.jtip = function(options){
		var defaults = $.extend({
			width : "auto", //[auto, width]
			wrapClass : "",
			trigger : "mouseover", //[mouseover, click]
			position : "bottom"//[bottom, top, left, right]
		}, options),
		Jtip;
		
		return this.on(defaults.trigger, function(ev){
			Jtip = new JTip($(this), defaults);
		}).on("mouseout", function(){
			if(typeof Jtip === "undefined"){return;}
			Jtip.destory();
		});
	};
	
})(jQuery);