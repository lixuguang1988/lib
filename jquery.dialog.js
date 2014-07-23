;(function($){
	$.fn.dialog = function(options){
		var defaults = {
			init : false,
			width : 500,
			top : 30,
			pos : 'fixed', //fixed, absolute
			type : 'inline' //inline, html, ajax, iframe
		};
		var config = this.config = $.extend(defaults, options);
		

		if(config.type == 'inline'){
			config.target = this.data('target');
		}
		if(config.type == 'ajax' || config.type == 'iframe'){
			config.target = this.data('url');
		}
		
		return this.on('click', function(){
			dialog.open(config);
			dialog.title(config);
			dialog.pos(config);
		});
	};
	
	function Dialog(options){
		this.isIE6 = $.browser.msie && $.browser.version < 7 && !window.XMLHttpRequest;
		this.init();
	};

	Dialog.prototype.title = function(options){
		var _ = this;
		if(options.title){
			_.modal.addClass('modal-with-title');
			_.modalTitle.html(options.title);
		}else{
			_.modal.removeClass('modal-with-title');
			_.modalTitle.html('');
		}
	};
	
	Dialog.prototype.open = function(options){
		$(".modal-body").empty();
		if(options.type == 'inline' && options.target){
			$(options.target).clone(true).appendTo('.modal-body');	
		}
		if(options.type == 'html'){
			_modalBody.html(options.html);
		}
	};
	
	Dialog.prototype.pos = function(options){
		var _ = this,
			_top = $(window).scrollTop();
		
		_.modalBackdrop.css({
			display : 'block',
			opacity : 0
		}).animate({
			opacity : '.5'
		},300);
		_.modal.css({
			width : options.width + "px",
			top : options.top + "px",
			marginLeft : -Math.ceil(options.width/2),
			display : 'block'
		});
		if(options.pos == "absolute"){
			_.modal.css({
				width : options.width + "px",
				top : (_top + options.top) + "px",
				marginLeft : -Math.ceil(options.width/2),
				display : 'block'
			}).addClass('modal-abs');
			$(window).off('scroll', _.fixed);
		}else{
			_.modal.css({
				width : options.width + "px",
				top : options.top + "px",
				marginLeft : -Math.ceil(options.width/2),
				display : 'block'
			}).removeClass('modal-abs');
			if(_.isIE6){
				_.modal.animate({
					top : options.top + _top
				});
				$(window).on('scroll', {top : options.top}, $.proxy(_.fixed, _));
			}
		}
		
		if(_.isIE6){
			_.modalBackdrop.css('height', $('body').height());
		}
		
	};
	
	
	Dialog.prototype.close = function(){
		var _  = this;
		_.modal.hide();
		_.modalBackdrop.hide();
	};
	
	Dialog.prototype.fixed =  function(event){
		this.modal.css('top', $(window).scrollTop() + event.data.top + "px");
	};
	
	Dialog.prototype.init = function(){
		var str=[],
			_ = this;
		str.push('<div class="modal" role="dialog">');
		str.push('<div class="modal-header clearfix">');
		str.push('<h1 class="modal-title"></h1>');
		str.push('<a href="javascript:void(0);"  class="icon modal-close" >x</a>');
		str.push('</div>');
		str.push('<div class="modal-body">');
		str.push('</div>');
		str.push('</div>');
		
		$("body").append(str.join(""));	
		if(_.isIE6){
			$('<iframe class="modal-backdrop" src="' + (/^https/i.test(window.location.href || '') ? 'javascript:void(false)' : 'about:blank' ) + '" scrolling="no" border="0" frameborder="0" tabindex="-1"></iframe>').appendTo("body");
		}else{
			$("body").append('<div class="modal-backdrop"></div>');	
		}
		_.initial = true;
		_.modal = $('.modal');
		_.modalBody = $('.modal-body');
		_.modalTitle = $('.modal-title');
		_.modalBackdrop = $('.modal-backdrop');
		
		
		$('.modal-close').on('click', $.proxy(_.close, _));
		_.modalBackdrop.on('dblclick',  $.proxy(_.close, _));
	};
	
	var dialog = new Dialog();
	
})(jQuery);
