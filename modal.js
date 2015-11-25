//是否是IE6
var isIE6 = function(){
    var userAgent = navigator.userAgent;
    return userAgent.indexOf("MSIE") && userAgent.indexOf("6.0") && !window.XMLHttpRequest && userAgent.indexOf("Opera") == -1;
}();

/**
 * 遮罩层的构造函数
 * var m = new Modal({title: "提示"});
 * $(".p-list li").on("click", function(){
 *  var self = $(this);
 *  var m = new Modal({title : "编辑", elem : self });
 * });
 * @param options
 * @returns {Modal} 实例对象
 * @constructor
 */

function Modal(options){
    this.cfg = $.extend({
        width : 500, //number 单位px
        height : 'auto', //[number, auto] 单位px
        wrapClass : '',  //指定弹窗自定义的类名
        overlay : true, //背景色 boolean
        title : '', //指定弹窗窗口的名称
        top : 'center', //['center', number] 弹出窗口里视口顶端的距离 center=vertical-align
        easing : 600, //弹出窗口显示出来的时间
        cancle : '', //指定取消的文字
        oncancle : null, //点击取消的回调函数(函数返回===false不关闭窗口)
        confirm : '', //指定确定的文字
        onconfirm : null, //点击确认的回调函数(函数返回===false不关闭窗口)
        onopen : null, //窗口打开前的回调函数
        onclose : null, //窗口关闭前的回调函数
        pos : 'absolute', //['fixed', 'absolute'] 指定弹窗的定位方式
        type : 'inline', //['inline', 'html', 'ajax', 'iframe']
        scrolling : 'auto', //当type=iframe 指定iframe的滚动条
        html : '' //当type=html 设置弹出窗口的显示的html内容
    }, options);

    var self = this;

    //创建骨架, 设置快捷的jquery对象访问
    self.$modal = $('<div class="jmodal"></div>');
    self.$modalcontent = $('<div class="jmodal-content"></div>');
    self.$body = $('<div class="jmodal-body"></div>');
    self.$header = $('<div class="jmodal-header"></div>');
    self.$btn = $('<div class="jmodal-btn"></div>');

    self.$modalcontent.append(self.$header, self.$body, self.$btn);
    self.$modal.append(self.$modalcontent);

    if(self.cfg.overlay){
        if(isIE6){ //fixed object z-index
            self.$backdrop = $('<iframe class="jmodal-backdrop" src="' + (/^https/i.test(window.location.href || '') ? 'javascript:void(false)' : 'about:blank' ) + '" scrolling="no" border="0" frameborder="0" tabindex="-1"></iframe>');
        }else{
            self.$backdrop = $('<div class="jmodal-backdrop"></div>');
        }
        $("body").append(self.$backdrop, self.$modal);
        self.$backdrop.on('dblclick',  $.proxy(self.close, self));
    }

    self.open(); //打开窗口
    self.title(); //设置标题
    self.btn(); //设置按钮
    self.renderPosition(); //调整窗口位置

    //return self; 构造函数就返回self了.
};

//主要用来控制主窗口里面显示的内容
Modal.prototype.open = function(){
    var self = this;

    //运行打开前的回调函数
    if(typeof self.cfg.onopen === 'function'){
        this.cfg.onopen(self.cfg.elem, self.cfg, self);
    }

    self.$body.html('<div class="jmodal-loading">正在加载...</div>').css("height", self.cfg.height);

    //显示document里面的页面元素
    if(self.cfg.type === "inline" && self.cfg.id){
        self.$body.empty().append($("#" + self.cfg.id).show());
    }
    //显示自定义的内容
    if(self.cfg.type === "html"){
        self.$body.html(self.cfg.html);
    }
    //加载ajax的内容
    if(self.cfg.type === "ajax"  && self.cfg.url){
        $.ajax({
            url : self.cfg.url,
            type : "POST",
            data : self.cfg.data,
            dateType : "html"
        }).done(function(data){
            self.$body.html(data);
            self.pos(); //成功之后再次调整遮罩层的位置
        }).fail(function(){
            self.$body.html("系统异常!");
        });
    }
    //加载iframe
    if(self.cfg.type === "iframe"  && self.cfg.url){
        self.$body.html('<iframe id="jmodal-frame" name="jmodal-frame' + (new Date()).getTime() + '"  hspace="0" ' + ($.browser.msie ? 'allowtransparency="true"' : '') + ' src="' + self.cfg.url + '" width="'+ self.cfg.width +'"  height="'+ self.cfg.height +'" scrolling="' + self.cfg.scrolling + '" frameborder="0" ></iframe>');
    }
};

Modal.prototype.title = function(){
    var self = this;

    if(self.cfg.title){
        $("<h2/>", {
            "class" : "jmodal-title",
            "html" : self.cfg.title
        }).appendTo(self.$header);
    }
    $("<a/>",{
        "href" : "javascript:void(0)",
        "html" : '×',
        "class" : "jmodal-close",
        "click" : function(){
            self.close($(this).data('dispatchevent'));
        }
    }).appendTo(self.$header);
};



Modal.prototype.renderPosition = function(){
    var self = this,
        _scrollTop = $(window).scrollTop(),
        _winHeight = $(window).height(),
        _modalHeight = self.$modal.height(),
        _posTop = 0;

    //控制背景
    if(self.cfg.overlay){
        self.$backdrop.animate({
            opacity : '.5'
        },300);
    }

    //把遮罩层覆盖整个窗口
    if(isIE6){
        self.$backdrop.css('height', Math.max($(window).height(), $('body').height()) );
    }

    //显示主体并重置类名追加新设置的类名
    self.$modal.css({
        width : self.cfg.width,
        marginLeft : -self.cfg.width/2,
        display : 'block'
    }).addClass(self.cfg.wrapClass);


    //定位的方式[absolute, fixed]
    if(self.cfg.pos == "absolute" || isIE6 ){  //IE6只支持absolute
        if(self.cfg.top == "center"){//定位到视口中间
            _posTop = (_winHeight - _modalHeight)/2 + _scrollTop;
        }else{
            _posTop = self.cfg.top + _scrollTop;
        }
        if(self.isIE6){
            $(window).on('scroll.jmodal', $.proxy(self.fixedIE6Postion, self));
        }
    }else{
        if(self.cfg.top === "center"){
            _posTop = ($(window).height() - self.$modal.height())/2;
        }else{
            _posTop = self.cfg.top ;
        }
        self.$modal.addClass('jmodal-fixed');
    }
    self.$modal.animate({top : _posTop + "px"}, self.cfg.easing);

};

Modal.prototype.fixedIE6Postion =  function(){
    var self = this,
        _posTop = 0;

    if(self.cfg.top === "center"){
        _posTop = ($(window).height() - self.$modal.height())/2;
    }else{
        _posTop = self.cfg.top;
    }
    _posTop = _posTop + $(window).scrollTop();
    self.$modal.animate({top :  _posTop + "px"}, self.cfg.easing);
};


Modal.prototype.btn =  function(){
    if(!this.cfg.cancle && !this.cfg.confirm){
        this.$btn.hide();
        return false;
    }
    this.readerBtn(this.cfg.cancle, this.cfg.oncancle);
    this.readerBtn(this.cfg.confirm, this.cfg.onconfirm);
};

Modal.prototype.readerBtn= function(btnName, btnCallback){
    var self = this,
        flag = true; //flag根据回调函数的返回值确定是否关闭弹窗
    if(!btnName){return false;}
    $("<a/>",{
        "href" : "javascript:void(0)",
        "html" : btnName,
        "click" : function(ev){
            ev.preventDefault();
            if(typeof btnCallback === "function"){
                flag = btnCallback(self.cfg.elem, self.cfg, self);
            }
            if(flag !== false){
                self.close();
            }
        }
    }).appendTo(self.$btn);
};

/**
 *
 * @param noDispatchEvent boolean 不分发关闭的回调函数
 */
Modal.prototype.close = function(noDispatchEvent){

    //关闭jmodal之前调用回调函数
    if(typeof this.cfg.onclose === 'function' && typeof noDispatchEvent === "undefined"){
        this.cfg.onclose(this.cfg.elem, this.cfg, this);
    }
    if(this.cfg.type === "inline" && this.cfg.id){
        $("#" + this.cfg.id).hide().appendTo($('body'));
    }
    this.$modal.remove();
    this.$backdrop.remove();

    $(window).off('scroll.jmodal'); //解除ie6的事件
};
