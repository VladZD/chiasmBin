var retainShading = 0;
var hoverColor = "#CBF0FF";
var compColorOne = "#DFF6FF";
var compColorTwo = "#D9F9D9";
var defaultCommentWindowPixelWidth = 300; // set as a global variable so this value can be customized by the user
var popup;

window.onload = function() {
  if (!isFullHeightIframe()) return;
  document.body.style.overflow = 'hidden';
  addListener('resize', resizeListener);
  document.querySelectorAll('.bar').forEach(elem => elem.addEventListener('contextmenu', function(e) {
    e.preventDefault(); this.parentNode.classList.toggle('collapsed');
  } ));
  document.querySelectorAll('.wrap').forEach(elem => elem.addEventListener('click', function(e) {
    this.classList.remove('collapsed');
  } ));
  setIframeHeight();
};

addListener('message', getPositionListener);

function resizeListener() {
  if (iframeHeight.isHeightAdjusted === false) {
    iframeHeight.isHeightAdjusted = true;
    return;
  }
  if (!iframeHeight.isCollapsed) {
    iframeHeight.resize(true);
  } else {
    iframeHeight.resize(false);
  }
};

// keeps the state of current resizing
var iframeHeight = (function() {
  var resize = throttle(function(startResize) {
    obj.isCollapsed = startResize;
    obj.isHeightAdjusted = startResize ? null : false;
    if (startResize) closePopup();
    setIframeHeight(startResize ? 'none' : undefined);
  }, 1000);
  var obj = {
    resize: resize,
    isCollapsed: false,
    isHeightAdjusted: false
  };
  return obj;
})();

function addListener(event, listener, elem) {
  elem = elem || window;
  if (window.addEventListener) {
    elem.addEventListener(event, listener);
  } else {
    elem.attachEvent("on" + event, listener);
  }
}

function throttle(func, ms) {
  var isRunning, isQueued, timeId;
  var setTimer = function() {
    if (timeId) clearTimeout(timeId);
    timeId = setTimeout(function() {
      timeId = null;
      isRunning = false;
      if (isQueued) {
        func.apply(null, isQueued.args);
        isQueued = false;
      }
    }, ms);
  };
  var run = function() {
    if (isRunning) {
      isQueued = {
        args: arguments
      };
      setTimer();
    } else {
      isRunning = true;
      func.apply(null, arguments);
      setTimer();
    }
  };
  return run;
};

function setIframeHeight(height) {
  height = height || Math.max(
    document.body.scrollHeight, document.documentElement.scrollHeight,
    document.body.offsetHeight, document.documentElement.offsetHeight,
    document.body.clientHeight, document.documentElement.clientHeight
  ) + 'px';
  var message = {
    type: 'c2k_set_iframe_height',
    height: height
  };
  window.parent.postMessage(JSON.stringify(message), '*');
}

function getPositionListener(e) {
  try {
    var message = JSON.parse(e.data);
  } catch(e) {
    return;
  }
  if (message.type !== "c2k_iframe_position") return;
  setPopupPosition(message.height, message.scrollTop);
}

function getAndSetPopupPosition() {
  if (!isFullHeightIframe()) {
    setPopupPosition();
  } else {
    window.parent.postMessage('c2k_get_iframe_position', '*');
  }
}

function isFullHeightIframe() {
  return window.top !== window && window.location.search === "?auto";
}

function setPopupPosition(height, scrollTop) {
  popup.style.top = vertMiddle(height, scrollTop);
  popup.style.left = horzCenter();
  popup.style.visibility = "visible";
}

function showPopup(text) {
  if (!popup) {
    popup = document.createElement('div');
    popup.id = "popup";
    popup.onmousedown = dragPopup;
    popup.onselectstart = function() {
      return false;
    };
    document.body.appendChild(popup);
  }
  var dragBar = '<div class="dragBar"><a href="javascript:void(0);" onclick="closePopup();"></a></div>';
  popup.innerHTML = dragBar + text;
  popup.style.width = getPopupWidth();
  getAndSetPopupPosition();
}

function mouseOver(e, currentTarget) {
  if (retainShading) return;
  e = e || event;
  var target = e.target || e.srcElement;
  if (shouldHighlight(target)) {
    match(currentTarget);
  } else {
    wipe();
  }

  function shouldHighlight(elem) {
    //unless the cursor is over the divider or no-comment column, we should highlight
    return elem.className.indexOf('divider') === -1 && elem.className.indexOf('no-comment') === -1;
  }
}

function highlight(id, opts, colors) {
  opts = opts || {};
  colors = colors || {};
  if (!opts.present && retainShading) return;
  var w = '';
  if (opts.wrap) {
    id = id.slice(5);
    w = 'w';
  }
  if (opts.present) {
    retainShading = 0;
    wipe();
    retainShading = 1;
  }
  document.getElementById(w + id).style.background = colors.hover || hoverColor;
  for (var i = 0; i < arr.length; i++ ) {
    if (arr[i]['id'] != id) continue;
    var companions = arr[i]['companions'];
    try {
      for (var j = 0; j < companions.length; j++ ) {
        if (companions[j]['isBlue']) {
          document.getElementById(w + companions[j]['id']).style.background = colors.blue || compColorOne;
        } else {
          document.getElementById(w + companions[j]['id']).style.background = colors.green || compColorTwo;
        }
      }
    } catch (err) {
    }
    if (opts.present) {
      showPopup('<div>' + arr[i]['note'] + '</div>');
    }
    break;
  }
}

function match(obj) {
  highlight(obj.id);
}

function matchWrap(obj) {
  highlight(obj.id, { wrap: true });
}

function present(obj) {
  highlight(obj.id, { present: true }, { blue: hoverColor });
}

function presentWrap(obj) {
  highlight(obj.id, { wrap: true, present: true });
}

function wipe() {
  if (retainShading) return;
  var w;
  for (var i = 0; i < arr.length; i++) {
    try {
      w = arr[i]['wrap'] ? 'w' : '';
      document.getElementById(w + arr[i]['id']).style.background = '';
    } catch (err) {
    }
  }
}

function wipeWrap() {
  wipe();
}

function closePopup() {
  if (popup) {
    popup.style.display = 'none';
  }
  retainShading = 0;
  wipe();
}

// set width of commentary window - default to 300 and if height goes up 2:1 then increase width up to the limit of 1200 wide because that's near the limit of my framing image and it should be plenty for any reasonable user content. 
function getPopupWidth() {  
  popup.style.visibility = 'hidden';
  popup.style.display = 'block'; // because if the display value is 'none', there is no width or height dimension to be measured 
  var w = defaultCommentWindowPixelWidth; // my default width number - set as a global
  popup.style.width = w + "px"; // set the div to the default width so I can test the height and get the area. 
  var h = popup.offsetHeight;
  if (h > 150) { //  * target 2:1
    var w = Math.round(Math.sqrt((w * 2 * h)));
  }
  // Display of the frame gets wonky after about 1200 wide, so limit the max width to 1200. 
  if (w > 1200) {
    w = 1200;
  } 
  // Finally, limit width no more than 90% of of the user's  screen. 
  var pageWidth = document.documentElement.clientWidth * 0.9;
  if (w > pageWidth) {
    w = pageWidth;
  }
  return w + "px";
}

function vertMiddle(height, scrollTop) {
  height = height || document.documentElement.clientHeight;
  scrollTop = scrollTop || window.pageYOffset || document.documentElement.scrollTop;
  var popupHeight = popup.offsetHeight;
  return scrollTop + height / 2 - popupHeight / 2 + "px";
}

function horzCenter() {
  var width = document.documentElement.clientWidth;
  var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
  var popupWidth = popup.offsetWidth;
  return scrollLeft + width / 2 - popupWidth / 2 + "px";
}

function getIE8Event() {
  var e = {};
  e.which = event.button & 1 ? 1 : null;
  e.pageX = event.clientX + document.documentElement.scrollLeft;
  e.pageY = event.clientY + document.documentElement.scrollTop;
  return e;
}

function dragPopup(e) {
  e = e || getIE8Event();
  if (e.which !== 1) return;
  var shiftX = e.pageX - parseFloat(popup.style.left);
  var shiftY = e.pageY - parseFloat(popup.style.top);

  document.onmousemove = function(e) {
    e = e || getIE8Event();
    popup.style.left = e.pageX - shiftX + 'px';
    popup.style.top = e.pageY - shiftY + 'px';
  };

  document.onmouseup = function() {
    document.onmousemove = null;
    document.onmouseup = null;
    popup.onmousedown = dragPopup;
  };
  
  popup.onmousedown = null;
  return false;
}
