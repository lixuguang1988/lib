;(function($){
    
	function JModal(options){
		this.isIE6 = $.browser.msie && $.browser.version < 7 && !window.XMLHttpRequest;
		this.cfg = options;
		this.init();
	};

	JModal.prototype.title = function(){
		var _ = this;
		
		if(_.cfg.title){
			$("<h2/>", {
			    "class" : "jmodal-title",
			    "html" : _.cfg.title
			}).appendTo(_.$header);
		}
		$("<a/>",{
		    "href" : "javascript:void(0)",
		    "html" : '×',
		    "class" : "jmodal-close",
		    "click" : function(){
		        _.close();
		    }
		}).appendTo(_.$header);
	};
	
	JModal.prototype.open = function(){
	    var  _ = this;
	    
	    //打开jmodal之前调用回调函数
	   	if(typeof _.cfg.onopen === 'function'){
			this.cfg.onopen();
		}
	    
		_.$body.html('<div class="jmodal-loading">正在加载...</div>').css("height", _.cfg.height);

		//console.log(options);
		if(_.cfg.type === "inline" && _.cfg.id){
			_.$body.html($("#"+_.cfg.id).clone(true));
		}
		if(_.cfg.type === "html"){
			_.$body.html(_.cfg.html);
		}
		if(_.cfg.type === "ajax"  && _.cfg.url){
		    $.ajax({
		        url : _.cfg.url,
		        type : "POST",
		        data : _.cfg.data,
		        dateType : "html",
		        success : function(data){
		            _.$body.html(data);
		        },
		        error : function(){
		           _.$body.html("系统异常!"); 
		        }
		    });
		}
		
		if(_.cfg.type === "iframe"  && _.cfg.url){
		    _.$body.html('<iframe  id="fancybox-frame" name="fancybox-frame' + new Date().getTime() + '"  hspace="0" ' + ($.browser.msie ? 'allowtransparency="true"' : '') + ' src="' + _.cfg.url + '" width="'+ _.cfg.width +'"  height="'+ _.cfg.height +'" scrolling="' + _.cfg.scrolling + '" frameborder="0" ></iframe>'); 
		}

	};
	
	JModal.prototype.pos = function(){
		var _ = this,
			_top = $(window).scrollTop();
		
		//显示背景
		_.$backdrop.css({
			display : 'block',
			opacity : 0
		}).animate({
			opacity : '.5'
		},300);
		
		//显示主体并重置类名
		_.$modal.css({
			width : _.cfg.width + "px",
			marginLeft : -Math.ceil(_.cfg.width/2),
			display : 'block'
		}).attr('class', "jmodal");
		
		if(_.cfg.pos == "absolute"){
			_.$modal.css("top", (_top + _.cfg.top) + "px");
			$(window).off('scroll', _.fixed);
		}else{
			_.$modal.css("top", _.cfg.top + "px").addClass('jmodal-fixed');
			if(_.isIE6){
				_.$modal.animate({
					top : _.cfg.top + _top
				}, "400");
				$(window).on('scroll', {top : _.cfg.top}, $.proxy(_.fixed, _));
			}
		}
		
		if(_.isIE6){
			_.$backdrop.css('height', Math.max($(window).height(), $('body').height()) );
		}
		_.$modal.addClass(_.cfg.wrapClass);
		
		if(_.cfg.overlay == false){
			_.$backdrop.hide();
		}
		
	};
	
	
	JModal.prototype.close = function(){
		//关闭jmodal之前调用回调函数
		if(typeof this.cfg.onclose === 'function'){
			this.cfg.onclose();
		}
		this.$modal.remove();
		this.$backdrop.remove();
	};
	
	JModal.prototype.fixed =  function(event){
		this.$modal.css('top', $(window).scrollTop() + event.data.top + "px");
	};
	
	JModal.prototype.init = function(){
		var _ = this,
			str = [];
			
		str.push('<div class="jmodal"><div class="jmodal-content">');
		str.push('<div class="jmodal-header"></div>');
		str.push('<div class="jmodal-body"></div>');
		str.push('<div class="jmodal-btn></div>"');
		str.push('</div></div>');
		str.push('<div class="jmodal-backdrop"></div>');
		if(_.isIE6){
			str.push('<iframe class="jmodal-backdrop" src="' + (/^https/i.test(window.location.href || '') ? 'javascript:void(false)' : 'about:blank' ) + '" scrolling="no" border="0" frameborder="0" tabindex="-1"></iframe>');
		}		
		$("body").append(str.join(""));	
		
		_.$modal = $('.jmodal');
		_.$body = $('.jmodal-body');
		_.$header = $('.jmodal-header');
		_.$btn = $('.jmodal-btn');
		_.$backdrop = $('.jmodal-backdrop');
		
		_.$backdrop.on('click',  $.proxy(_.close, _));
	};
	
	$.fn.jmodal = function(options){
		var defaults = $.extend({
			width : 500, //number 单位px
			height : "auto", //[number, auto] 单位px
			top : 120,
			scrolling : 'auto',
			//cancle : "取消",
			//confirm : "确定",
			//onopen : function(){alert("before open");}
			//onclose : function(){alert("before close");}, 
			pos : 'fixed', //[fixed, absolute]
			type : 'inline' //[inline, html, ajax, iframe]
		}, options);
		
		return this.on('click', function(ev){
			var config  = {},
				modal;
			ev.preventDefault();
			
    		if(defaults.type === 'inline'){
    			config.id = $(this).data('id');
    		}
    		if(defaults.type === 'ajax' || defaults.type === 'iframe'){
    			config.url = $(this).data('url');
    			//config.data = $(this).data("postData");
    		}

    		config  = $.extend(defaults, config);
    		
    		modal = new JModal(config);
			modal.open();
			modal.title();
			modal.pos();
			modal.btn();
		});
	};
	
})(jQuery);