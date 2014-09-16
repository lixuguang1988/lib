;(function($){
    
	function JModal(options){
		this.isIE6 = $.browser.msie && $.browser.version < 7 && !window.XMLHttpRequest;
		this.init();
	};

	JModal.prototype.title = function(options){
		var _ = this;
		_.$header.empty();
		if(options.title){
			$("<h2/>", {
			    "class" : "jmodal-title",
			    "html" : options.title
			}).appendTo(_.$header);
		}
		$("<a/>",{
		    "href" : "javascript:void(0)",
		    "html" : '×',
		    "class" : "jmodal-close",
		    "click" : function(){
		        _.close();
		    }
		}).appendTo(_.$header)
	};
	
	JModal.prototype.open = function(options){
	    var  _ = this;
	    
		_.$body.html('<div class="jmodal-loading">正在加载...</div>').css("height", options.height);

		//console.log(options);
		if(options.type === "inline" && options.id){
			_.$body.html($("#"+options.id).clone(true))
		}
		if(options.type === "html"){
			_.$body.html(options.html);
		}
		if(options.type === "ajax"  && options.url){
		    $.ajax({
		        url : options.url,
		        type : "POST",
		        data : options.data,
		        dateType : "html",
		        success : function(data){
		            _.$body.html(data);
		        },
		        error : function(){
		           _.$body.html("系统异常!"); 
		        }
		    })
		}
		
		if(options.type === "iframe"  && options.url){
		    _.$body.html('<iframe  id="fancybox-frame" name="fancybox-frame' + new Date().getTime() + '"  hspace="0" ' + ($.browser.msie ? 'allowtransparency="true"' : '') + ' src="' + options.url + '" width="'+ options.width +'"  height="'+ options.height +'" scrolling="' + options.scrolling + '" frameborder="0" ></iframe>'); 
		}

	};
	
	JModal.prototype.pos = function(options){
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
			width : options.width + "px",
			marginLeft : -Math.ceil(options.width/2),
			display : 'block'
		}).attr('class', "jmodal");
		
		if(options.pos == "absolute"){
			_.$modal.css("top", (_top + options.top) + "px");
			$(window).off('scroll', _.fixed);
		}else{
			_.$modal.css("top", options.top + "px").addClass('jmodal-fixed');
			if(_.isIE6){
				_.$modal.animate({
					top : options.top + _top
				}, "400");
				$(window).on('scroll', {top : options.top}, $.proxy(_.fixed, _));
			}
		}
		
		if(_.isIE6){
			_.$backdrop.css('height', Math.max($(window).height(), $('body').height()) );
		}
		_.$modal.addClass(options.wrapClass);
		
		if(options.overlay == false){
			_.$backdrop.hide();
		}
		
	};
	
	
	JModal.prototype.close = function(){
		this.$modal.hide();
		this.$backdrop.hide();
	};
	
	JModal.prototype.fixed =  function(event){
		this.$modal.css('top', $(window).scrollTop() + event.data.top + "px");
	};
	
	JModal.prototype.init = function(){
		var _ = this,
			str=[];
		str.push('<div class="jmodal"><div class="jmodal-content">');
		str.push('<div class="jmodal-header"></div>');
		str.push('<div class="jmodal-body"></div>');
		str.push('</div></div>');
		$("body").append(str.join(""));	
		
		if(_.isIE6){
			$('<iframe class="jmodal-backdrop" src="' + (/^https/i.test(window.location.href || '') ? 'javascript:void(false)' : 'about:blank' ) + '" scrolling="no" border="0" frameborder="0" tabindex="-1"></iframe>').appendTo("body");
		}
		$("body").append('<div class="jmodal-backdrop"></div>');	
		
		_.$modal = $('.jmodal');
		_.$body = $('.jmodal-body');
		_.$header = $('.jmodal-header');
		_.$backdrop = $('.jmodal-backdrop');
		
		_.$backdrop.on('click',  $.proxy(_.close, _));
	};
	
	var jModal = new JModal();
	
	$.fn.jmodal = function(options){
	    
		var defaults = $.extend({
			width : 500, //number 单位px
			height : "auto", //[number, auto] 单位px
			top : 120,
			scrolling : 'auto',
			pos : 'fixed', //[fixed, absolute]
			type : 'inline' //[inline, html, ajax, iframe]
		}, options);
		
    

		
		return this.on('click', function(ev){
			var config  = {};
			
			ev.preventDefault();
			
    		if(defaults.type === 'inline'){
    			config.id = $(this).data('id');
    		}
    		if(defaults.type === 'ajax' || defaults.type === 'iframe'){
    			config.url = $(this).data('url');
    			config.data = $(this).data("postData");
    		}

    		var config  = $.extend(defaults, config);
    		
			jModal.open(config);
			jModal.title(config);
			jModal.pos(config);
		});
	};
	

	
})(jQuery);
