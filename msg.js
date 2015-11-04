;(function($){
	$.msg =  function(options){
	    var defaults = $.extend({
	        width : '200px'
	    }, options);
	    
	    //关闭已有窗口
	    $("#msg").remove();

	    $('body').append('<div id="msg" class="msg '+ defaults.wrapClass +'" style="width:'+ defaults.width +';margin-left:'+ -Math.ceil(parseInt(defaults.width)/2) +'px">' + defaults.message + '</div>');
	    
	    //自动关闭窗口
	    if(defaults.delay){
	        defaults.timer = setTimeout('$.closeMsg()', defaults.delay);
	    }	
	};
	
	$.closeMsg =  function(){
	    $("#msg").animate({
	    		opacity : 0
	    	}, 800, function(){
	        	$("#msg").remove();
	    });
	};

}(jQuery));

/*
.msg{background: #000;padding:10px;color:#fff;font-size: 12px;line-height:18px;position: absolute;width: 200px;top: 25%;left:50%;text-align: center;
    -webkit-border-radius: 10px;
        -moz-border-radius:10px;
            border-radius: 10px;
}
.danger-msg{background:#c00;text-shadow:0 -1px 0 #900}

msg({
  message : "提示消息",
  width: "200px",
  delay : 1000, //1s之后关闭
  wrapClass : 'danger-msg'  // [danger-msg]
});

*/
