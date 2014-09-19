/*
 *
 * HTML
 * <div class="example">
 * 	<a href="#">更多</a>
 *  <ul class="dropdown">
 * 		<li><a href="#">菜单二</a></li>
 * 		<li><a href="#">菜单三</a></li>
 *	</ul>
 * </div>
 * 
 * ClassName
 * .dropdown 必须
 * example上加减.drop-dt-on
 * 
 * JS
 * $(.example).jdropmenu();
 * 
 * 
 */

;(function(){
  $.fn.jdropmenu = function(){
    return this.each(function(){
    	$(this).on({
    		mouseenter :  function(){
    			$(this).addClass("drop-dt-on").find('.dropdown').stop(true, true).delay(100).slideDown(200);
    		},
    		mouseleave : function(){
    			$(this).find('.dropdown').stop(true, true).slideUp(200, function(){
    				$(this).removeClass("drop-dt-on");
    			});
    		}
    	});
    });
  };
})(jQuery);