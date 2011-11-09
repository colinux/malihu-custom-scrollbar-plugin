# malihu custom scrollbar plugin

This is a copy slighlty modified of the original jquery plugin, created by [Malihu](http://manos.malihu.gr/).
You can find the original version, [demos](http://manos.malihu.gr/tuts/jquery_custom_scrollbar.html),
examples and documentation on the official page <http://manos.malihu.gr/jquery-custom-content-scroller>.

This version is modified to have a more complete options mechanism with inheritance. There are 3 major changes:

 * plugin declaration: all options are passed in an object
 * all elements manipulated can be overrided by options
 * mouseWheelSupport and scrollBtnsSupport options are now true/false and no more yes/no


## Requirements

 * jQuery 1.4+
 * For mouse-wheel support: <https://github.com/brandonaaron/jquery-mousewheel>
 * For easing support: <http://gsgd.co.uk/sandbox/jquery/easing/>


## Examples of declaration (modified from the original)

```js
$('#my-big-container').mCustomScrollbar({
  mouseWheelSupport: true,
  scrollBtnsSupport: true,
});


$('#my-big-container').mCustomScrollbar({
  scrollType: "horizontal",
  animSpeed: 300,
  easingType: "easeOutCirc",
  mouseWheelSupport: true,
  scrollBtnsSupport: true,
  customScrollBox_container:  $("#my-big-container .s-container"),
  customScrollBox_content:    $("#my-big-container .s-content")
});
```

Please refer to the code to have a full list of options.

## Minimize it

```
curl \
  -d output_info=compiled_code \
  -d compilation_level=SIMPLE_OPTIMIZATIONS \
  -d code_url=https://raw.github.com/colinux/malihu-custom-scrollbar-plugin/master/jquery.mCustomScrollbar.js \
  http://closure-compiler.appspot.com/compile
```


## License

The original license is CC-BY-3.0
<http://creativecommons.org/licenses/by/3.0/>
