;(function($){
	$.fn.niceSelect = function(options){
		var config = $.extend({}, options);

		return this.each(function(){
			var _ = $(this),
				select = _.find("select"),
				defaultSeletced = _.find("option:checked").length;

			var domStr = "<h4><i></i><span>" + (defaultSeletced ?  _.find("option:checked").html() : _.find("option:first").html()) +  "</span></h4><ul>";

			_.find("option").each(function(index, item){
				if(item.selected || (!defaultSeletced && index == 0)){
					domStr  += "<li class='current'>" + item.text + "</li>";
				}else{
					domStr  += "<li>" + item.text + "</li>";
				}

			});
			domStr += "</ul>";

			select.hide();
			_.append(domStr);

			_.on("click", "li", function(){
				var index = $(this).index();
				$(this).addClass("current").siblings().removeClass("current").parent().hide();
				_.find("h4 span").html($(this).html());

				select[0].selectedIndex = index;

				if(typeof config.onclick === "function"){
					config.onclick(_, select);
				}
			});


            		if(!_.hasClass("g-select-disabled")){
		                /**
		                 * 显示，隐藏select选项
		                 */
		                _.hover(function(){
		                    _.css('z-index', '205').find("ul").show();
		                }, function(){
		                    _.css('z-index', '105').find("ul").hide();
		                });
		          }
		 });
	}
})(jQuery);
