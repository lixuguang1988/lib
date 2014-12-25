/**
 * 
 * @param imgsource img的图片对象地址
 * @param ul  jq img对象的集合 $(".photo img");
 * @param index img在 ul中的索引
 * @return void
 */

function XGallery(imgsource, ul, index){
	var _ = this,
		winHeight = $(window).height(),
		winWidth = $(window).width();
		
	//存储数据
	this.width = Math.ceil(winWidth * 0.9);//弹出框宽度,
	this.height = Math.ceil(winHeight * 0.9);//弹出框高度
	this.index = index;
    this.ul = ul;
	this.length = ul.length;
	this.imgsource = imgsource;
		
	//背景
	this.galleryMask = $("<div>").css({
		'width' : $('body').width(),
		'height' : $(document).height()
	}).addClass('gallery-mask').one('click', function(){
        _.close();
    }).appendTo(document.body);
	
	//主体骨架
	this.gallerySkeleton = $("<div>").css({
		'top': Math.floor(winHeight * 0.05) + $(document).scrollTop(),
		'left' : Math.floor(winWidth * 0.05) + $(document).scrollLeft(),
		'width' : _.width,
		'height' : _.height
	}).addClass('gallery-skeleton').appendTo(document.body);
		
	
	//图片显示区
	this.galleryContent= $("<div>").addClass('gallery-content').appendTo(_.gallerySkeleton);
	//正在加载
	this.galleryLoading = $("<div>").addClass('gallery-loading').appendTo(_.gallerySkeleton);
	//上一张
	$("<div>").addClass('gallery-prev').on('click', {showWhich: "prev"}, function(event){ _.showPrevNext(event); }).appendTo(_.gallerySkeleton);
	//下一张
	$("<div>").addClass('gallery-next').on('click', function(event){ _.showPrevNext(event); }).appendTo(_.gallerySkeleton);
	//关闭按钮
	$("<div>").addClass('gallery-close').on('click', function(){ _.close(); }).appendTo(_.gallerySkeleton);


	this.show(imgsource); //显示点击图片
	
    $(window).on('resize.xgallery', function(){
            _.reRender();
        });        
	}
    
   
	//视口大小改变是重新渲染
XGallery.prototype.reRender = function(){
	var winHeight = $(window).height(),
		winWidth = $(window).width();

	this.width = Math.ceil(winWidth * 0.9);//更新弹出框宽度,
	this.height = Math.ceil(winHeight * 0.9);//更新弹出框高度
	
	this.galleryMask.css({
		'width' : $(document).width(),
		'height' : $(document).height()
	});
	
	this.gallerySkeleton.css({
		'top': Math.floor(winHeight * 0.05) + $(document).scrollTop(),
		'left' : Math.floor(winWidth * 0.05) + $(document).scrollLeft(),
		'width' : this.width,
		'height' : this.height
	});
	this.renderImg(this.imgWidth, this.imgHeight);
}


XGallery.prototype.showPrevNext =  function(event){
	//console.log(event);		
	if(event.data && event.data.showWhich === "prev"){
		this.index = (this.index == 0) ? this.length-1 : --this.index;
	}else{
		this.index = ((this.index+1) == this.length) ? 0 : ++this.index;
	}
	//console.log(this);
	this.imgsource = this.ul.eq(this.index).get(0).src;
	this.show(this.imgsource);
}

XGallery.prototype.show =  function(imgsource){
	var _ = this,
		img = new Image();

	this.galleryLoading.show();
	
	img.onload = function(){
        _.galleryLoading.hide();
        _.galleryContent.html(img);
		_.renderImg(img.width, img.height);
        _.imgWidth = img.width;
        _.imgHeight = img.height;
	};
	img.onerror = function(){
		_.galleryLoading.hide();
	};
	img.src = imgsource;	
	//img.style.display = "none";
}

XGallery.prototype.renderImg =  function(width, height){
    var _ = this,
        aspectratio = (width / height).toFixed(2),
        clientAspectratio = ( _.width / _.height).toFixed(2);
            
    if(aspectratio <= clientAspectratio){ //宽高比小于等于预设的宽高比 
        width = width > _.width ? _.width : width;
        height = Math.floor(width / aspectratio);
        if(height > _.height){//高度却超过区域
            height = _.height;
            width  = Math.floor(height * aspectratio);
        }
    }else{
        height = height > _.height ? _.height : height;
        width  = Math.floor(height * aspectratio);
        if(width > _.width){//宽度却超过区域
            width = _.width;
            height = Math.floor(width / aspectratio);
        }
    }
    _.galleryContent.css({"width" : width, "height": height, 'margin-left': -(width/2), 'margin-top' : -(height/2) }).find('img').css({"width" : width, "height": height}).hide().fadeIn(600);        
}

XGallery.prototype.close =  function(){
	var _ = this;
	
    $(window).off('.xgallery'); //取消window的xgallery全部事件
	_.galleryMask.remove();
	this.gallerySkeleton.find('img').fadeOut(200);
	this.gallerySkeleton.animate({
		width : '0px',
		height : '0px',
		top :  ($(document).scrollTop() + $(window).height()/2) + 'px',
		left : ($(document).scrollLeft() + $(window).width()/2) + 'px'
	}, 400, function(){
		_.gallerySkeleton.remove();
	});
}
    