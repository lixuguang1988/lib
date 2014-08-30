function getScrollOffsets(w){
  //使用指定的窗口，如果不带参数则使用当前窗口
  w = w || window;
  
  //除了IE8
  if(w.pageXOffset != null){
    return {x : w.pageXOffset, y : w.pageYOffset};
  }
  
  //对标准模式下的IE（或其他浏览器）
  var doc = w.document;
  if(document.compatMode == "CSS1Compat"){
    return {x : doc.documentElement.scrollLeft, y : doc.documentElement.scrollTop};
  }
  
  //怪异模式下的浏览器
  return {x : doc.body.scrollLeft, y : doc.body.scrollTop};
}


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
    return {w : doc.documentElement.clientWidth, h : doc.documentElement.clientWidth};
  }
  
  //怪异模式下的浏览器
  return {w : doc.body.clientWidth, h : doc.body.clientWidth};
}
