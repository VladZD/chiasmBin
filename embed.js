(function() {
  if (window.__is_c2k_listener_set__) {
    window.postMessage('c2k_embed_loaded', '*');
    return;
  }

  function C2KIframe(elem) {
    this.elem = elem;
    this.isHidden = false;
    this.placeholder = null;
  }
  C2KIframe.prototype.showIframePlaceholder = function(iframeHeight) {
    var placeholder = this.placeholder;
    if (!placeholder) {
      placeholder = document.createElement('div');
      placeholder.style.border = '3px dashed #adadad';
      placeholder.style.display = 'inline-block';
      placeholder.style.boxSizing = 'border-box';
      placeholder.style.backgroundColor = "#f1f1f1";
      placeholder.style.width = this.elem.style.width;
      this.placeholder = placeholder;
    }
    placeholder.style.height = iframeHeight;
    this.elem.parentElement.insertBefore(placeholder, this.elem);
  };
  C2KIframe.prototype.hideIframePlaceholder = function() {
    if (!this.placeholder || !this.placeholder.parentElement) return;
    this.placeholder.parentElement.removeChild(this.placeholder);
  };
  C2KIframe.prototype.hideIframe = function() {
    this.elem.style.height = '0';
    this.isHidden = true;
  };
  C2KIframe.prototype.showIframe = function(height) {
    this.elem.style.height = height;
    this.isHidden = false;
  };
  var createIframe = function(options) {
    var iframe = document.createElement('iframe');
    iframe.setAttribute('frameborder', '0');
    if (options.width !== undefined) {
      iframe.style.width = options.width + (options.percent === 'yes' ? '%' : 'px');
    } else {
      iframe.style.width = "100%";
    }
    iframe.src = options.protocol + '//' + DOWNLOAD_LINK + options.id + '.html?auto';
    return iframe;
  };
  var getScriptParams = function(url) {
    url = decodeURIComponent(url);
    var regexp = /(\w+)=([^&]+)/g;
    var params = {}, result;
    while (result = regexp.exec(url)) {
      params[result[1]] = result[2];
    }
    var protocol = url.match(/^https?:/);
    params.protocol = protocol ? protocol[0] : '';
    return params;
  };
  var scriptLoaded = function(script, value) {
    if (value !== undefined) {
      script.c2k_is_loaded = value;
    } else {
      return script.c2k_is_loaded;
    }
  };
  var getNewlyLoadedScript = function() {
    var selectors = [
      'script[src^="http://' + URL + '"]',
      'script[src^="https://' + URL + '"]',
      'script[src^="//' + URL + '"]'
    ];
    var scripts = document.querySelectorAll(selectors.join(', '));
    for (var i = 0; i < scripts.length; i++ ) {
      if (!scriptLoaded(scripts[i])) {
        return scripts[i];
      }
    }
  };
  var loadIframe = function() {
    var script = getNewlyLoadedScript();
    if (!script) return;
    scriptLoaded(script, true);
    var params = getScriptParams(script.src);
    var c2kIframe = new C2KIframe(createIframe(params));
    frames.push(c2kIframe);
    script.parentElement.insertBefore(c2kIframe.elem, script);
  };
  var getIframeByWindow = function(iframeWindow) {
    for (var i = 0; i < frames.length; i++ ) {
      if (frames[i].elem.contentWindow === iframeWindow) {
        return frames[i];
      }
    }
  };
  var iframeHeightListener = function(e, height) {
    var c2kIframe = getIframeByWindow(e.source);
    if (!c2kIframe) return;
    if (height === 'none') {
      var prevHeight = c2kIframe.elem.style.height;
      c2kIframe.hideIframe();
      c2kIframe.showIframePlaceholder(prevHeight);
    } else if (c2kIframe.isHidden) {
      c2kIframe.hideIframePlaceholder();
      c2kIframe.showIframe(height);
    } else {
      c2kIframe.elem.style.height = height;
    }
  };
  var iframePopupListener = function(e) {
    var c2kIframe = getIframeByWindow(e.source);
    if (!c2kIframe) return;
    var windowHeight = document.documentElement.clientHeight;
    var iframeCoords = c2kIframe.elem.getBoundingClientRect();

    var message = {type: 'c2k_iframe_position'};
    message.scrollTop = iframeCoords.top < 0 ? -iframeCoords.top : 0;
    message.height = Math.min(iframeCoords.bottom, windowHeight) - Math.max(iframeCoords.top, 0);
    e.source.postMessage(JSON.stringify(message), '*');
  };
  var listener = function(e) {
    if (e.data === 'c2k_embed_loaded') {
      return loadIframe();
    } else if (e.data === 'c2k_get_iframe_position') {
      return iframePopupListener(e);
    } else {
      try {
        var parsed = JSON.parse(e.data) || {};
      } catch(err) {
        return;
      }
      if (parsed.type === 'c2k_set_iframe_height') {
        return iframeHeightListener(e, parsed.height);
      }
    }
  };

  if (window.addEventListener) {
    window.addEventListener("message", listener);
  } else {
    window.attachEvent("onmessage", listener);
  }
  var URL = '192.168.100.3:8080/embed.js', //without protocol
    DOWNLOAD_LINK = '192.168.100.3:8080/',
    frames = [];
  window.__is_c2k_listener_set__ = true;
  loadIframe();
})();