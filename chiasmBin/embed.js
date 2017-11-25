!function(){function e(e){this.elem=e,this.isHidden=!1,this.placeholder=null}if(window.__is_c2k_listener_set__)return void window.postMessage("c2k_embed_loaded","*")
var t=function(e){return window.getComputedStyle?getComputedStyle(e,""):e.currentStyle}
e.prototype.showIframePlaceholder=function(e){var i=this.placeholder
i||(i=document.createElement("div"),i.style.border="3px dashed #adadad",i.style.boxSizing="border-box",i.style.backgroundColor="#f1f1f1",i.style.width=this.elem.style.width,this.placeholder=i),i.style.height=e,i.style.display="block"===t(this.elem).display?"block":"inline-block",this.elem.parentElement.insertBefore(i,this.elem)},e.prototype.hideIframePlaceholder=function(){this.placeholder&&this.placeholder.parentElement&&this.placeholder.parentElement.removeChild(this.placeholder)},e.prototype.hideIframe=function(){this.elem.style.height="0",this.isHidden=!0},e.prototype.showIframe=function(e){this.elem.style.height=e,this.isHidden=!1}
var i=function(e){var t=document.createElement("iframe")
return t.setAttribute("frameborder","0"),t.style.border="0",t.scrolling="no",void 0!==e.width?t.style.width=e.width+("yes"===e.percent?"%":"px"):t.style.width="100%",t.src=e.protocol+"//"+m+e.id+".html?auto",t},o=function(e){e=decodeURIComponent(e)
for(var t,i=/(\w+)=([^&]+)/g,o={};t=i.exec(e);)o[t[1]]=t[2]
var r=e.match(/^https?:/)
return o.protocol=r?r[0]:"",o},r=function(e,t){return void 0===t?e.c2k_is_loaded:void(e.c2k_is_loaded=t)},n=function(){for(var e=['script[src^="http://'+h+'"]','script[src^="https://'+h+'"]','script[src^="//'+h+'"]'],t=document.querySelectorAll(e.join(", ")),i=0;i<t.length;i++)if(!r(t[i]))return t[i]},l=function(){var t=n()
if(t){r(t,!0)
var l=o(t.src),s=new e(i(l))
f.push(s),t.parentElement.insertBefore(s.elem,t)}},s=function(e){for(var t=0;t<f.length;t++)if(f[t].elem.contentWindow===e)return f[t]},d=function(e,t){var i=s(e.source)
if(i)if("none"===t){var o=i.elem.style.height
i.hideIframe(),i.showIframePlaceholder(o)}else i.isHidden?(i.hideIframePlaceholder(),i.showIframe(t)):i.elem.style.height=t},a=function(e){var t=s(e.source)
if(t){var i=document.documentElement.clientHeight,o=t.elem.getBoundingClientRect(),r={type:"c2k_iframe_position"}
r.scrollTop=o.top<0?-o.top:0,r.height=Math.min(o.bottom,i)-Math.max(o.top,0),e.source.postMessage(JSON.stringify(r),"*")}},c=function(e){if("c2k_embed_loaded"===e.data)return l()
if("c2k_get_iframe_position"===e.data)return a(e)
try{var t=JSON.parse(e.data)||{}}catch(i){return}return"c2k_set_iframe_height"===t.type?d(e,t.height):void 0}
window.addEventListener?window.addEventListener("message",c):window.attachEvent("onmessage",c)
var h="localhost:3000/chiasmBin/embed.js",m="localhost:3000/",f=[]
window.__is_c2k_listener_set__=!0,l()}()
