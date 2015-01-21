var EventUtil = EventUtil || {};

/**
 * 指定元素事件绑定
 * @param {Object} elem DOM node 指定绑定事件的元素
 * @param {string} type event name 指定绑定事件类型
 * @param {function} handler hander function 指定绑定那个事件处理函数
 */
EventUtil.addEventListener =  function(elem, type, handler){
	if(elem.addEventListener){
		elem.addEventListener(type, handler, false);
	}else if(elem.attactEvent){
		elem.addactEvent("on" + type, handler);
	}else{
		elem["on" + type] =  handler;
	}
};

/**
 * 解除指定元素事件绑定
 * @param {Object} elem DOM node 指定解除事件的元素
 * @param {string} type event name 指定解除事件类型
 * @param {function} handler hander function 指定解除那个事件处理函数
 */
EventUtil.removeEventListener = function(elem, type, handler){
	if(elem.removeEventListener){
		elem.removeEventListener(type, handler, false);
	}else if(elem.detachEvent){
		elem.detachEvent("on" + type, handler);
	}else{
		elem["on" + type] = null;
	}
};


function getViewportSize(w){
  //使用指定的窗口，如果不带参数则使用当前窗口
  w = w || window;
  
  //除了IE8
  if(w.innerWidth != null){
    return {w : w.innerWidth, h : w.innerHeight};
  }
  
  //对标准模式下的IE（或其他浏览器）
  var doc = w.document;
  if(document.compatMode == "CSS1Compat"){
    return {w : doc.documentElement.clientWidth, h : doc.documentElement.clientHeight};
  }
  
  //怪异模式下的浏览器
  return {w : doc.body.clientWidth, h : doc.body.clientHeight};
}  