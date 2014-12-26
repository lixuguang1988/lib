;(function($){
    
	function Modal(options){
		this.isIE6 = $.browser.msie && $.browser.version < 7 && !window.XMLHttpRequest;
		this.cfg = options;
		this.init();
	};

	Modal.prototype.init = function(){
		var _ = this;
		
		//创建骨架, 设置快捷的jquery对象访问
		_.$modal = $('<div class="jmodal"></div>');
		_.$modalcontent = $('<div class="jmodal-content">');
		_.$body = $('<div class="jmodal-body"></div>');
		_.$header = $('<div class="jmodal-header"></div>');
		_.$btn = $('<div class="jmodal-btn"></div>');

		if(_.isIE6){
			_.$backdrop = $('<div class="jmodal-backdrop"></div><iframe class="jmodal-backdrop" src="' + (/^https/i.test(window.location.href || '') ? 'javascript:void(false)' : 'about:blank' ) + '" scrolling="no" border="0" frameborder="0" tabindex="-1"></iframe>');
		}else{
			_.$backdrop = $('<div class="jmodal-backdrop"></div>');	
		}
		
		_.$modalcontent.append(_.$header, _.$body, _.$btn);
		_.$modal.append(_.$modalcontent);
		$("body").append(_.$backdrop, _.$modal);
		
		_.$backdrop.on('click',  $.proxy(_.close, _));
		
		_.open(); //打开窗口
		_.title(); //设置标题
		_.btn(); //设置按钮
		_.pos(); //调整窗口位置
	};
	
	//主要用来控制主窗口里面显示的内容
	Modal.prototype.open = function(){
	    var  _ = this;
	    
	    //运行打开前的回调函数
	   	if(typeof _.cfg.onopen === 'function'){
			this.cfg.onopen(_.cfg.elem, _.cfg, _);
		}
	    
		_.$body.html('<div class="jmodal-loading">正在加载...</div>').css("height", _.cfg.height);

		//console.log(_.cfg);
		//显示document里面的页面元素
		if(_.cfg.type === "inline" && _.cfg.id){
			_.$body.empty().append($("#" + _.cfg.id).show());
		}
		//显示自定义的内容
		if(_.cfg.type === "html"){
			_.$body.html(_.cfg.html);
		}
		//加载ajax的内容
		if(_.cfg.type === "ajax"  && _.cfg.url){
		    $.ajax({
		        url : _.cfg.url,
		        type : "POST",
		        data : _.cfg.data,
		        dateType : "html",
		        success : function(data){
		            _.$body.html(data);
		            _.pos();
		        },
		        error : function(){
		           _.$body.html("系统异常!"); 
		        }
		    });
		}
		//加载iframe
		if(_.cfg.type === "iframe"  && _.cfg.url){
		    _.$body.html('<iframe id="jmodal-frame" name="jmodal-frame' + new Date().getTime() + '"  hspace="0" ' + ($.browser.msie ? 'allowtransparency="true"' : '') + ' src="' + _.cfg.url + '" width="'+ _.cfg.width +'"  height="'+ _.cfg.height +'" scrolling="' + _.cfg.scrolling + '" frameborder="0" ></iframe>'); 
		}
	};
	
	Modal.prototype.title = function(){
		var _ = this;
		
		if(_.cfg.title){
			$("<h2/>", {
			    "class" : "jmodal-title",
			    "html" : _.cfg.title
			}).appendTo(_.$header);
			_.$header.removeClass("jmodal-header-null");
		}else{
			_.$header.addClass("jmodal-header-null");
		}
		$("<a/>",{
		    "href" : "javascript:void(0)",
		    "html" : '×',
		    "class" : "jmodal-close",
		    "click" : function(){
		        _.close($(this).data('dispatchevent'));
		    }
		}).appendTo(_.$header);
	};
	

	
	Modal.prototype.pos = function(){
		var _ = this, 
			_scrollTop = $(window).scrollTop(),
			_posTop = 0;
		
		//控制背景
		if(_.cfg.overlay == false){
			_.$backdrop.css('opacity', '0');
		}else{
			_.$backdrop.animate({
				opacity : '.5'
			},300);
		}
		//把遮罩层覆盖整个窗口
		if(_.isIE6){
			_.$backdrop.css('height', Math.max($(window).height(), $('body').height()) );
		}
		
		//显示主体并重置类名追加新设置的类名
		_.$modal.css({
			width : _.cfg.width,
			marginLeft : -_.cfg.width/2,
			display : 'block'
		}).attr('class', "jmodal " + _.cfg.wrapClass );
		
		
		//定位的方式[absolute, fixed]
		if(_.cfg.pos == "absolute" || _.isIE6 ){
			_posTop = renderAbsolutePosition(_.cfg.top, _scrollTop, _.$modal.height(), $(window).height());
			if(_.isIE6){
				$(window).on('scroll', $.proxy(_.fixedIE6Postion, _));
			}
		}else{
			if(_.cfg.top === "center"){
				_posTop = ($(window).height() - _.$modal.height())/2;
			}else{
				_posTop =  _.cfg.top ;
			}
			_.$modal.addClass('jmodal-fixed');
		}
		_.$modal.animate({top :  _posTop + "px"}, _.cfg.easing);
				
	};
	
	Modal.prototype.fixedIE6Postion =  function(){
		var _ = this, 
		_renderTop = renderAbsolutePosition(_.cfg.top, $(window).scrollTop(), _.$modal.height(), $(window).height());
		_.$modal.animate({top :  _renderTop + "px"}, _.cfg.easing);
	};	
	
	

	Modal.prototype.close = function(noDispatchEvent){
		//关闭jmodal之前调用回调函数
		if(typeof this.cfg.onclose === 'function' && typeof noDispatchEvent === "undefined"){
			this.cfg.onclose(this.cfg.elem, this.cfg, this);
		}
		if(this.cfg.type === "inline" && this.cfg.id){
			$("#" + this.cfg.id).hide().appendTo($('body'));
		}
		this.$modal.remove();
		this.$backdrop.remove();
	};
	
	Modal.prototype.btn =  function(){
		if(!this.cfg.cancle && !this.cfg.confirm){
			this.$btn.hide();
			return false;
		}
		this.readerBtn(this.cfg.cancle, this.cfg.oncancle);
		this.readerBtn(this.cfg.confirm, this.cfg.onconfirm);

	};
	
	Modal.prototype.readerBtn= function(btnName, btnCallback){
		var _ = this, flag = true; //flag根据回调函数的返回值确定是否关闭弹窗
		if(!btnName){return false;}
		$("<a/>",{
		    "href" : "javascript:void(0)",
		    "html" : btnName,
		    "click" : function(ev){
		    	ev.preventDefault();
		    	if(typeof btnCallback === "function"){
		    		flag = btnCallback(_.cfg.elem, _.cfg, _);
		    	}
		    	if(flag !== false){
		    		_.close();
		    	}
		    }
		}).appendTo(_.$btn);		
	};
	
	/*
	 * type 指定的定位方式 ['center', number]
	 * scrollTop 滚动条的位置
	 * modalHeight 弹出框的高度
	 * widthHeight 视口的高度
	 */
	function renderAbsolutePosition(type, scrollTop, modalHeight, widthHeight){
		var _top;
		if(type == "center"){//定位到视口中间
			_top = (widthHeight - modalHeight)/2 + scrollTop;
		}else{ 
			_top = scrollTop + type;
		}	
		return _top;
	}
	
	
	$.fn.jmodal = function(options){
		var defaults = $.extend({
		     width : 500, //number 单位px
		     height : 'auto', //[number, auto] 单位px
		     wrapClass : '',  //指定弹窗自定义的类名
		     overlay : true, //背景色 boolean
		     title : '', //指定弹窗窗口的名称
		     top : 'center', //['center', number] 弹出窗口里视口顶端的距离
		     easing : 600, //弹出窗口显示出来的时间
		     cancle : '', //指定取消的文字
		     oncancle : null, //点击取消的回调函数(函数返回===false不关闭窗口)
		     confirm : '', //指定确定的文字
		     onconfirm : null, //点击确认的回调函数(函数返回===false不关闭窗口)
		     onopen : null, //窗口打开前的回调函数
		     onclose : null, //窗口关闭前的回调函数
		     pos : 'fixed', //['fixed', 'absolute'] 指定弹窗的定位方式
		     type : 'inline', //['inline', 'html', 'ajax', 'iframe']
		     scrolling : 'auto', //当type=iframe 指定iframe的滚动条
		     html : '' //当type=html 设置弹出窗口的显示的html内容
		}, options);
		
		return this.on('click', function(ev){
			var config  = {}, modal;
			
			ev.preventDefault();
			
			//保存当前元素到config里面
			config.elem = this;
			
    		if(defaults.type === 'inline'){
    			config.id = $(this).data('id');
    		}
    		if(defaults.type === 'ajax' || defaults.type === 'iframe'){
    			config.url = $(this).data('url');
    			config.data = $(this).data("postData");
    		}

    		config  = $.extend(defaults, config);
    		modal = new Modal(config);
		});
	};
	
	
	//staic function 静态方法
	/*
	 * index :关闭那个弹出窗口,有多个弹出窗口的时候
	 * noDispatchEvent 设置true，表示不触发窗口的关闭回调函数
	 */
	$.fn.jmodal.destory = function(index, noDispatchEvent){
		if(arguments.length == 2){
			if(typeof index === 'number'){
				$(".jmodal-close").eq(index).data('dispatchevent', true).trigger('click');
			}else{
				$(".jmodal-close").data('dispatchevent', true).trigger('click');
			}
		}
	};
	
	$.fn.jmodal.open = function(options){
		options = $.extend({url : null}, options);
		var triggerDom = $('<a style="display:none" data-url="'+ options.url + '"  href="'+ (options.url ? options.url : "javascript:void(0);") + '"></a>');
		triggerDom.appendTo($('body'));
		triggerDom.jmodal(options).trigger('click').remove();
	};
	
})(jQuery);
