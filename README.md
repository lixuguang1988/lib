# lib


## jquery.jswitch.js

一个图片轮转jquery插件.支持左右滑动,淡入淡出效果   
示例：example/slide.html


## jquery.jmodal.js

一个弹出层jquery插件.支持ajax(必须http(s)://来访问),html,ID及各种回调函数   
示例：example/modal.html

<pre>
<code>
$('.example').jmodal({
     width : 500, //number 单位px
     height : 'auto', //[number, auto] 单位px
     wrapClass : '',  //指定弹窗自定义的类名
     title : '', //指定弹窗窗口的名称
     top : 'center', //['center', number] 弹出窗口里视口顶端的距离
     easing : 600, //弹出窗口显示出来的时间
     cancle : '', //指定取消的文字
     oncancle : null, //点击取消的回调函数(函数返回===false不关闭窗口)
     confirm : '', //指定确定的文字
     onconfirm : null, //点击确认的回调函数(函数返回===false不关闭窗口)
     onopen : null, //窗口打开前的回调函数
     onclose : null, //窗口关闭前的回调函数
     pos : 'fixed', //[fixed, absolute]
     type : 'inline', //[inline, html, ajax, iframe]
     scrolling : 'auto', //当type=iframe 指定iframe的滚动条
     html : '' //当type=html 设置弹出窗口的显示的html内容
});
</code>
</pre>
######  __width__  指定弹窗窗口的宽度
###### __height__ 指定弹窗窗口的高度, tips: type值为ajax,iframe时,最好设置弹出窗口的高度
######  __wrapClass__ 为弹窗自定义类名
######  __title__



