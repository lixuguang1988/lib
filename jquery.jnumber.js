;(function($){
	
	/*
	 * param:
	 * jo : jquery对象
	 * message : 提示信息
	 * jot : jquery对象, 相对定位的元素
	 */
	function numberErr(jo, msg){
		//存储原颜色值
		jo.stop(true, true).html("<s></s>"+ msg).show(50).delay(1000).hide(50);
	}
	
	
	$.fn.jnumber = function(options){
		//var defaults = $.extend({}, options);
 		
		return this.each(function(){
			var _ = $(this),
				_plus,
				_reduce,
				_info,
				_max = _.data('maxnum'),
				_min = _.data('minum'),
				_step = _.data('stepnum'),
				_num  = _.val() ? _.val() : _min;
			//确保input的值是min-max之间的有效值
			if(isNaN(_num)){
					_num = _min;
					_.val(_num);
			}
			_num = Math.min(_max, _num);
				
				
			_.before('<span class="jnumber-reduce">-</span>');
			_.after('<i class="jnumber-info" style="display:none;"><s></s></i>');
			_.after('<span class="jnumber-plus">+</span>');
			_plus = _.siblings('.jnumber-plus');
			_reduce = _.siblings('.jnumber-reduce');
			_info = _.siblings('.jnumber-info');
			
			_plus.on('click', function(){
				var _temp = _num + _step;
				if( _temp > _max ){ 
					_plus.addClass('disabled'); 
					numberErr(_info, "超出可接受的最大值!", _);return false;
				}
				_num = _temp;
				_.val(_num);
				
				_temp = _temp + _step;
				if(_temp > _max){ 
					_plus.addClass('disabled'); 
				}
				
				_reduce.removeClass('disabled');
			});
			
			_reduce.on('click', function(){
				var _temp = _num - _step;
				if( _temp < _min ){ 
					_reduce.addClass('disabled'); 
					numberErr(_info, "超出可接受的最小值!", _);return false;
				}
				_num = _temp;
				_.val(_num);
				
				_temp =_temp - _step;
				if(_temp < _min ){ 
					_reduce.addClass('disabled'); 
				}
							
				_plus.removeClass('disabled');
			});
			
			_.on("keyup", function(){
				var _temp = _.val();
				if(_temp == ""){return;}
				if(isNaN(_temp)){
					_temp = _min;
					_.val(_temp);
				}
				
				if(_temp > _max){
					_.val(_max);
					numberErr(_info, "超出可接受的最大值!", _);return false;
				}
				if(_temp < _min){
					_.val(_min);
					numberErr(_info, "超出可接受的最小值!", _);return false;
				}
				_num = parseInt(_.val());
			});
			
			
		});
	};
})(jQuery);
