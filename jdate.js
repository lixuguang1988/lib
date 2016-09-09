/**
 * jDate的构造函数,用于实例化一个jDate对象
 * @param jo Object jquery对象
 * @param cfg Object 配置对象
 */
function jDate(jo, cfg){
    var config  = $.extend({
        date: new Date(), //初始化指定的一天
        before : null, //初始化的回调函数  callback(elem, cfg, obj)
        month : ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", '12'],
        week: ["日", "一", "二", "三", "四", "五", "六"], //周日~周六
        prev : "&lsaquo;", //上个月
        next : "&rsaquo;", //下一月
        type : "toggle" ,//['init', 'toggle', ['input']] input是程序自动添加
        click : null ,//点击日期的callback(elem),
        monthchange: null, //月份变化的callback(date) object
        time : false, //是否同时显示时间选项
        afterClose : null, //页面关闭的回调函数
        monthchangeafter : null //月份变化渲染完毕的回调函数
    }, cfg);
    this.elem = jo; //触发事件jquery对象
    this.cfg = config; //配置信息
    this.wrap = $('<div class="ui-date-wrap"></div>'); //包围元素

    if(this.elem.data("single")){return false;}
    this.elem.data("single", true);

    this.jdid = "jdid" + new Date().getTime();
    this.offsetElem = this.elem.data("jdfor") ? $("#" + this.elem.data("jdfor")) : this.elem;
    this.cfg.date = this.offsetElem.val() ? getDate(this.offsetElem.val()) : this.cfg.date;

    //初始化的回调函数
    if(typeof this.cfg.before === "function"){
        this.cfg.before(this.elem, this.cfg, this);
    }

    //渲染头部
    this.renderHeader();
}

jDate.prototype.renderHeader =  function(){
    this.header = $('<div class="ui-date-header"><\/div>');

    //上一月
    this.prev = $('<a class="ui-date-btn ui-date-prev" href="javascript:void(0);" data-month="-1">'+ this.cfg.prev +'<\/a>').appendTo(this.header);
    //下一月
    this.next  = $('<a class="ui-date-btn ui-date-next" href="javascript:void(0);" data-month="1">'+ this.cfg.next +'<\/a>').appendTo(this.header);
    //xxxx年x月
    this.header.append('<span class="ui-date-title"><strong  class="ui-date-year" data-year="' + this.cfg.date.getFullYear() + '">' + this.cfg.date.getFullYear() + '年<\/strong><strong class="ui-date-month" data-month="' + this.cfg.month[this.cfg.date.getMonth()] + '">' + this.cfg.month[this.cfg.date.getMonth()] + '月<\/strong><\/span>');

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
        datesOfMonth;

    //渲染日历头
    _.renderThead();
    
    datesOfMonth = baseDates.getMonth(sd, true);
    for(var i = 0; i < datesOfMonth.length; i++){
        tbody += '<tr class="ui-date-rn">'; //中间几周
        for(var j = 0; j < datesOfMonth[i].length; j++){
            temp = datesOfMonth[i][j];
            tbody += formatdate(temp);
        }
        tbody +='<\/tr>';
    }

    //追到到this.wrap里面
    this.wrap.append(_.table.append(tbody));

    this.show();

    /**
     * 返回格式化日期字符串
     * @param {Object} d Date object
     */
    function formatdate(d){
        var tdstr = '<td class="',
            localmonth = d.getMonth(),
            lcoaldate = d.getDate();
        //不是当前月
        if(month != localmonth){
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
        ++localmonth;
        localmonth = localmonth  >= 10  ? localmonth : "0" + localmonth;
        lcoaldate = lcoaldate  >= 10  ? lcoaldate : "0" + lcoaldate;

        //格式化日期
        tdstr += '" data-date="' + d.getFullYear() + '-' + localmonth + '-' + lcoaldate + '"';
        tdstr += ' data-holiday="' + (d.getMonth()+1) + '-' + d.getDate() + '"';
        tdstr += '>' + d.getDate() + '</td>';
        return tdstr;
    } //end formatdate
};

jDate.prototype.renderThead =  function(){
    var thead = '<thead><tr>';
    this.table = $('<table class="ui-date-table"><\/table>');
    for(var i = 0 ; i < 7 ; i ++){
        thead += '<th>' + this.cfg.week[i] + '<\/th>';
    }
    thead +='<\/tr><\/thead>';
    this.table.append(thead);
};

jDate.prototype.show =  function(){
    if(this.cfg.time){
        this.renderTime();
    }
    if(this.cfg.type == "init"){
        this.elem.html(this.wrap);
    }else{
        $('body').append(this.wrap);
        this.renderPostion();
    }

    //日期渲染完毕的回调函数
    if(typeof this.cfg.monthchangeafter === "function"){
        this.cfg.monthchangeafter(this.elem, this.cfg, this);
    }

    //日期渲染完毕的回调函数
    if(typeof this.cfg.showAfter === "function"){
        this.cfg.showAfter(this.elem, this.cfg, this);
    }
    //绑定点击日期事件
    this.dateClick();
    //绑定月份导航事件
    this.monthNavigator();

    //点页面其他部分关闭
    this.bodyClick();
};

jDate.prototype.renderTime = function(){
    var _ = this;
    this.time = $('<div class="ui-date-time text-center clearfix"><\/div>');
    this.time.append('<div class="pull-left ui-date-hms"><span>时间<\/span><input  name="hour" data-title="小时" value="00" readonly >:<input name="minute" data-title="分钟"  value="00" readonly >:<input name="second" data-title="秒钟"  value="00" readonly ><\/div>');
    this.time.append('<div class="pull-right ui-date-bar"><a class="ui-date-clear" href="">清空<\/a><a class="ui-date-yes" href="">确认<\/a><\/div>');
    this.time.append('<div class="ui-date-tex"><div class="ui-date-text"><span class="character pull-right">&#x000D7;</span><span><\/span><\/div><ul class="ui-date-texl"><\/ul><\/div>');
    this.time.appendTo(this.wrap);

    this.time.find("input").on("click", function(ev){
        var max = 60, str = "";
        if($(this).attr("name") == "hour"){
            max = 24;
        }
        for(var i = 0; i < max ; i++){
            str += "<li>" + i  + "</li>";
        }
        $(this).addClass('current').siblings('input').removeClass('current');
        _.time.find(".ui-date-texl").html(str);
        _.time.find(".ui-date-text span:last").html($(this).data("title"));
        _.time.find(".ui-date-tex").show();
    });

    this.time.find(".ui-date-text span:first").on("click", function(){
        _.time.find(".ui-date-tex").hide();
    });

    this.time.on("click", "li", function(){
        var value = this.innerHTML;
        if(value < 10){
            value = "0" + value;
        }
        _.time.find("input.current").val(value);
        _.time.find(".ui-date-tex").hide();
    }).on("click", ".ui-date-clear", function(ev){
        ev.preventDefault();
        _.clear = true;
        _.table.find(".ui-date-active").click();
    }).on("click", ".ui-date-yes", function(ev){
        ev.preventDefault();
        _.table.find(".ui-date-active").click();
    });
};

jDate.prototype.renderPostion =  function(){
    this.wrap.css({
        position : "absolute",
        zIndex : '10005',
        left : this.offsetElem.offset().left,
        top : this.offsetElem.offset().top + this.offsetElem.outerHeight()
    }).attr("id", this.jdid);
};

jDate.prototype.dateClick =  function(){
    var _ = this;

    this.table.find("td:not('.ui-date-disabled')").on("click.jdate", function(){
        if(typeof _.cfg.click === "function"){
            _.cfg.click(this);
        }
        if(_.cfg.type != "init"){
            var date = $(this).data('date');
            if(_.cfg.time){
                date += " " + _.time.find("input[name=hour]").val() + ":" + _.time.find("input[name=minute]").val() + ":" + _.time.find("input[name=second]").val()
            }
            if(_.clear == true){
                date = "";
            }
            if(_.bodyclose == true){
                date = _.offsetElem.val();
            }
            _.offsetElem.val(date);
            $("#" + _.jdid ).remove();
        }else{
            _.table.find('td').removeClass('ui-date-active');
            $(this).addClass('ui-date-active');
        }
        _.elem.data("single", null);
        if(typeof _.cfg.afterClose === "function"){
            _.cfg.afterClose(_);
        }
    });
};

jDate.prototype.bodyClick =  function(){
    var _ = this;
    this.wrap.on("click", function(event){
        event.stopPropagation();
    });
    //this.elem.on("click", function(event){
    //    event.stopPropagation();
    //});
    $('body').one("click", function(){
        _.bodyclose = true;
        _.table.find(".ui-date-active").click();
    });
}

jDate.prototype.monthNavigator =  function(date){
    var _ = this;
    if(date){
        //导航指定日期
        _.cfg.date = date;
        //月份更改的回调函数
        if(typeof _.cfg.monthchange === "function"){
            _.cfg.monthchange(_.cfg.date);
        }
        _.renderHeader();//重新渲染头部
    }else{
        this.next.add(this.prev).on("click", function(ev){
            ev.preventDefault();
            //防止3.29、1.31前进后退出错
            if(_.cfg.date.getDate() > 28){
               _.cfg.date.setDate(28); 
            }
            //导航月份
            _.cfg.date.setMonth(_.cfg.date.getMonth() + $(this).data('month'));
            //月份更改的回调函数
            if(typeof _.cfg.monthchange === "function"){
                _.cfg.monthchange(_.cfg.date);
            }
            _.renderHeader();//重新渲染头部
        });
    }
};



/**
 * 从字符串中返回日期对象
 * @param {string} d '2015-10-11'
 * @param {string} s  '-'
 */
function getDate(d, s){
    var da = d.split(s||/[- :]/);
    if(da.length < 3){
        throw new Error("日期格式不正确！");
    }
    return new Date(Number(da[0]), Number(da[1])-1 ,Number(da[2]));
}

var baseDates = {
    dayMilliseconds : 1000 * 24 * 60 * 60, /*一天毫秒数*/
    /**
     * 返回该周的日期对象
     * @param date Date 传入指定的日期对象
     * @param islocal Boolean [周一~周日]
     * @returns {Array}
     */
    getWeek : function(date, islocal){
        date = date || new Date();
        islocal = islocal ? -1 : 0;
        var day = date.getDay() + islocal, /*周几*/
            timestamp = date.getTime(), /*改天的毫秒表示法*/
            dates = [],
            i = -day;

        for(i = -day; i < 7 - day; i++){
            dates.push(new Date(timestamp + this.dayMilliseconds * i));
        }

        return dates;
    },

    /**
     * 返回该月的日期对象
     * @param date Date 传入指定的日期对象
     * @param matrix Boolean  是否是二位数组
     * @param islocal Boolean [周一~周日]
     * @returns {Array} 返回该月的日期对象 [周日，周一...周六]
     */
    getMonth: function(date, matrix, islocal){
        date = date || new Date();
        var timestamp = date.getTime(), /*改天的毫秒表示法*/
            dates = [],
            tempDates = [],
            month = date.getMonth(),
            i = -5,
            j;

        //一月不可能超过6周
        for( ; i < 5; i++){
            tempDates =  this.getWeek(new Date(timestamp + this.dayMilliseconds * i * 7), islocal);
            //只要有一天在当前月就算
            if(tempDates[0].getMonth() == month  || tempDates[6].getMonth() == month ){
                if(matrix){
                    dates.push(tempDates);
                }else {
                    for (j = 0; j < tempDates.length; j++) {
                        dates.push(tempDates[j]);
                    }
                }
            }
        }
        return dates;
    }
};
