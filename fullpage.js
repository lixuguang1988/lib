/**
 * Created by lixuguang on 2015/11/4.
 */

function Fullpage(options){
    options = $.extend({index: 0, zIndex : 101, gap : 100}, options);

    this.index = options.index;
    this.zIndex = options.zIndex;
    this.element = options.element;
    this.gap = options.gap;

    this.items = this.element.children();
    this.length = this.items.length;
    this.currentItem = this.items.eq(this.index);
    this.previousItem = this.getPrev();
    this.nextItem = this.getNext();
    this.viewport = this.getViewport();
    this.moveTarget = null;
    this.flag = false;

    this.init();
    this.bind();

    //让items里面的超链接可以点击
    this.items.find("a").on("click touchstart touchmove touchend pointermove pointerdown pointermove mousedown mousemove mouseup", function(event){
        event.stopPropagation();
    });

}

Fullpage.prototype= {
    constructor : Fullpage,
    init : function(){
        var self =  this;
        self.element.css({
            width : self.viewport.width + "px",
            height : self.viewport.height + "px"
        });
        self.items.eq(self.index).css({
            "z-index" : self.zIndex
        }).siblings().css({
            "z-index" : ++self.zIndex,
            "top" : self.viewport.height + "px"
        });
        self.previousItem.css("top", "-" + self.viewport.height + "px");
    },
    getPrev: function(){
        return this.currentItem.prev().length ? this.currentItem.prev() : this.items.eq(this.length-1);
    },
    getNext: function(){
        return this.currentItem.next().length ? this.currentItem.next() : this.items.eq(0);
    },
    bind : function(){
        var self = this,
            initialY = 0,
            diffY = 0,
            element = null,
            pointer = [];
        if("onpointerdown" in window){ // 支持指针事件用指针事件
            pointer =["pointerdown", "pointermove", "pointermove"];
        }else if("ontouchstart" in window){//支持触摸事件
            pointer =["touchstart", "touchmove", "touchend"];
        }else{
            pointer =["mousedown", "mousemove", "mouseup"];
        }

        self.element.on(pointer[0], pointerHandle);
        self.element.on(pointer[1], pointerHandle);
        self.element.on(pointer[2], pointerHandle);

        function pointerHandle(event){
            var type;
            if(self.flag){return false;}
            event.preventDefault();
            type = event.type;
            event = type.indexOf("touch") > -1 ? event.originalEvent.changedTouches[0] : event;
            switch(type){
                case pointer[0] :
                    element = $(this);
                    initialY = event.pageY;
                    break;
                case pointer[1]:
                    if(element){
                        diffY = event.pageY - initialY;
                        if(diffY < 0){ //往上拖动
                            self.moveTarget = self.nextItem;
                        }else{ //往下拖动
                            self.moveTarget = self.previousItem;
                        }
                        self.moveElement(diffY);
                    }
                    break;
                case pointer[2] :
                    if(self.moveTarget && self.moveTarget.length && element){
                        self.flag = true;
                        if(Math.abs(diffY) > self.gap){
                            self.moveEnd();
                        }else{
                            self.moveCancel(diffY);
                        }
                        element = null;
                    }
                    break;
            }
        }

    },
    /**
     *
     * @param diff
     * 实时移动元素位置
     *
     */
    moveElement: function (diff){
        var self = this,
            top;
        if(diff < 0){
            top = diff + self.viewport.height + "px";
        }else{
            top = diff - self.viewport.height + "px";
        }
        this.moveTarget.css({
            "top" : top
        });
    },
    /**
     * 移动元素到最终位置
     */
    moveEnd: function(){
        var self = this;
        this.moveTarget.animate({
            "top" : "0"
        }, 250, function(){
            $(this).css({
                "z-index" : self.zIndex
            }).siblings().css({
                "z-index" : ++self.zIndex,
                "top" : self.viewport.height + "px"
            });
            self.index = $(this).index();
            self.currentItem = $(this);
            self.nextItem  = self.getNext();
            self.previousItem = self.getPrev();
            self.previousItem.css({
                "top" : -self.viewport.height + "px"
            });
            self.flag = false;
        });
    },
    /**
     * 取消移动元素，重置移动元素为初始位置
     *
     */
    moveCancel: function(diff){
        var self = this,
            top ;
        if(diff < 0){
            top = self.viewport.height + "px";
        }else{
            top = -self.viewport.height + "px"
        }
        this.moveTarget.animate({
            "top" : top
        }, 250, function(){
            self.flag = false;
        });
    },
    getViewport: function(){
        if (typeof window.innerWidth == "number") {
            return {width: window.innerWidth, height: window.innerHeight};
        }
        if (document.compatMode === "CSS1Compat") {
            return {width: document.documentElement.clientWidth, height: document.documentElement.clientHeight}
        } else {
            return {width: document.body.clientWidth, height: document.body.clientHeight}
        }
    }
};
