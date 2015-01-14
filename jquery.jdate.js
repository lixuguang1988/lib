;(function($, window, undefined){
	
	/**
	 * jDate的构造函数,用于实例化一个jDate对象
	 * @param {object} jo jquery object
	 * @param {object} cfg plain object
	 */
	function jDate(jo, cfg){
		this.elem = jo; //触发事件jquery对象
		this.cfg = cfg; //配置信息
		this.wrap = $('<div class="ui-date-wrap"></div>'); //包围元素
		
		//初始化的回调函数
		if(typeof this.cfg.before === "function"){
			this.cfg.before(this.elem[0], this.cfg, this);
		}
		
		//渲染头部
		this.renderHeader();
	}
	
	jDate.prototype.renderHeader =  function(){
		
		this.header = $('<div class="ui-date-header"></div>');
		
		//上一月
		this.prev = $('<a class="ui-date-btn ui-date-prev" href="javascript:void(0);" data-month="-1">'+ this.cfg.prev +'</a>').appendTo(this.header);
		//下一月
		this.next  = $('<a class="ui-date-btn ui-date-next" href="javascript:void(0);" data-month="1">'+ this.cfg.next +'</a>').appendTo(this.header);		
		//xxxx年x月
		this.header.append('<span class="ui-date-title"><strong class="ui-date-year">' + this.cfg.date.getFullYear() + '年</strong><strong class="ui-date-month">' + this.cfg.month[this.cfg.date.getMonth()] + '</strong></span>');

		//添加到包围元素中
		this.wrap.html(this.header);
		
		//渲染主体
		this.renderBody();
	};
	
	jDate.prototype.renderBody =  function(){
		var _ = this,
			tbody = '<tbody>',
			sd = _.cfg.date, //设置快捷访问
			
			year = sd.getFullYear(),
			month = sd.getMonth(),
			date = sd.getDate(),
			
			temp = new Date(year, month, date),
			tempdate, 
			prevmonthday, 
			lastweekdate/*本月最后一周第一天是x号*/, lastdate/*本月最后一天是x号*/, lastday/*本月最后一天星期几*/;
		
		//渲染日历头
		_.renderThead();
		
		//设置temp为当月最后一天
		if(month == 0 || month == 2 || month == 4 || month == 6 || month == 7 || month == 9 || month == 11){
			temp.setDate(31);
			lastdate = 31;
		}else if(month == 3 || month == 5 || month == 8 || month == 10 ){
			temp.setDate(30);
			lastdate = 30;
		}else{
			temp.setDate(29); //非闰年变成3月1号
			if(temp.getMonth() != 1){
				//不是闰年，重新设置为
				temp.setMonth(1);
				temp.setDate(28);
			}
			lastdate = temp.getDate();
		}
		//获取本月最后一天星期几
		lastday = temp.getDay();
		//获取本月最后一周第一天是x号
		lastweekdate = lastdate - lastday;

		//重置temp为本月激活的那天
		temp = new Date(year, month, date);
		temp.setDate(1); //设置 temp的本月1号
		prevmonthday = temp.getDay(); //获取本月1号星期几
		temp.setDate(-prevmonthday + 1);//设置本月第一周的第一天(可能为上一月的某天) +1是因为没有0号
		tempdate = temp.getDate(); //获取本月第一周是x号
		
		tbody +='<tr class="ui-date-rf">';
		//上个月的日期
		for(var i = 0; i < prevmonthday; i++){
			tbody += formatdate(temp);
			temp.setDate(++tempdate); //此时temp
		}
		//此时的日期为本月1号，同时tempdate为上月最后一天加1([29, 30, 31, 32])
		//上一月完了tempdate设置为1
		for(tempdate = 1; prevmonthday < 7; prevmonthday++){
			tbody += formatdate(temp);
			temp.setDate(++tempdate);
		}
		tbody +="</tr>"; //end 第一周
		
		tbody += '<tr class="ui-date-rn">'; //中间几周
		for( ; tempdate < lastweekdate; ){
			tbody += formatdate(temp);
			if(temp.getDay() == 6){
				tbody +='</tr><tr class="ui-date-rn">';
			}
			temp.setDate(++tempdate);
		}
		tbody +="</tr>"; //end 第一周
				
		tbody +='<tr class="ui-date-rl">';//最后一周,
		//本月最后几天	
		for( ; tempdate <= lastdate; ){
			tbody += formatdate(temp);
			temp.setDate(++tempdate);
		}
		//下个月要显示的几天
		for(tempdate = 1; lastday < 6; lastday++){
			tbody += formatdate(temp);
			temp.setDate(++tempdate);
		}	
		tbody +='</tr>';
		
		//除去空行
		tbody = tbody.replace(/<tr class="ui-date-rn"><\/tr>/g, "");
		
		//追到到this.wrap里面	
		this.wrap.append(_.table.append(tbody));
		
		this.show();	
		
		/**
		 * 返回格式化日期字符串
 		 * @param {Object} d Date object
		 */
		function formatdate(d){
			var tdstr = '<td class="';
			//不是当前月
			if(month != d.getMonth()){
				tdstr += 'ui-date-disabled ';
			}
			//激活的天
			if(d.toDateString() == sd.toDateString()){
				tdstr += 'ui-date-active ';
			}
			//当日 
			if( d.toDateString() == (new Date()).toDateString() ){
				tdstr += 'ui-date-today ';
			}
			//格式化日期
			tdstr += '" data-date="' + d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate() + '"';
			tdstr += '>' + d.getDate() + '</td>';
			return tdstr;
		} //end formatdate
	};
	
	jDate.prototype.renderThead =  function(){
		var thead = '<thead><tr>';
		this.table = $('<table class="ui-date-table"></table>');
		for(var i = 0 ; i < 7 ; i ++){
			thead += '<th>' + this.cfg.week[i] + '</th>';
		}
		thead +='</tr></thead>';
		this.table.append(thead);		
	};
	
	jDate.prototype.show =  function(){
		
		if(this.cfg.type == "init"){
			this.elem.html(this.wrap);
		}else{
			$('body').append(this.wrap);
			this.renderPostion();
		}
		
		//日期渲染完毕的回调函数
		if(typeof this.cfg.monthchangeafter === "function"){
			this.cfg.monthchangeafter(this.elem[0], this.cfg, this);
		}
		
		//绑定点击日期事件
		this.dateClick();	
		//绑定月份导航事件
		this.monthNavigator();			
	};
	
	jDate.prototype.renderPostion =  function(){
		this.wrap.css({
			position : "absolute",
			zIndex : '10005',
			left : this.cfg.offsetElem.offset().left,
			top : this.cfg.offsetElem.offset().top + this.cfg.offsetElem.outerHeight()
		}).attr("id", this.elem.data('jdid'));
	};
	
	jDate.prototype.dateClick =  function(){
		var _ = this;
		
		this.table.find("td:not('.ui-date-disabled')").on("click.jdate", function(){
			if(typeof _.cfg.click === "function"){
				_.cfg.click(this);				
			}
			if(_.cfg.type != "init"){
				_.cfg.offsetElem.val($(this).data('date'));
				$("#" + _.elem.data('jdid') ).remove();
				_.elem.removeData('jdid');
			}else{
				_.table.find('td').removeClass('ui-date-active');
				$(this).addClass('ui-date-active');
			}
		});

	};
	
	jDate.prototype.monthNavigator =  function(){
		var _ = this;
		this.next.add(this.prev).on("click", function(ev){
			ev.preventDefault();
			//导航月份
			_.cfg.date.setMonth(_.cfg.date.getMonth() + $(this).data('month'));
			//月份更改的回调函数
			if(typeof _.cfg.monthchange === "function"){
				_.cfg.monthchange(_.cfg.date);
			}			
			_.renderHeader();//重新渲染头部
		});
	};
		
	$.fn.jdate = function(options){
		var config  = $.extend({
			date: new Date(), //初始化指定的一天
			before : null, //初始化的回调函数  callback(elem, cfg, obj)
			month : ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", '12月'],
			week: ["日", "一", "二", "三", "四", "五", "六"], //周日~周六
			prev : "&lsaquo;", //上个月
			next : "&rsaquo;", //下一月
			type : "init" ,//['init', 'toggle', ['input']] input是程序自动添加
			click : null ,//点击日期的callback(elem)
			monthchange: null, //月份变化的callback(date) object
			monthchangeafter : null //月份变化渲染完毕的回调函数 
		}, options);
		
		return this.each(function(){
			var jd;
			//是input元素或者type为toggle
			if(config.type === "toggle" || this.tagName.toLowerCase() == "input"){
				$(this).on("click", function(ev){
					var jdfor;
					//已经在显示了.
					if($(this).data("jdid")){return false;}
					
					//在另一个元素上显示
					if($(this).data('jdfor')){
						jdfor = $("#" + $(this).data('jdfor')); 
						if(jdfor.val()){
							config.date = getDate(jdfor.val());
						}	
						config.offsetElem = jdfor;						
					}else{
						if($(this).val()){
							config.date = getDate($(this).val());
						}	
						config.type = "input";
						config.offsetElem = $(this);						
					}
					
					$(this).data("jdid", "jdate" + ev.timeStamp);			
					jd = new jDate($(this), config);
				});				
			}else{
				if($(this).data('date')){
					config.date = getDate($(this).data('date'));
				}
				jd = new jDate($(this), config);
			}
		});
			
	};//end for $.fn.jdate();
	
	/**
	 * 从字符串中返回日期对象
	 * @param {string} d '2015-10-11'
	 * @param {string} s  '-'
	 */
	function getDate(d, s){
		var da = d.split(s||"-");
		if(da.length !== 3){
			throw new Error("日期格式不正确！");
		}
		return new Date(parseInt(da[0]), parseInt(da[1])-1 ,parseInt(da[2]));
	}

})(jQuery, window);
