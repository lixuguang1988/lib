/*
.nice-select{width:100%;height:100%;position: relative;border:1px solid #9eb2cd;height:32px;line-height:32px;width:85px;padding-left:15px;
	-webkit-border-radius:4px;
	       border-radius: 4px;
	-webkit-box-shadow:inset 0 0 3px rgba(0,0, 0,.2);
	        box-shadow:inset 0 0 3px rgba(0,0, 0,.2);
}
.nice-select-active{	-webkit-border-radius:4px 4px 0 0;
	       border-radius: 4px 4px 0 0;}
.nice-select-arrow{position: absolute;right:-1px;top:-1px;background:url(../images/nicearrow.png) no-repeat;width:33px;height:34px;cursor: pointer}
.nice-select-lst{position: absolute;left:-1px;top:33px;width:102px;background:#fff;border-bottom:1px solid #a1b4da;display:none}
.nice-select-lst li{text-indent:15px;border:1px solid #a1b4da;border-top:none;border-bottom:none;cursor: pointer}
.nice-select-lst li.selected{background:#ccc}
 
 */
;(function($){
	$.fn.jselect = function(){
		this.each(function(){
    			var that = this, //dom node
    				elem = $(this), //jq对象
    				wrap = $("<div />",{
    					"class" : "nice-select",
    					"click" : function(event){
    						/*
    						event.stopPropagation();
    						event.preventDefault();
    						*/
    						$(this).find('.nice-select-lst').toggle();
    						$(this).toggleClass('nice-select-active');
    					
    						/*点击其他元素关闭下拉选项*/
    						$(document).on('click', function(e){
    							if(!(e.target == wrap[0] || $.contains(wrap[0], e.target))) {
									wrap.removeClass('nice-select-active').find('.nice-select-lst').hide();
								}
			    			});
    					}	
    				}),
    				arrow = $("<div class=\"nice-select-arrow\"></div>"),
    				title = $("<div class=\"nice-select-title\"></div>"),
    				niceStr = '<ul class="nice-select-lst">',
    				options = elem.find('option'),
    				selectedIndex = that.selectedIndex,
    				cur;
    				
    			for(var i = 0 ; i < options.length ; i++ ){
    				if(i == selectedIndex){
    					cur = 'class="selected"' ;
    					title.html(options[i].text);
    				}else{
    					cur = '';
    				}
    				niceStr += '<li ' + cur + '>'+ options[i].text +'</li>';
    			}
    			//插入页面
    			wrap.append(title, arrow, niceStr).insertAfter(elem);
    			//隐藏select
    			elem.hide();
    			//绑定下拉选项
    			wrap.find('li').on("click", function(event){
    				event.stopPropagation();
    				event.preventDefault();
    				//更改当前元素外观
    				$(this).addClass('selected').siblings().removeClass('selected');
    				//更改select的值
    				that.selectedIndex = $(this).index();
    				//更改title的值
    				title.html(this.innerHTML);
    				//关闭下拉选项
    				arrow.trigger('click');
    			});
		});
		return this;
	};
})(jQuery);