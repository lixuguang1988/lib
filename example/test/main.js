// JavaScript Document

$(document).ready(function(){

	$(".drop-dt").dropmenu();

	//equalHeight();

	//分享
	$(".icon-qzone, .icon-qq, .icon-weibo").each(function(){
		$this = $(this);
		var _title = $(this).parents(".uvod").find('h1').html(),
			_url = window.location.href;
		var p = {
			url: _url,
			//desc: $this.data('desc'),/*默认分享理由(可选)*/
			title: _title/*分享标题(可选)*/
			//pics: $this.data('pics')
		};
		var s = [];
		for(var i in p){
			s.push(i + '=' + encodeURIComponent(p[i]||''));
		}
		$this.attr('href', $this.attr('href') + s.join('&'));
	});
	$(".icon-weixin").hover(function(){
		$(this).siblings('.weixin-pic').show();
	}, function(){
		$(this).siblings('.weixin-pic').hide();
	});

	
	//侧边主导航
	$(".unav li i").on("click", function(ev){
		ev.stopPropagation();
		ev.preventDefault();
		var li = $(this).closest('li');
		if(li.hasClass('current')){
			li.find('ul').slideUp(400, function(){
				li.removeClass('current');
			});			
		}else{
			li.find('ul').slideDown(400, function(){
				li.addClass('current');
			});
		}
	});
	

	$(".alo-ud-icn").on('click', function(){
		if($(this).hasClass('alo-ud-icnon')){
			$(".alo-ud-list").slideUp();
			$(this).removeClass('alo-ud-icnon');
		}else{
			$(".alo-ud-list").slideDown();
			$(this).addClass('alo-ud-icnon');
		}
	});

	//取消关注
	$("body").on('click', ".del-fav", function(ev){
		ev.preventDefault();
		var self = $(this);
		if(self.data("delete") === "ing"){return;}
		self.data('delete', "ing");
		$.ajax({
			url : "URL-delete-fav",
			type : "POST",
			dataType : "json",
			success : function(data){
				if(data.success){
					self.parent('tr').remove();
				}else{
					self.data('delete', false);
				}
			},
			error: function(){
				self.data('delete', false);
				alert("取消关注失败");
			}
		});
	});


}); //end for ready

$(window).on("load", function(){
	//equalHeight(); //有图片加载完
});

function basePath(){
    var curWwwPath = window.document.location.href;
    var pathName = window.document.location.pathname;
    var pos = curWwwPath.indexOf(pathName);
    var localhostPaht = curWwwPath.substring(0, pos);
    var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
    return (localhostPaht + projectName);
}



//个人中心两侧页面登高
function equalHeight(){
	var _umainHeight  = $(".umain").height();
	//先设置成auto，防止unav高度大于主栏 高
	var _unavHeight = $(".unav").height("auto").height();
	if(_unavHeight < _umainHeight ){
		$(".unav").height(_umainHeight - 2 );
	}
}

;(function($){
	$.msg =  function(options){
	    var defaults = $.extend({
	        width : '200px',
            delay : 1000
	    }, options);

	    //关闭已有窗口
	    $("#msg").remove();

        defaults.top = Math.ceil($(window).height() * 0.25) + $(window).scrollTop();

	    $('body').append('<div id="msg" class="msg '+ defaults.wrapClass +'" style="width:'+ defaults.width +';top:'+ defaults.top +'px;margin-left:'+ -Math.ceil(parseInt(defaults.width)/2) +'px">' + defaults.message + '</div>');

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

;(function(){
  $.fn.dropmenu =  function(){
    return this.each(function(){
    	$(this).on({
    		mouseenter :  function(){
    			$(this).find('.dropdown').stop(true, true).delay(100).slideDown(200);
    		},
    		mouseleave : function(){
    			$(this).find('.dropdown').stop(true, true).slideUp(200);
    		}
    	});
    });
  };
})(jQuery);