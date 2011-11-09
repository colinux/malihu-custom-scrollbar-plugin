/**
 * malihu custom scrollbar plugin
 * Author: Manos Malihu - http://manos.malihu.gr
 * Refactorized for options inheritance by Colin Darie
 *
 * To enable mouseWheel support, you need jquery mouseWheel plugin
 *   https://github.com/brandonaaron/jquery-mousewheel
 *
 * To enable an easing type, you need jquery easing plugin
 *   http://gsgd.co.uk/sandbox/jquery/easing/
 *
 * Example:
 * $('#my-container').mCustomScrollbar({
 *   scrollType: "horizontal",
 *   animSpeed: 400,
 *   easingType: "easeOutCirc",
 *   mouseWheelSupport: true,
 *   scrollBtnsSupport: true,
 *   customScrollBox_container:  $("#my-container .s-container"),
 *   customScrollBox_content:    $("#my-container .s-content")});
 *
 * Please refer to http://manos.malihu.gr/jquery-custom-content-scroller
 * to see demos, examples with css and more documentation. However be careful,
 * options mechanism and some default values have changed !
 *
 * LICENSE: CC BY 3.0 - http://creativecommons.org/licenses/by/3.0/
 */
(function ($) {
$.fn.mCustomScrollbar = function (options) {

  options.id = $(this).attr("id");

  // defaults options
  var defaults = {
    scrollType:        "vertical", // "vertical" or "horizontal"
    animSpeed:         null,       // default is from animate() function
    easeType:          null,       // if set, require "easing" jquery plugin
    bottomSpace:       1,          // only for vertical scroll: the extra bottom space (>= 1)
    draggerDimType:    "auto",     // "auto" adjusts width analogous to visible content, "fixed" to keep the width fixed by css
    mouseWheelSupport: false,      // if true, enable the scroll by mouse-wheel (require "mousewheel" jquery plugin)
    scrollBtnsSupport: false,      // if true, enable the scroll by pressing buttons
    scrollBtnsSpeed:   10,         // speed of the scroll by pressing buttons

    customScrollBox:            $("#" + options.id + " .customScrollBox"),
    customScrollBox_container:  $("#" + options.id + " .customScrollBox .container"),
    customScrollBox_content:    $("#" + options.id + " .customScrollBox .content"),
    dragger_container:          $("#" + options.id + " .dragger_container"),
    dragger:                    $("#" + options.id + " .dragger"),
    scrollUpBtn:                $("#" + options.id + " .scrollUpBtn"),
    scrollDownBtn:              $("#" + options.id + " .scrollDownBtn"),
    customScrollBox_horWrapper: $("#" + options.id + " .customScrollBox .horWrapper")
  }

  options = $.extend(true, {}, defaults, options);

  //get & store minimum dragger height & width (defined in css)
  if(!options.customScrollBox.data("minDraggerHeight")){
    options.customScrollBox.data("minDraggerHeight",options.dragger.height());
  }
  if(!options.customScrollBox.data("minDraggerWidth")){
    options.customScrollBox.data("minDraggerWidth",options.dragger.width());
  }

  //get & store original content height & width
  if(!options.customScrollBox.data("contentHeight")){
    options.customScrollBox.data("contentHeight",options.customScrollBox_container.height());
  }
  if(!options.customScrollBox.data("contentWidth")){
    options.customScrollBox.data("contentWidth",options.customScrollBox_container.width());
  }

  CustomScroller();

  function CustomScroller(reloadType){
    //horizontal scrolling ------------------------------
    if(options.scrollType=="horizontal"){
      var visibleWidth=options.customScrollBox.width();
      //set content width automatically
      options.customScrollBox_horWrapper.css("width",999999); //set a rediculously high width value ;)
      options.customScrollBox.data("totalContent",options.customScrollBox_container.width()); //get inline div width
      options.customScrollBox_horWrapper.css("width",options.customScrollBox.data("totalContent")); //set back the proper content width value

      if(options.customScrollBox_container.width()>visibleWidth){ //enable scrollbar if content is long
        options.dragger.css("display","block");
        if(reloadType!="resize" && options.customScrollBox_container.width()!=options.customScrollBox.data("contentWidth")){
          options.dragger.css("left",0);
          options.customScrollBox_container.css("left",0);
          options.customScrollBox.data("contentWidth",options.customScrollBox_container.width());
        }
        options.dragger_container.css("display","block");
        options.scrollDownBtn.css("display","inline-block");
        options.scrollUpBtn.css("display","inline-block");
        var totalContent=options.customScrollBox_content.width();
        var minDraggerWidth=options.customScrollBox.data("minDraggerWidth");
        var draggerContainerWidth=options.dragger_container.width();

        function AdjustDraggerWidth(){
          if(options.draggerDimType=="auto"){
            var adjDraggerWidth=Math.round(visibleWidth/totalContent*130); //adjust dragger width analogous to content

            if(adjDraggerWidth<=minDraggerWidth){ //minimum dragger width
              options.dragger.css("width",minDraggerWidth+"px");
            } else if(adjDraggerWidth>=draggerContainerWidth){
               options.dragger.css("width",draggerContainerWidth-10+"px");
            } else {
              options.dragger.css("width",adjDraggerWidth+"px");
            }
          }
        }
        AdjustDraggerWidth();

        var targX=0;
        var draggerWidth=options.dragger.width();
        options.dragger.draggable({
          axis: "x",
          containment: "parent",
          drag: function(event, ui) {
            ScrollX();
          },
          stop: function(event, ui) {
            DraggerRelease();
          }
        });

        options.dragger_container.click(function(e) {
          var $this=$(this);
          var mouseCoord=(e.pageX - $this.offset().left);
          if(mouseCoord<options.dragger.position().left || mouseCoord>(options.dragger.position().left+options.dragger.width())){
            var targetPos=mouseCoord+options.dragger.width();
            if(targetPos<options.dragger_container.width()){
              options.dragger.css("left",mouseCoord);
              ScrollX();
            } else {
              options.dragger.css("left",options.dragger_container.width()-options.dragger.width());
              ScrollX();
            }
          }
        });

        //mousewheel
        $(function($) {
          if(options.mouseWheelSupport){
            options.customScrollBox.unbind("mousewheel");
            options.customScrollBox.bind("mousewheel", function(event, delta, deltaX) {
              if (deltaX != 0) {
                var vel = Math.abs(deltaX*10);
                options.dragger.css("left", options.dragger.position().left-(delta*vel));
                ScrollX();
                if(options.dragger.position().left<0){
                  options.dragger.css("left", 0);
                  options.customScrollBox_container.stop();
                  ScrollX();
                }
                if(options.dragger.position().left>options.dragger_container.width()-options.dragger.width()){
                  options.dragger.css("left", options.dragger_container.width()-options.dragger.width());
                  options.customScrollBox_container.stop();
                  ScrollX();
                }
                return false;
              }
            });
          }
        });

        //scroll buttons
        if(options.scrollBtnsSupport){
          options.scrollDownBtn.mouseup(function(){
            BtnsScrollXStop();
          }).mousedown(function(){
            BtnsScrollX("down");
          }).mouseout(function(){
            BtnsScrollXStop();
          });

          options.scrollUpBtn.mouseup(function(){
            BtnsScrollXStop();
          }).mousedown(function(){
            BtnsScrollX("up");
          }).mouseout(function(){
            BtnsScrollXStop();
          });

          options.scrollDownBtn.click(function(e) {
            e.preventDefault();
          });
          options.scrollUpBtn.click(function(e) {
            e.preventDefault();
          });

          btnsScrollTimerX=0;

          function BtnsScrollX(dir){
            if(dir=="down"){
              var btnsScrollTo=options.dragger_container.width()-options.dragger.width();
              var scrollSpeed=Math.abs(options.dragger.position().left-btnsScrollTo)*(100/options.scrollBtnsSpeed);
              options.dragger.stop().animate({left: btnsScrollTo}, scrollSpeed,"linear");
            } else {
              var btnsScrollTo=0;
              var scrollSpeed=Math.abs(options.dragger.position().left-btnsScrollTo)*(100/options.scrollBtnsSpeed);
              options.dragger.stop().animate({left: -btnsScrollTo}, scrollSpeed,"linear");
            }
            clearInterval(btnsScrollTimerX);
            btnsScrollTimerX = setInterval( ScrollX, 20);
          }

          function BtnsScrollXStop(){
            clearInterval(btnsScrollTimerX);
            options.dragger.stop();
          }
        }

        //scroll
        var scrollAmount=(totalContent-visibleWidth)/(draggerContainerWidth-draggerWidth);
        function ScrollX(){
          var draggerX=options.dragger.position().left;
          var targX=-draggerX*scrollAmount;
          var thePos=options.customScrollBox_container.css('marginLeft').replace('px','') - targX;
          options.customScrollBox_container.stop().animate({marginLeft: "-="+thePos}, options.animSpeed, options.easeType);
        }
      } else { //disable scrollbar if content is short
        options.dragger.css("left",0).css("display","none"); //reset content scroll
        options.customScrollBox_container.css("left",0);
        options.dragger_container.css("display","none");
        options.scrollDownBtn.css("display","none");
        options.scrollUpBtn.css("display","none");
      }
    //vertical scrolling ------------------------------
    } else {
      var visibleHeight=options.customScrollBox.height();
      if(options.customScrollBox_container.height()>visibleHeight){ //enable scrollbar if content is long
        options.dragger.css("display","block");
        if(reloadType!="resize" && options.customScrollBox_container.height()!=options.customScrollBox.data("contentHeight")){
          options.dragger.css("top",0);
          options.customScrollBox_container.css("top",0);
          options.customScrollBox.data("contentHeight",options.customScrollBox_container.height());
        }
        options.dragger_container.css("display","block");
        options.scrollDownBtn.css("display","inline-block");
        options.scrollUpBtn.css("display","inline-block");
        var totalContent=options.customScrollBox_content.height();
        var minDraggerHeight=options.customScrollBox.data("minDraggerHeight");
        var draggerContainerHeight=options.dragger_container.height();

        function AdjustDraggerHeight(){
          if(options.draggerDimType=="auto"){
            var adjDraggerHeight=Math.round(visibleHeight/totalContent*130); //adjust dragger width analogous to content
            if(adjDraggerHeight<=minDraggerHeight){ //minimum dragger height
              options.dragger.css("height",minDraggerHeight+"px").css("line-height",minDraggerHeight+"px");
            } else if(adjDraggerHeight>=draggerContainerHeight){
              options.dragger.css("height",draggerContainerHeight-10+"px").css("line-height",draggerContainerHeight-10+"px");
            } else {
              options.dragger.css("height",adjDraggerHeight+"px").css("line-height",adjDraggerHeight+"px");
            }
          }
        }
        AdjustDraggerHeight();

        var targY=0;
        var draggerHeight=options.dragger.height();
        options.dragger.draggable({
          axis: "y",
          containment: "parent",
          drag: function(event, ui) {
            Scroll();
          },
          stop: function(event, ui) {
            DraggerRelease();
          }
        });

        options.dragger_container.click(function(e) {
          var $this=$(this);
          var mouseCoord=(e.pageY - $this.offset().top);
          if(mouseCoord<options.dragger.position().top || mouseCoord>(options.dragger.position().top+options.dragger.height())){
            var targetPos=mouseCoord+options.dragger.height();
            if(targetPos<options.dragger_container.height()){
              options.dragger.css("top",mouseCoord);
              Scroll();
            } else {
              options.dragger.css("top",options.dragger_container.height()-options.dragger.height());
              Scroll();
            }
          }
        });

        //mousewheel
        $(function($) {
          if(options.mouseWheelSupport){
            options.customScrollBox.unbind("mousewheel");
            options.customScrollBox.bind("mousewheel", function(event, delta) {
              var vel = Math.abs(delta*10);
              options.dragger.css("top", options.dragger.position().top-(delta*vel));
              Scroll();
              if(options.dragger.position().top<0){
                options.dragger.css("top", 0);
                options.customScrollBox_container.stop();
                Scroll();
              }
              if(options.dragger.position().top>options.dragger_container.height()-options.dragger.height()){
                options.dragger.css("top", options.dragger_container.height()-options.dragger.height());
                options.customScrollBox_container.stop();
                Scroll();
              }
              return false;
            });
          }
        });

        //scroll buttons
        if(scrollBtnsSupport){
          options.scrollDownBtn.mouseup(function(){
            BtnsScrollStop();
          }).mousedown(function(){
            BtnsScroll("down");
          }).mouseout(function(){
            BtnsScrollStop();
          });

          options.scrollUpBtn.mouseup(function(){
            BtnsScrollStop();
          }).mousedown(function(){
            BtnsScroll("up");
          }).mouseout(function(){
            BtnsScrollStop();
          });

          options.scrollDownBtn.click(function(e) {
            e.preventDefault();
          });
          options.scrollUpBtn.click(function(e) {
            e.preventDefault();
          });

          btnsScrollTimer=0;

          function BtnsScroll(dir){
            if(dir=="down"){
              var btnsScrollTo=options.dragger_container.height()-options.dragger.height();
              var scrollSpeed=Math.abs(options.dragger.position().top-btnsScrollTo)*(100/scrollBtnsSpeed);
              options.dragger.stop().animate({top: btnsScrollTo}, scrollSpeed,"linear");
            } else {
              var btnsScrollTo=0;
              var scrollSpeed=Math.abs(options.dragger.position().top-btnsScrollTo)*(100/scrollBtnsSpeed);
              options.dragger.stop().animate({top: -btnsScrollTo}, scrollSpeed,"linear");
            }
            clearInterval(btnsScrollTimer);
            btnsScrollTimer = setInterval( Scroll, 20);
          }

          function BtnsScrollStop(){
            clearInterval(btnsScrollTimer);
            options.dragger.stop();
          }
        }

        //scroll
        if(options.bottomSpace<1){
          options.bottomSpace=1; //minimum bottomSpace value is 1
        }
        var scrollAmount=(totalContent-(visibleHeight/options.bottomSpace))/(draggerContainerHeight-draggerHeight);
        function Scroll(){
          var draggerY=options.dragger.position().top;
          var targY=-draggerY*scrollAmount;
          var thePos=options.customScrollBox_container.position().top-targY;
          options.customScrollBox_container.stop().animate({top: "-="+thePos}, options.animSpeed, options.easeType);
        }
      } else { //disable scrollbar if content is short
        options.dragger.css("top",0).css("display","none"); //reset content scroll
        options.customScrollBox_container.css("top",0);
        options.dragger_container.css("display","none");
        options.scrollDownBtn.css("display","none");
        options.scrollUpBtn.css("display","none");
      }
    }

    options.dragger.mouseup(function(){
      DraggerRelease();
    }).mousedown(function(){
      DraggerPress();
    });

    function DraggerPress(){
      options.dragger.addClass("dragger_pressed");
    }

    function DraggerRelease(){
      options.dragger.removeClass("dragger_pressed");
    }
  }

  $(window).resize(function() {
    if(options.scrollType=="horizontal"){
      if(options.dragger.position().left>options.dragger_container.width()-options.dragger.width()){
        options.dragger.css("left", options.dragger_container.width()-options.dragger.width());
      }
    } else {
      if(options.dragger.position().top>options.dragger_container.height()-options.dragger.height()){
        options.dragger.css("top", options.dragger_container.height()-options.dragger.height());
      }
    }
    CustomScroller("resize");
  });
};
})(jQuery);
