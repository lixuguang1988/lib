# lib


## jquery.jswitch.js

一个图片轮转jquery插件.支持左右滑动,淡入淡出效果   
示例：example/slide.html

******

## jquery.jmodal.js

一个弹出层jquery插件.支持ajax(必须http(s)://来访问),html,ID及各种回调函数   
示例：example/modal.html

<pre>
<code>
$('.example').jmodal({
     width : 500, //number 单位px
     height : 'auto', //[number, auto] 单位px
     wrapClass : '',  //指定弹窗自定义的类名
     overlay : true, //背景色 boolean
     title : '', //指定弹窗窗口的名称
     top : 'center', //['center', number] 弹出窗口里视口顶端的距离
     easing : 600, //弹出窗口显示出来的时间
     cancle : '', //指定取消的文字
     oncancle : null, //点击取消的回调函数(函数返回===false不关闭窗口)
     confirm : '', //指定确定的文字
     onconfirm : null, //点击确认的回调函数(函数返回===false不关闭窗口)
     onopen : null, //窗口打开前的回调函数
     onclose : null, //窗口关闭前的回调函数
     pos : 'fixed', //['fixed', 'absolute'] 指定弹窗的定位方式
     type : 'inline', //['inline', 'html', 'ajax', 'iframe']
     scrolling : 'auto', //当type=iframe 指定iframe的滚动条
     html : '' //当type=html 设置弹出窗口的显示的html内容
});
</code>
</pre>
####参数
#####  width  [number]
指定弹窗窗口的宽度
#####  height [number]
指定弹窗窗口的高度  
tips: type值为ajax,iframe时,最好设置弹出窗口的高度
#####  wrapClass string
为弹窗自定义类名
#####  overlay boolean
背景色 boolean
#####  title string
指定弹窗窗口的标题
#####  top  ['center', number] 默认值 center
指定弹出窗口离视口顶端的距离
#####  easing  [200, 400, 600, number] 默认值 600
弹出窗口显示出来的时间
#####  cancle  string
指定取消的文字
#####  oncancle  function(elem, cfg, obj)
点击取消的回调函数, 函数返回__===false__不关闭窗口   
elem是当前dom对象的引用 得到jq对象$(elem)   
cfg是option对象的引用    
obj是构造函数Modal的引用   
#####  confirm  string
指定确认的文字
#####  onconfirm  function(elem, cfg, obj) 
点击确认的回调函数, 函数返回__===false__不关闭窗口   
elem, cfg, obj通oncancle
#####  onopen  function(elem, cfg, obj) 
窗口打开前的回调函数  
elem是当前dom对象的引用 得到jq对象$(elem)  
elem, cfg, obj通oncancle
<code>cfg.wrapClass = "custome-modal";</code>  
更改html的内容  
<code>cfg.html = "我是实际的html内容";</code>  
#####  onclose  function(elem, cfg, obj) 
窗口关闭前的回调函数
elem, cfg, obj通oncancle
#####  pos  ['fixed', 'absolute'] 默认 absolute
指定弹窗的定位方式
#####  type  ['inline', 'html', 'ajax', 'iframe'] 默认inline
弹出窗口的类型  
type为html是,需要设置html的的内容
type为inline时 ,从触发的元素data-id = "xx"中取页面中id为xx的元素显示弹窗的内容  
type为ajax,iframe时 , 从触发的元素data-url = "xx"的值加载页面xx为弹窗的内容   
#####  scrolling  ['no', 'auto'] 默认 auto
当type=iframe 指定iframe的滚动条
#####  html  string 
当type=html 设置弹出窗口的显示的html内容
####静态方法
##### $.fn.jmodal.destory
<pre>
index :关闭那个弹出窗口,有多个弹出窗口的时候
noDispatchEvent 设置true，表示不触发窗口的关闭回调函数
 关闭所有弹窗
 <code>
 $.fn.jmodal.destory();
 </code>
  关闭所有第一个弹窗
 <code>
 $.fn.jmodal.destory(0);
 </code>
   关闭第一个弹窗且不触发关闭的回调函数
 <code>
 $.fn.jmodal.destory(0, true);
 </code>
    关闭所有弹窗且不触发关闭的回调函数
 <code>
 $.fn.jmodal.destory(null, true);
 </code>
</pre>
##### $.fn.jmodal.open
<pre>
url : 指定加载的url地址
其他参数同插件本身
</pre>
