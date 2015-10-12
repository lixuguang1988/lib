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
		timer : null,
		alert : function(options){
			var  self = this, fw;
			options = $.extend({title: "", button: "确定"}, options);
			self.close();
			self.clearTimer();
			
			fw = self.fixWidth(options.width);
			
			self.modal.css({
				"width" : fw.width,
				"margin-left": fw.marginLeft
			}).append("<div class=\"modal-header\">" + options.title + "<\/div><div class=\"modal-content\">" + options.content + "<\/div><div class=\"modal-action\">" + options.button + "<\/div>");
			
			$('body').append(self.mask, self.modal);
			
			//bind event
			$(".modal-action").one(self.eventName, function(e){
				e.preventDefault();
				self.timer = setTimeout(function(){
					self.close();
				},250);
				if(typeof options.callback === "function"){
					options.callback.apply(null, options.args);
				}
			});
		},
		confirm : function(options){
			var  self = this, fw;
			options = $.extend({title: "", cancel: "返回", ok: "确定", args: []}, options);
			self.close();
			self.clearTimer();
			
			fw = self.fixWidth(options.width);
			
			self.modal.css({
				"width" : fw.width,
				"margin-left": fw.marginLeft
			}).append("<div class=\"modal-header\">" + options.title + "<\/div><div class=\"modal-content\">" + options.content + "<\/div><div class=\"modal-action modal-confirm-action\"><span class=\"modal-action-cancel\">" + options.cancel + "<\/span><span class=\"modal-action-ok\">" + options.ok + "<\/span><\/div>");
			
			$('body').append(self.mask, self.modal);
			
			//bind event
			$(".modal-action-cancel").one(self.eventName, function(e){
				self.close();
			});
			//bind event
			$(".modal-action-ok").one(this.eventName, function(e){
				self.close();
				if(typeof options.callback === "function"){
					options.callback.apply(null, options.args);
				}
			});	
		},
		clearTimer : function(){
			if(this.timer){
				clearTimeout(this.timer);
			}
		},
		modern : function(options){
			this.close();
			this.clearTimer();
			this.modal.css({
				"width" : "80px",
				"margin-left": "-40px",
			}).append("<div class=\"modal-modern modal-modren-" + options.type + "\">" + options.content + "<\/div>");
			
			$('body').append(this.mask, this.modal);
			
		},
		close : function(){
			var self = this;
			//console.log(this.timer);
			self.modal.empty().remove();
			self.timer = setTimeout(function(){
				self.mask.empty().remove();
			}, 300);
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
