/*
*
*
* $(".slide").jswitch({
*   autoplay : true ,  // true, false 自动切换
*   interval : 5000, //切换的时间间隔
*   prev : ".slide-prev", // 可无 上一帧
*   next : ".slide-next",// 可无 下一帧
*   triggerClass : "slide-trigger", // trigger的类名未实现
*   trigger : true, //true(有trigger), false(无trigger), classname(用页面已有的dom来控制切换) 
*   duration : 500, //动画延续的时间
*   enableTouch : false, //是否支持左右滑动的手势
*   effect : 'fade' // fade, slideLeft, -slideUp未实现-
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
        this.timer = false;
        
        this.init(); //初始化
        this.trigger(); //生成trigger
        this.bindEvent(); //绑定上下按钮事件
        
        if(this.cfg.enableTouch){
            this.bindTouch();//绑定左右滑动的事件        
        }
    };
    
    Jswitch.prototype.bindTouch = function(){
       var _ = this;
       
       _._content.on('touchstart', function(event){
           event.preventDefault();

           var oe = event.originalEvent;
           console.log(oe);
           _.tsPageX = oe.changedTouches[0] ? oe.changedTouches[0].pageX : 0;
       });

        _._content.on('touchmove', function(event){
            var oe  = event.originalEvent,
                tsPageX = _.tsPageX,
                lastPagex = _.lastPagex ? _.lastPagex : _.tsPageX,
                tePageX = oe.changedTouches[0] ? oe.changedTouches[0].pageX : 0,
                index,
                diff = tePageX - lastPagex;
            if(tsPageX && tePageX && _._len > 1){
                if(diff > 0){
                    console.log(diff);
                    _._items.eq(_._index).css("left", "+=" + diff );
                    index = (_._index + _._len - 1) % _._len;
                    _._items.eq(index).css("left", "+=" + diff );
                    _._items.eq((_._index + _._len + 1) % _._len).css("left", "+=" + diff );
                }if(diff < 0){
                    console.log("--" + diff);
                    _._items.eq(_._index).css("left", "+=" + diff );
                    index = (_._index + 1) % _._len;
                    _._items.eq(index).css("left", "+=" + diff );
                    _._items.eq((_._index + _._len - 1) % _._len).css("left", "+=" + diff );
                    // _.switchTo(index, 1);
                }
                _.lastPagex = tePageX;
            }

        });
       
       _._content.on('touchend', function(event){
           var oe  = event.originalEvent,
               tsPageX = _.tsPageX,
               tePageX = oe.changedTouches[0] ? oe.changedTouches[0].pageX : 0,
               diff = tePageX - tsPageX,
               index;
           if(tsPageX && tePageX){
               if(diff > 100){
                    index = (_._index + _._len - 1) % _._len;
                    _.switchTo(index, -1);
               }else if(diff < -100){
                    index = (_._index + 1) % _._len;
                    _.switchTo(index, 1);  
               }else{
                   _.touchCancel(diff);
               }
           }
           _.lastPagex = null;
       });
    };

    Jswitch.prototype.touchCancel =  function(){
        var _ = this;
        _._items.eq(_._index).css("left", "0px");
        _.updatePostion();
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
            this.updatePostion();
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
            var index = $(this).index();
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
        var _ = this,
            trigger1 = false,
            trigger2 = false;
        
        if(index == _._index ){return;} //避免快速点击动画频闪及到本身的点击
        
        clearTimeout(_.timer);
        _._items.stop(true, true);
        
        if(_.cfg.effect ==="slideLeft"){
            _._items.eq(index).animate({
                left : "0"
            }, _.cfg.duration, function(){
                _.auto(); // 开启定时器
                trigger1 = true;
                if(trigger2){
                    _.updatePostion();
                }
            });
            
            _._items.eq(this._index).animate({
                left : - flag * _._width
            }, _.cfg.duration,function(){
                trigger2 = true;
                if(trigger1){
                    _.updatePostion();
                }
            });         
        }else{
        
            _._items.eq(index).css({
                opacity : '0',
                zIndex : '7'
            }).animate({
                opacity : "1"
            }, _.cfg.duration, function(){
                $(this).css('zIndex', '6');
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

    Jswitch.prototype.updatePostion = function(){
        var _ = this;
        if(_.cfg.effect !=="slideLeft"){return false;}
        _._items.eq(_._index).siblings().css("left", _._width + 'px');
        _._items.eq((_._index + _._len - 1) % _._len).css("left", - _._width + 'px' );
        // _._items.eq((_._index + _._len + 1) % _._len).css("left",  _._width + 'px' );
        _._items.eq(_._index).css("left", 0); //_._items.length == 1
    };
    
    Jswitch.prototype.updateTrigger =  function(){
        if(!this.cfg.trigger){return false;}
        this._triggers.removeClass('current').eq(this._index).addClass('current');
    };
    
    Jswitch.prototype.auto =  function(){
        var  _ = this;
        clearTimeout(_.timer);
        if(_.cfg.autoplay){
            _.timer = setTimeout(function(){
                var index = (_._index + 1) % _._len ;
                _.switchTo(index, 1);
            }, _.cfg.interval);
        }
    };
    
    
    $.fn.jswitch = function(options){
        var defaults = {
            autoplay : true,
            interval : 5000,
            triggerClass : "slide-trigger",
            trigger : true,
            duration : 500,
            enableTouch : false,
            effect : 'fade' // fade, slideLeft, /*slideUp*/
        },
        el = [];
        defaults = $.extend(defaults, options);

        return this.each(function(i, v){
            if(defaults.effect == "slideLeft" && defaults.enableTouch == true){
                if($(this).find(".slide-item").length == 2){
                    $(this).find(".slide-content").append($(this).find(".slide-content").html());
                }
            }
            el[i]   = new Jswitch(defaults, $(this));
        });

    };
    
})(jQuery, window);