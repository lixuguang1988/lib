function msg(options){
    var defaults = {
        width : '200px',
        height : 'auto',
        offset : '20px',
        timer : null
    };
    var config = $.extend(defaults, options);

    $("#msg").remove();
    if(config.timer){clearTimeout(config.timer);}
    $('body').append('<div id="msg" class="msg '+ config.wrapClass +'" style="width:'+ config.width +';height:'+ config.height +';margin-left:'+ -Math.ceil(parseInt(config.width)/2) +'px;">' + config.message + '</div>');
    if(config.delay){
        config.timer = setTimeout('closeMsg()', config.delay);
    }
}

function closeMsg(){
    $("#msg").animate({
    	opacity : 0,
    	}, 800, function(){
        $("#msg").remove();
    });
}


/*
.msg{background: #000;padding:10px;color:#fff;font-size: 14px;position: fixed;width: 200px;top: 45%;left:50%;text-align: center;
    -webkit-border-radius: 10px;
        -moz-border-radius:10px;
            border-radius: 10px;
}

msg({
  message : "提示消息",
  delay : 1000, //1s之后关闭
  wrapClass : 'wrap-msg'
});

*/
