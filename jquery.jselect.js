/*
.nice-select{width:100%;height:100%;position: relative;border:1px solid #9eb2cd;height:32px;line-height:32px;width:85px;padding-left:15px;
	-webkit-border-radius:4px;
	       border-radius: 4px;
	-webkit-box-shadow:inset 0 0 3px rgba(0,0, 0,.2);
	        box-shadow:inset 0 0 3px rgba(0,0, 0,.2);
}
.nice-select-active{	-webkit-border-radius:4px 4px 0 0;
	       border-radius: 4px 4px 0 0;}
.nice-select-arrow{position: absolute;right:-1px;top:-1px;background:url(../images/nicearrow.png) no-repeat;width:33px;height:34px;cursor: pointer}
.nice-select-lst{position: absolute;left:-1px;top:33px;width:102px;background:#fff;border-bottom:1px solid #a1b4da;display:none}
.nice-select-lst li{text-indent:15px;border:1px solid #a1b4da;border-top:none;border-bottom:none;cursor: pointer}
.nice-select-lst li.selected{background:#ccc}
 */
;(function($){
    $.fn.jselect = function(options){
        var sel;

        return this.each(function(){
            sel = new JSelect(this, options);
        });
    };
    function JSelect(el, options){
        var config = $.extend({
            prefix : 'nice-select',
            extraclass : '',
            click : null  //function(text, value)
        }, options);


        if(el.selectedIndex == -1){
            el.selectedIndex = 0;
        }
        $(el).data({
            text: $(el).find("option:checked").html(),
            value:  el.value
        }).hide();

        this.el = el;
        this.cfg = config;
        this.init();
        this.renderSel();
        this.renderSrh();
        this.select();


    }

    JSelect.prototype.init =  function(){
        var that = this,
            elem = this.el,
            cfg = this.cfg,
            wrap = $("<div />",{
                "class" : cfg.prefix + cfg.extraclass,
                "click" : function(event){
                    /*点击其他元素关闭下拉选项*/
                    $(document).on('click', function(e){
                        if(!(e.target == wrap[0] || $.contains(wrap[0], e.target))) {
                            wrap.removeClass(cfg.prefix + '-active');
                            that.main.hide();
                        }
                    });
                }
            }),
            arrow = $("<div class=\"" + cfg.prefix + "-arrow\"></div>"),
            title = $("<div class=\"" + cfg.prefix + "-title\">"+ $(this.el).find("option:checked").html() +"</div>");

        this.wrap = wrap;
        this.title = title;

        wrap.append(title, arrow);

        title.on("click", function(){
            that.main.toggle();
            if(that.main.css("display") =="none"){
                that.wrap.removeClass(cfg.prefix + '-active');
            }else{
                that.wrap.addClass(cfg.prefix + '-active');
            }
        });
    };


    JSelect.prototype.renderSel = function(){
        var $select = $(this.el),
            cfg = this.cfg,
            html = '<div class="' + cfg.prefix + '-main"><div class="' + cfg.prefix + '-lst">',
            optgroups = $select.find('optgroup'),
            options = $select.find('option'),
            i = 0,
            j,
            firstLoop = true;

        if(!optgroups.length){ //没有分组
            for( ; i < options.length; i++ ){
                html += '<div class="sel-item-opt" data-id="'+ options[i].value +'">'+ options[i].text +'</div>';
            }
        }else{
            for( ; i < optgroups.length; i++){
                options = optgroups.eq(i).find("option");
                if(!firstLoop){
                    html += '<\/div>';
                }
                html += '<div class="sel-item-grp"><div class="sel-item-hd">'+ optgroups.eq(i).attr("label") +'<\/div>';
                for(j = 0; j < options.length; j++){
                    html += '<div class="sel-item-opt" data-id="'+ options[j].value +'">'+ options[j].text +'<\/div>';
                }
                firstLoop = false;
            }
        }

        if(optgroups.length) {
            html += '<\/div>';
        }
        html += '<\/div><\/div>';

        this.wrap.append(html);

        this.main = this.wrap.find("." + cfg.prefix + "-main");

        this.wrap.insertAfter($(this.el));
    };

    JSelect.prototype.renderSrh = function(){
        var search = $("<div class=\"" + this.cfg.prefix + "-search\"><input type='text'><\/div>"),
            $lst  = this.main;
        this.main.prepend(search);

        search.find("input").on("keyup", function(){
            var text = this.value;
            if(!text){
                $lst.find(".sel-item-grp").removeClass("sel-item-hide");
                $lst.find(".sel-item-opt").show();
                return false;
            }

            $lst.find(".sel-item-grp").addClass("sel-item-hide");

            $lst.find(".sel-item-opt").hide().each(function(){
                if($(this).html().indexOf(text) != -1){
                    $(this).parent().removeClass("sel-item-hide");
                    $(this).show();
                }
            });
        });

        this.search = search;

    };

    JSelect.prototype.select = function(){
        var $lst= this.main,
            cfg = this.cfg,
            that = this;

        //绑定下拉选项
        $lst.on("click", '.sel-item-opt', function(event){
            event.stopPropagation();
            event.preventDefault();

            //更改title的值更新el的text/value
            that.title.html(this.innerHTML);
            $(that.el).data({
                text: this.innerHTML,
                value:  $(this).data("id")
            });


            if(typeof cfg.click === "function"){
                cfg.click($(this).data("id"), this.innerHTML, that.el);
            }

            that.search.find("input").val("").trigger("keyup");
            that.main.hide();
        }).on("mouseenter", '.sel-item-opt', function(){
            $(this).addClass("sel-item-active");
        }).on("mouseleave", ".sel-item-opt", function(){
            $(this).removeClass("sel-item-active");
        });
    };
})(jQuery);


