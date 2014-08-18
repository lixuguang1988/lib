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
