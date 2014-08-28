/*
*
* ex https://web-c9-lixuguang.c9.io/slide.html
*
* $(".slide").jswitch({
*	autoplay : true ,  // true, false 自动切换
*	interval : 5000, //切换的时间间隔
*	prev : ".slide-prev", // 可无 上一帧
*	next : ".slide-next",// 可无 下一帧
*	triggerClass : "slide-trigger", // trigger的类名
*	trigger : true, //true(有trigger), false(无trigger), classname(用页面已有的dom来控制切换) 
*	duration : 500, //动画延续的时间
*	effect : 'fade' // fade, slideLeft, -slideUp未实现-
*  })
*
*
*/


;(function($, window, undefined){
	var Jswitch =  function(options, _$){
		this.cfg = options;
		this._content = _$.children('.slide-content');
		this._width = this._content.width();
		this._items = this._content.children('.slide-item');
		this._len = this._items.size();
		this._index = 0;
		this.switching = false;
		this.timer = false;
		
		this.init(); //初始化
		this.trigger(); //生成trigger
		this.bindEvent(); //绑定上下按钮事件
	};
	
	Jswitch.prototype.init = function(){
	    if(this.cfg.effect === "slideLeft"){
    		this._content.css({
    			'position' : 'relative'
    		});
    		this._items.css({
    			'position' : 'absolute',
    			'zIndex' : '5',
    			'width' : this._width,
    			'left' : this._width
    		}).eq(0).css( 'left',  '0');
	    }else{
    		this._content.css({
    			'position' : 'relative'
    		});
    		this._items.css({
    			'position' : 'absolute',
    			'zIndex' : '5',
    			'width' : this._width
    		}).eq(0).css('zIndex', '6');	        
	    }
		
		this.auto();
	};
	
	Jswitch.prototype.trigger =  function(){
		var _ = this,
		    arr = [],
		    i = 0,
		    trigger;
		    
		if(!this.cfg.trigger){return false;}  
		
		if(typeof this.cfg.trigger !== 'boolean' ){
			this._triggers = $(this.cfg.trigger).find('li');
			this._triggers.on('click', function(){
				var index = $(this).index();
				if(index  >= _._len){return false;}
				_.switchTo(index, (index > _._index ? 1 : -1));
			});
			return false;
		}
		for( ; i < this._len; i++){
			arr.push("<li>"+ (i+1) +"</li>");
		}
		trigger  = $("<ul/>", {
			'class' : this.cfg.triggerClass,
			'html' : arr.join('')
		});
		
		this._content.after(trigger);
		this._triggers = trigger.find('li');
		
		this._triggers.on('click', function(){
		    var	index = $(this).index();
			_.switchTo(index, (index > _._index ? 1 : -1));
		}).eq(0).addClass('current'); //并绑定点击事件,激活当前类
	
		
	
	};
	
	Jswitch.prototype.bindEvent =  function(){
		var _ = this;
		if(this.cfg.prev){
		    $(this.cfg.prev).on('click', function(){
		       var index = (_._index + _._len - 1) % _._len;
		        _.switchTo(index, -1);
		    });
		}
		if(this.cfg.next){
		    $(this.cfg.next).on('click', function(){
		       var index = (_._index + 1) % _._len;
		        _.switchTo(index, 1);
		    });
		}
	};
	
	Jswitch.prototype.switchTo =  function(index, flag){
		var _ = this;
		
		if(index == _._index || _.switching){return;} //避免快速点击动画频闪及到本身的点击
		
		_.switching = true;
		clearTimeout(_.timer);
		
		if(_.cfg.effect ==="slideLeft"){
    		_._items.eq(index).css({
    			left : flag * _._width
    		}).animate({
    			left : "0"
    		}, _.cfg.duration, function(){
    			_.switching = false; //更新图片轮转表示为false
    			_.auto(); // 开启定时器
    		});
    		
    		_._items.eq(this._index).animate({
    			left : - flag * _._width
    		}, _.cfg.duration,function(){
    			$(this).css('left', _._width);
    		});		    
		}else{
		
    		_._items.eq(index).css({
    			opacity : '0',
    			zIndex : '7'
    		}).animate({
    			opacity : "1"
    		}, _.cfg.duration, function(){
    			$(this).css('zIndex', '6');
    			_.switching = false; //更新图片轮转表示为false
    			_.auto(); // 开启定时器
    		});
    		
    		_._items.eq(this._index).animate({
    			opacity : '0'
    		}, _.cfg.duration, function(){
    			$(this).css('zIndex', '5');
    		});
		}
		
		_._index = index;  //更新_index
		_.updateTrigger(); //更新trigger
	};
	
	Jswitch.prototype.updateTrigger =  function(){
	    if(!this.cfg.trigger){return false;}
		this._triggers.removeClass('current').eq(this._index).addClass('current');
	};
	
	Jswitch.prototype.auto =  function(){
	    var  _ = this;
	    if(_.cfg.autoplay){
	        _.timer = setTimeout(function(){
	            var index = (_._index + 1) % _._len ;
	            _.switchTo(index, 1);
	        }, 5000);
	    }
	};
	
	
	$.fn.jswitch = function(options){
		var defaults = {
			autoplay : true,
			interval : 5000,
			triggerClass : "slide-trigger",
			trigger : true,
			duration : 500,
			effect : 'fade' // fade, slideLeft, /*slideUp*/
		},
		el = [];
		defaults = $.extend(defaults, options);
		this.each(function(i, v){
			el[i]	= new Jswitch(defaults, $(this));
		});
		
		return this; 
	};
	
})(jQuery, this);
