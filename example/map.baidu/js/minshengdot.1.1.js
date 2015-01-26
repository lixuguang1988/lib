var bankdotOverlayzIndex = 1; /*让激活的覆盖物永远在最上层*/
/** 
 * 银行网点地图覆盖物的构造函数
 * @param {Object} map 地图的实例   new BMap.Map(container)
 * @param {Object} center 覆盖物的point new BMap.Point(lng, lat)
 * @param {String} title 覆盖物的标题
 * @param {Number} index 覆盖物的序号(base0)
 * @param {Object} size 预设覆盖物默认状态的大小 {width:number, height:number}
 */

function BankDotOverlay(map, center, title, index, size){
	//保存地图的对象实例
	this._map = map;
	this._center = center;
	this._title = title;
	this._index = index;
	this._size = size;

	this._active = false; /*保存覆盖物是否激活的状态*/
	this._point = null; /*激活状态时候保存改点*/
}	

//继承API的BMap.Overlay    
BankDotOverlay.prototype = new BMap.Overlay();

//实现自定义覆盖物的初始化方法  
BankDotOverlay.prototype.initialize = function(){
	//自定义覆盖物的容器
	var div = document.createElement('div'),
		_ = this;
		
	div.innerHTML ='<div class="bank-dot-title">'+ this._title + '</div><div class="bank-dot-right"></div>';		
	div.className = 'bank-dot';
	div.style.position = 'absolute';
	
	//添加覆盖物到地图容器中
	this._map.getPanes().markerPane.appendChild(div);
	
	//保存覆盖物容器
	this._div = div;
	
	//给覆盖物添加click事件
	div.onclick = function(){
		_.toggle();
	};
	
	return div;
};

//覆盖overlay的draw方法
BankDotOverlay.prototype.draw =  function(){
	//根据地理坐标转换为像素坐标，并设置给容器   
	var pixel = this._map.pointToOverlayPixel(this._center);
	this._div.style.left = pixel.x - Math.ceil(this._size.width/2) + 'px';
	this._div.style.top = pixel.y - this._size.height + 'px';
};

//实现显示方法  
BankDotOverlay.prototype.show = function(){
	//关闭之前激活状态的银行网点覆盖物
     this.unactive();  
      
     this._div.className = 'bank-dot-active'; 
     this._div.style.width = "auto";
     this._div.style.zIndex = bankdotOverlayzIndex++;
     this._active = true;  
     this._point = this._center;
     
     //激活panel列表对应项
     MapX.activePanel(this._index);      	
};


// 覆盖隐藏方法  
BankDotOverlay.prototype.hide = function(){    
     this._div.className = 'bank-dot';
     this._div.style.width = this._size.width + "px";
     this._active = false;
     this._point = null;     
     //激活panel列表对应项
     MapX.unactivePanel(this._index);      	
};

//添加toggle
BankDotOverlay.prototype.toggle = function(){
     if (this._div.className === "bank-dot-active"){
          this.hide();
     }else{ 
          this.show();
     }    
};

//把激活的选项的关闭恢复为非激活状态
BankDotOverlay.prototype.unactive = function(){
	//得到所有的覆盖物
	var overlays = this._map.getOverlays();
	for(var i = 0; i < overlays.length; i++){
		if(typeof overlays[i]._active !== 'undefined'){
			if(overlays[i]._active){
				overlays[i].hide();
				break;
			}
		}
	}
};






var MapX =  MapX || {
		map : null,
		cityname : "南京",
		panel : "msdotPanel",
		overlays : [],
		activeIndex : null,
		activePoint : null,
		xhr : {}, /*从服务端取数据的ajax请求的jquery对象*/
		max : null, /*保存地图东北方向的Point*/
		min : null /*保存地图西南方向的Point*/
	};

/**
 * 初始化地图 
 * @param {string|Object} container 地图显示的元素  ["侧边面板元素的ID", Dom Node]
 * @param {string} panel 地图列表的面板  侧边面板元素的ID
 * @param {Object} cityname 初始化的城市名
 */
MapX.initialize =  function(container, panel, cityname){
	var map = new BMap.Map(container);
	
	if(arguments.length < 2){
		throw new Error("该函数必须有两个参数");
	}
	cityname =  cityname || this.cityname;
	panel = panel || this.panel;

	//保存地图/面板的快捷访问
	this.map = map;	
	this.panel = document.getElementById(panel);
	
	//绑定地图监听的事件
	this.bindEvent();	
	
	map.centerAndZoom(cityname); //用城市名初始化地图会导致立即调用getCenter/getZoom/getBounds的不对
	//配置地图
	map.enableScrollWheelZoom(); //开启鼠标滚轮放大缩小地图
	map.disableDoubleClickZoom(); //关闭双击地图放大，防止点击覆盖物放大地图缩放级别
	//添加控件并移动位置到右上角
	map.addControl(new BMap.NavigationControl());
};

MapX.bindEvent = function(){
	var _ = this,
		map = this.map;
		
	//地图加载成功的回调函数
	map.addEventListener('load', function(){
		_.getBounds();
	});
	//地图可视区域发生变化
	map.addEventListener('resize', function(){
		_.getBounds();
	});
	//地图拖动移动后
	map.addEventListener('moveend', function(){
		_.getBounds();
	});
	//地图缩放级别发生变哈后
	map.addEventListener('zoomend', function(){
		_.getBounds();
	});	
};

/**
 * 获取地图的矩形可视区域(BMap.Bounds),然后设置此时的地图可视区域的最大(小)经纬度
 */
MapX.getBounds = function(){
	var _  = this;
	//清除没有完成的动作
	clearTimeout(this.getBoundsTimer);
	this.getBoundsTimer = setTimeout(function(){
		var bounds = _.map.getBounds();
		_.min = bounds.getSouthWest();
		_.max = bounds.getNorthEast();
		
		_.renderOverlay();
	}, 100); 
};

MapX.renderOverlay = function(){
	var index, /*存储银行网点的覆盖物*/
	    lastpoint,
	    point;
		
	//清除非激活的覆盖物	
	this.clearOverlay();
	index = this.overlays.length;
	if(index == 1){
		lastpoint = this.overlays[0];
	}	
	//清空面板
	this.panel.innerHTML = '';
	
	//添加图标点
	for(var i = 0; i < msdot.length; i++){
		//不在可视区域里
		if(this.min.lng > msdot[i].lng ||   this.max.lng < msdot[i].lng || this.min.lat > msdot[i].lat ||  this.max.lat < msdot[i].lat){
			continue;
		}
		
		point = new BMap.Point(msdot[i].lng, msdot[i].lat);	
		if(point.equals(lastpoint)){
			continue;
		}
		var bankdot = new BankDotOverlay(this.map, point, msdot[i].title, index, {width:34,height:44});
		
		this.map.addOverlay(bankdot); //覆盖物添加到地图上
		this.overlays.push(bankdot);
		this.addPanel(msdot[i], index);
		index++;
	}
	
};

/**
 * 清除非激活的覆盖物 
 */
MapX.clearOverlay = function(){
	var temp = [],
	i = 0,
	len = this.overlays.length;
	for( ; i < len ; i++){
		if(this.overlays[i]._active !== true){
			this.map.removeOverlay(this.overlays[i]);
		}else{
			temp.push(this.overlays[i]);
		}	
	}
	this.overlays = temp;
};


MapX.addPanel =  function(item, index){
	var dot = document.createElement("div"),
		title = document.createElement('h2'),
		address = document.createElement('div'),
		_ = this;
	
	dot.className = "ms-dot";
	title.appendChild(document.createTextNode(item.title));
	address.appendChild(document.createTextNode(item.address));
	dot.appendChild(title);
	dot.appendChild(address);
	
	this.panel.appendChild(dot);
	
	//给Panel列表添加点击事件
	EventUtil.addEventListener(dot, 'click', function(){
		_.overlays[index]._div.click();		
	});
};


MapX.activePanel = function(index){
	var dots = this.panel.childNodes/*拼接字符串没有空格*/,
		dot;
	
	for(var i = 0, lens = dots.length; i < lens ; i++){
		dot = dots[i];
		if(i < index && i < index-1){
			dot.style.display  = "none";
		}else{
			dot.style.display  = "block";
		}
		if(i != index){
			dot.className = "ms-dot";
		}else{
			dot.className = "ms-dot-active";
		}
	}
	
	
};


MapX.unactivePanel = function(index){
	var dots = this.panel.childNodes/*拼接字符串没有空格*/,
		dot;
		
	for(var i = 0, lens = dots.length; i < lens ; i++){
		dot = dots[i];
		dot.className = "ms-dot";
		dot.style.display  = "block";		
	}
};





//民生银行(社区金融中心
var msdot = [ {
 	title: "中国民生银行(社区金融服务南京0011)",
 	address: "定淮门大街11-3号",
 	lng: 118.747215,
 	lat: 32.070667
 }, {
 	title: "中国民生银行(社区金融服务南京0042",
 	address: "水西门大街276-2",
 	lng: 118.760186,
 	lat: 32.039574
 }, {
 	title: "中国民生银行(社区金融服务南京0007)",
 	address: "光华路2-7临",
 	lng: 118.822971,
 	lat: 32.025945
 }, {
 	title: "中国民生银行(社区金融服务南京0049)",
 	address: "御道街56-3临",
 	lng: 118.822514,
 	lat: 32.033307
 }, {
 	title: "中国民生银行(社区金融服务南京0003)",
 	address: "长虹路31-7",
 	lng: 118.773157,
 	lat: 32.035113
 }, {
 	title: "中国民生银行(社区金融服务南京0006",
 	address: "集庆门大街93",
 	lng: 118.763824,
 	lat: 32.029044
 }, {
 	title: "中国民生银行(社区金融服务南京0056)",
 	address: "白龙江西街62-5",
 	lng: 118.71983,
 	lat: 32.003778
 }, {
 	title: "中国民生银行(社区金融服务南京0054)",
 	address: "双龙大道833号南方花园34幢108",
 	lng: 118.825956,
 	lat: 31.965809
 }, {
 	title: "中国民生银行(社区金融服务南京0017)",
 	address: "樱花路99号",
 	lng: 118.839397,
 	lat: 32.092067
 }, {
 	title: "中国民生银行(社区金融服务南京0033)",
 	address: "南京市玄武区",
 	lng: 118.855413,
 	lat: 32.03838
 }, {
 	title: "中国民生银行(社区金融服务南京0084)",
 	address: "星海路6-5",
 	lng: 118.869068,
 	lat: 32.023901
 }, {
 	title: "中国民生银行(社区金融服务南京0044)",
 	address: "文鼎雅苑14幢-107",
 	lng: 118.917764,
 	lat: 31.915901
 }, {
 	title: "中国民生银行(社区金融服务南京0089)",
 	address: "南京市江宁区",
 	lng: 118.872873,
 	lat: 31.971928
 }, {
 	title: "中国民生银行(社区金融服务南京0050)",
 	address: "南京市浦口区",
 	lng: 118.750575,
 	lat: 32.140036
 }, {
 	title: "中国民生银行(社区金融服务南京0036)",
 	address: "旭日爱上城11-106",
 	lng: 118.722239,
 	lat: 32.135694
 }, {
 	title: "中国民生银行(社区金融服务南京0052)",
 	address: "南京市浦口区",
 	lng: 118.713797,
 	lat: 32.115351
 }, {
 	title: "中国民生银行(社区金融服务南京0018)",
 	address: "太平北路114-2",
 	lng: 118.803051,
 	lat: 32.056376
 }, {
 	title: "中国民生银行(社区金融服务南京0059)",
 	address: "光华东街8-10临",
 	lng: 118.827502,
 	lat: 32.029963
 }, {
 	title: "中国民生银行(社区金融服务南京0001)",
 	address: "南京市建邺区",
 	lng: 118.74522,
 	lat: 32.004268
 }, {
 	title: "中国民生银行(社区金融服务南京0070)",
 	address: "南京市江宁区",
 	lng: 118.82568,
 	lat: 31.97437
 }, {
 	title: "中国民生银行(社区金融服务南京0046)",
 	address: "和燕路498号1幢",
 	lng: 118.830502,
 	lat: 32.139791
 }, {
 	title: "中国民生银行(社区金融服务南京0039)",
 	address: "南京市白下区",
 	lng: 118.845788,
 	lat: 32.038801
 }, {
 	title: "中国民生银行(社区金融服务南京0010)",
 	address: "竹山路88-4号竹山大厦1层",
 	lng: 118.851859,
 	lat: 31.952559
 }, {
 	title: "中国民生银行(社区金融服务南京0021)",
 	address: "和燕路260号",
 	lng: 118.809317,
 	lat: 32.10428
 }, {
 	title: "中国民生银行(社区金融服务南京0020)",
 	address: "和燕路25-10",
 	lng: 118.796212,
 	lat: 32.101481
 }, {
 	title: "中国民生银行(社区金融服务南京0019)",
 	address: "南京市栖霞区",
 	lng: 118.818466,
 	lat: 32.112087
 }, {
 	title: "中国民生银行(社区金融服务南京0053)",
 	address: "南浦路301-27号",
 	lng: 118.739783,
 	lat: 32.145019
 }, {
 	title: "中国民生银行(社区金融服务南京0016)",
 	address: "进香河路12",
 	lng: 118.796597,
 	lat: 32.057279
 }, {
 	title: "中国民生银行(社区金融服务南京0047)",
 	address: "南京市鼓楼区",
 	lng: 118.744599,
 	lat: 32.059628
 }, {
 	title: "中国民生银行(社区金融服务南京0026)",
 	address: "南京市秦淮区",
 	lng: 118.81298,
 	lat: 32.01425
 }, {
 	title: "中国民生银行(社区金融服务南京0037)",
 	address: "南京市秦淮区",
 	lng: 118.797816,
 	lat: 32.025669
 }, {
 	title: "中国民生银行(社区金融服务南京0004)",
 	address: "云河路11-9",
 	lng: 118.769787,
 	lat: 32.029044
 }, {
 	title: "中国民生银行(社区金融服务南京0032)",
 	address: "南京市鼓楼区",
 	lng: 118.739565,
 	lat: 32.050707
 }, {
 	title: "中国民生银行(社区金融服务南京0028)",
 	address: "南京市江宁区",
 	lng: 118.811766,
 	lat: 31.949993
 }, {
 	title: "民生银行(社区金融服务南京0031)",
 	address: "南京市鼓楼区",
 	lng: 118.760166,
 	lat: 32.048236
 }, {
 	title: "中国民生银行社区金融服务咨询站",
 	address: "上海市虹口区",
 	lng: 121.472163,
	lat: 31.283876
 }, {
 	title: "中国民生银行社区金融服务咨询站",
 	address: "上海市浦东新区",
 	lng: 121.598996,
	lat: 31.271809
 }, {
 	title: "中国民生银行上海分行社区金融服务咨询站",
 	address: "一二八纪念路915",
 	lng: 121.453906,
	lat: 31.33159
 }, {
 	title: "中国民生银行(上海分行社区金融服务咨询站)",
 	address: "文翔路930附近",
 	lng: 121.243986,
	lat: 31.048661
 }, {
 	title: "中国民生银行(上海分行社区金融服务咨询站NO.023901)",
 	address: "上海市浦东新区",
 	lng: 121.601524,
	lat: 31.205233
 }, {
 	title: "中国民生银行上海分行社区金融服务咨询站NO.020401",
 	address: "上海市普陀区中潭路99弄139号",
 	lng: 121.443998,
	lat: 31.257679
 }, {
 	title: "中国民生银行上海分行社区金融服务咨询站",
 	address: "上海市杨浦区",
 	lng: 121.513567,
	lat: 31.276917
 }, {
 	title: "中国民生银行上海分行社区金融服务咨询站NO.026403",
 	address: "上海市闸北区",
 	lng: 121.449177,
	lat: 31.276971
 }, {
 	title: "中国民生银行上海分行社区金融服务咨询站NO.022711",
 	address: "广富林路1188弄172-104",
 	lng: 121.242162,
	lat: 31.068754
 }, {
 	title: "中国民生银行上海分行社区金融服务咨询站NO.025804",
 	address: "政悦路576",
 	lng: 121.53102,
	lat: 31.340473
 }, {
 	title: "中国民生银行(日晖新城社区支行)",
 	address: "上海市徐汇区零陵路23号",
 	lng: 121.473288,
	lat: 31.201024
 }, {
 	title: "中国民生银行(上海分行社区金融服务站NO.020402)",
 	address: "长兴路59",
 	lng: 121.467588,
	lat: 31.255773
 }, {
 	title: "中国民生银行(社区金融服务咨询站)",
 	address: "胡家木桥路177",
 	lng: 121.500419,
	lat: 31.266152
 }, {
 	title: "中国民生银行(上海分行社区金融服务咨询站NO.024601)",
 	address: "新闸路395",
 	lng: 121.472669,
	lat: 31.244875
 }, {
 	title: "中国民生银行(上海分行社区金融服务咨询站NO.020502)",
 	address: "控江路2236号",
 	lng: 121.513567,
	lat: 31.276917
 }, {
 	title: "中国民生银行(上海分行社区金融服务咨询站NO.024001)",
 	address: "上海市长宁区",
 	lng: 121.387389,
	lat: 31.223068
 }, {
 	title: "中国民生银行(上海分行社区金融服务咨询站NO.025408)",
 	address: "涵青路430",
 	lng: 121.402362,
	lat: 31.33469
 }, {
 	title: "民生银行幸福小镇社区支行",
 	address: "上海市浦东新区",
 	lng: 121.616173,
	lat: 31.305422
 }, {
 	title: "中国民生银行(上海分行社区金融服务咨询站NO.025407)",
 	address: "南陈路281-2",
 	lng: 121.404894,
	lat: 31.315048
 }, {
 	title: "中国民生银行(上海分行社区金融服务咨询站NO.020904)",
 	address: "宝山路258",
 	lng: 121.482826,
	lat: 31.25957
 }, {
 	title: "中国民生银行(上海分行社区金融服务咨询站NO.022101)",
 	address: "北京西路182",
 	lng: 121.476588,
	lat: 31.242266
 }, {
 	title: "中国民生银行(上海分行社区金融服务咨询站NO.022302)",
 	address: "上海市长宁区",
 	lng: 121.432964,
	lat: 31.211194
 }, {
 	title: "中国民生银行(上海分行社区金融服务咨询站NO.020801)",
 	address: "上海市长宁区",
 	lng: 121.379432,
	lat: 31.210321
 }, {
 	title: "中国民生银行(上海分行社区金融服务咨询站NO.023201)",
 	address: "新会路241",
 	lng: 121.447043,
	lat: 31.246681
 }, {
 	title: "中国民生银行(上海分行社区金融服务咨询站NO.022708)",
 	address: "荣乐西路1635弄甲41",
 	lng: 121.204912,
	lat: 31.021726
 }, {
 	title: "中国民生银行(社区金融服务站)",
 	address: "上海市松江区",
 	lng: 121.22108,
	lat: 31.018151
 }, {
 	title: "中国民生银行(上海分行社区金融服务咨询站NO.022703)",
 	address: "荣乐中路835弄10",
 	lng: 121.222893,
	lat: 31.022732
 }, {
 	title: "中国民生银行(上海分行社区金融服务咨询站NO.020101)",
 	address: "上海市浦东新区",
 	lng: 121.560066,
	lat: 31.250486
 }, {
 	title: "中国民生银行(上海分行社区金融服务咨询站NO.022702)",
 	address: "玉树北路443",
 	lng: 121.210411,
	lat: 31.034112
 }, {
 	title: "中国民生银行(上海分行社区金融服务咨询站NO.020505)",
 	address: "公平路752-2临",
 	lng: 121.506965,
	lat: 31.265203
 }, {
	title: "中国民生银行(广州社区金融服务站)",
	address: "广州市白云区",
	lng: 113.26142,
	lat: 23.173981
 }, {
	title: "中国民生银行(广州社区金融服务站)",
	address: "广州市天河区海明路",
	lng: 113.347929,
	lat: 23.121469
 }, {
	title: "中国民生银行(广州社区金融服务站)",
	address: "桥中南路190",
	lng: 113.230351,
	lat: 23.124502
 }, {
	title: "中国民生银行(黄沙社区服务中心)",
	address: "黄沙大道8号西城都荟1层",
	lng: 113.247491,
	lat: 23.117157
 }, {
	title: "中国民生银行嘉铭园社区支行",
	address: "北京市朝阳区北苑路86号嘉铭桐城B区7号楼底商",
	lng: 116.429729,
	lat: 40.009451
 }, {
	title: "中国民生银行(宝盛里芳清园社区支行)",
	address: "北京市海淀区宝盛里芳清园3号",
	lng: 116.379225,
	lat: 40.038369
 }, {
	title: "中国民生银行东湖社区支行",
	address: "利泽西园315-109",
	lng: 116.469778,
	lat: 40.014604
 }, {
	title: "中国民生银行北京林翠社区支行",
	address: "林萃路9号院京师园（院内）五号楼",
	lng: 116.377509,
	lat: 40.023286
 }, {
	title: "中国民生银行北京丰台珠江御景社区支行",
	address: "长云路珠江御景小区北门内11号楼底商1-9",
	lng: 116.183298,
	lat: 39.827396
 }, {
	title: "中国民生银行24小时自助银行(南郞家园社区卫生服务站西)",
	address: "建国路128号中航工业大厦",
	lng: 116.47104,
	lat: 39.911896
 }, {
	title: "中国民生银行24小时自助银行(怡海社区卫生服务站东)",
	address: "怡海花园商业街",
	lng: 116.308606,
	lat: 39.839925
 }];
