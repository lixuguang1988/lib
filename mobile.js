var mobile =  function(){
	//弹出层
	var  modal = {
		mask : function(){
			return $("<div class=\"modal-mask\" \/>");
		}(),
		modal : function(){
			return $("<div class=\"modal-main\" \/>");
		}(),
		eventName : function(){
			//是否是手机浏览器返回对应的事件
			//click事件在手机上点击有阴影
			return navigator.userAgent.indexOf("Mobile") > - 1 ? "touchstart" : "click";
		}(),
		alert : function(options){
			var  _ = this, fw;
			options = $.extend({header: "", button: "确定"}, options);
			this.close();
			
			fw = this.fixWidth(options.width);
			
			this.modal.css({
				"width" : fw.width,
				"margin-left": fw.marginLeft
			}).append("<div class=\"modal-header\">" + options.header + "<\/div><div class=\"modal-content\">" + options.content + "<\/div><div class=\"modal-action\">" + options.button + "<\/div>");
			
			$('body').append(this.mask, this.modal);
			
			//bind event
			$(".modal-action").one(this.eventName, function(e){
				e.preventDefault();
				_.close();
			});
			
		},
		confirm : function(options){
			var  _ = this, fw;
			options = $.extend({header: "", cancel: "返回", ok: "确定"}, options);
			this.close();
			
			fw = this.fixWidth(options.width);
			
			this.modal.css({
				"width" : fw.width,
				"margin-left": fw.marginLeft
			}).append("<div class=\"modal-header\">" + options.header + "<\/div><div class=\"modal-content\">" + options.content + "<\/div><div class=\"modal-action modal-confirm-action\"><span class=\"modal-action-cancel\">" + options.cancel + "<\/span><span class=\"modal-action-ok\">" + options.ok + "<\/span><\/div>");
			
			$('body').append(this.mask, this.modal);
			
			//bind event
			$(".modal-action-cancel").one(this.eventName, function(e){
				_.close();
			});
			//bind event
			$(".modal-action-ok").one(this.eventName, function(e){
				if(typeof options.callback === "function"){
					options.callback();
				}
				_.close();
			});	
		},
		modern : function(options){
			this.close();
			this.modal.css({
				"width" : "80px",
				"margin-left": "-40px",
			}).append("<div class=\"modal-modern modal-modren-" + options.type + "\">" + options.content + "<\/div>");
			
			$('body').append(this.mask, this.modal);
			
		},
		close : function(){
			this.modal.empty().remove();
			this.mask.empty().remove();
		},
		//定位modal-main的位置
		fixWidth: function(w){
			var fw = {"width": "80%" , "marginLeft": "-40%"};
			
			if(typeof w === "number"){
				fw.width = w + "px";
				fw.marginLeft = "-" + Math.ceil(w / 2) + "px";
			}
			
			return fw;
		}
		
	};
	
	
	return {
		modal : modal
	};
	
}();
