;(function($){
	function Message(options){
	    var defaults = $.extend({
	        width : 200,
	        ease : 500,
	        wrapClass : "warn"
	    }, options);
	    
	    var $message = $('<div  class="message message-'+ defaults.wrapClass +'"><div class="message-main">' + defaults.message + '</div></div>'),
	    	$close = $('<a href="javascript:void(0);">&#x000D7;</a>');
	    	
	    $message.append($close);
	    $('body').append($message);
	    
	    $message.css({
	    	"position" : "fixed",
	    	"top" : "0",
	    	"width" : defaults.width + "px",
	    	"left" : "50%",
	    	"margin-left" : (- Math.ceil(defaults.width/2) ) + "px"
	    });
	    
	    $close.on("click", function(){
	    	$message.animate({
	    		opacity : 0,
	    	}, defaults.ease, function(){
	    		$message.remove();
	    	})	
	    });
	    
	    //自动关闭窗口
	    if(defaults.delay){
	        defaults.timer = setTimeout(function(){
	        	$close.click();
	        }, defaults.delay);
	    }	
	};

}(jQuery));
