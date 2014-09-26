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
 * $(.example).jdropmenu({
 * 	duration : 200
 * });
 * 
 * 
 */

;(function(){
  $.fn.jdropmenu = function(options){
  	var defaults = $.extend({duration : 200}, options);
 		
    return this.each(function(){
    	$(this).on({
    		mouseenter :  function(){
    			$(this).addClass("drop-dt-on").find('.dropdown').stop(true, true).delay(100).slideDown(defaults.duration);
    		},
    		mouseleave : function(){
    			$(this).find('.dropdown').stop(true, true).slideUp(defaults.duration, function(){
    				$(this).removeClass("drop-dt-on");
    			});
    		}
    	});
    });
  };
})(jQuery);