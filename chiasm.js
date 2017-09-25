var retainShading = 0;
var hoverColor = "#CBF0FF";
var compColorOne = "#DFF6FF";
var compColorTwo = "#D9F9D9";
var defaultCommentWindowPixelWidth = 300; // set as a global variable so this value can be customized by the user

window.onload = function() {
	if (!isFullHeightIframe()) return;
	document.body.style.overflow = 'hidden';
	setIframeHeight();
};

if (window.addEventListener) {
	window.addEventListener("message", getPositionListener);
	window.addEventListener('resize', resizeListener);
} else {
	window.attachEvent("onmessage", getPositionListener);
	window.attachEvent('onresize', resizeListener);
}

function resizeListener() {
	//uncomment if the width of usual iframes can be fluid
	// if (!isFullHeightIframe()) return;
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

var iframeHeight = (function() {
	var resize = throttle(function(startResize) {
		obj.isCollapsed = startResize;
		obj.isHeightAdjusted = startResize ? null : false;
		if (startResize) {
			closeMe(0);
			closeMe(1);
		}
		setIframeHeight(startResize ? 'none' : undefined);
	}, 1000);
	var obj = {
		resize: resize,
		isCollapsed: false,
		isHeightAdjusted: false
	};
	return obj;
})();

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
	setPosition(message.height, message.scrollTop);
}

function getAndSetPosition() {
	if (!isFullHeightIframe()) {
		setPosition();
	} else {
		window.parent.postMessage('c2k_get_iframe_position', '*');
	}
}

function isFullHeightIframe() {
	return window.top !== window && window.location.search === "?auto";
}

function setPosition(height, scrollTop) {
	var d = document.getElementById('showDiv');
	d.style.top = vertMiddle(height, scrollTop);
	d.style.left = horzCenter();
	d.style.visibility = "visible";
}

function showDiv(s, type) {
	var d = document.getElementById('showDiv');
	var filler = '<div class="dragBar"><a href="javascript:void(0);" onclick="closeMe('+ type + ');"></a></div>'; // The javascript void operator in the href keeps the browser from snapping up to the top of the page whe nclosing the popup window
	document.getElementById('showDivInside').innerHTML = filler+s;
	d.style.width = windowResize();
	getAndSetPosition();
}

function mouseOver(e, currentTarget) {
	if (retainShading) return;
	var e = e || event;
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

function match(obj) {
	if (!retainShading) {
		var id=obj.id;
		for(var i=0; i<arr.length; i++) {       
			if (arr[i]['id'] == id) {// found the array element/
				var companions = arr[i]['companions'];
				try {
					document.getElementById(id).style.background=hoverColor;
					var companions = arr[i]['companions']; // loop through lines showing color  
					for(var j=0; j<companions.length; j++) { 
						if (companions[j]['isBlue']) { 
							document.getElementById(companions[j]['id']).style.background=compColorOne;
						} else { 
							document.getElementById(companions[j]['id']).style.background=compColorTwo;
						}   
					}                   
				} catch (err) {         
}}}}}

function wipe() {
	if (!retainShading) {
		for(var i=0; i<arr.length; i++) {
			try {
				document.getElementById(arr[i]['id']).style.background='transparent';
			} catch (err) {
}}}}
	
function matchWrap(obj) {
	if (!retainShading) {
		var strWithId = obj.id; // the id is at end: i.e. "barId22"
		var id=strWithId.substr(5);
		var wrapId='w'+id;
		for(var i=0; i<arr.length; i++) {       
			if (arr[i]['id'] == id) {// found the array element
				try {
					document.getElementById(wrapId).style.background=hoverColor;                
					var companions = arr[i]['companions']; // loop through bars showing color 
					for(var j=0; j<companions.length; j++) { 
						if (companions[j]['isBlue']) {
							document.getElementById('w'+companions[j]['id']).style.background=compColorOne;
						} else {
							document.getElementById('w'+companions[j]['id']).style.background=compColorTwo;
						}   
					}
				} catch (err) {         
}}}}}

function wipeWrap() {
	if (!retainShading) {
		for(var i=0; i<arr.length; i++) {
			try {
				document.getElementById('w'+arr[i]['id']).style.background='transparent'; // transparent
			} catch (err) {
}}}}

function present(obj) { // for Lines only - retain current hover shading
	retainShading = 0;
	wipe();
	wipeWrap();
	retainShading = 1;
	var s = '';
	var id=obj.id;
	for(var i=0; i<arr.length; i++) {       
		if (arr[i]['id'] == id) {// found the array element
			if (!arr[i]['note']) {
			return; // done
			}
			 
			try {
			var companions = arr[i]['companions'];
				document.getElementById(id).style.background=hoverColor;
				str = document.getElementById(id).innerHTML;
				s = s+'<li>'+str+'</li>';
				for(var j=0; j<companions.length; j++) { 
					if (companions[j]['isBlue']) {
						document.getElementById(companions[j]['id']).style.background=hoverColor;
					} else {
						document.getElementById(companions[j]['id']).style.background=compColorTwo;
					}
					/* this block was being used to add the line clicked with all its companion lines in an ordered list at the top of the window. 
					str = document.getElementById(companions[j]['id']).innerHTML;
					str = str.replace(/<span/g,'<span class=z');
					s = s+'<li>'+str+'</li>';     */        
				}
			} catch (err) {       
			}
				//s = '<ul>'+s+'</ul><div>'+arr[i]['note']+'</div>'; this line was being used to add the line clicked with all its companion lines in an ordered list at the top of the window. 
				s = '<div><br>'+arr[i]['note']+'</div>';
			break;      
		}     
	}
	showDiv(s, 0);
}

function presentWrap(obj) { // for Bars only - retain current hover shading
	retainShading = 0;
	wipe();
	wipeWrap();
	retainShading = 1;
	var s = '';
	var strWithId = obj.id; // the id is at end: i.e. "barId22"
	var id=strWithId.substr(5);
	var wrapId='w'+id;
	for(var i=0; i<arr.length; i++) {       
		if (arr[i]['id'] == id) {// found the array element
			document.getElementById(wrapId).style.background=hoverColor;        
			try {
				var companions = arr[i]['companions'];
				for(var j=0; j<companions.length; j++) { 
				//favcol = ('green' === colour) ? 'is green.' : 'is not green.';
					if (companions[j]['isBlue']) {
						document.getElementById('w'+companions[j]['id']).style.background=compColorOne;
					} else {
						document.getElementById('w'+companions[j]['id']).style.background=compColorTwo;
					}   
				}
			} catch (err) { }
			// output the note.
			s = '<div><br>'+arr[i]['note']+'</div>';  
		}     
	}
	showDiv(s, 1);
}

function closeMe(kind) {
	document.getElementById('showDiv').style.display='none';
	retainShading=0;
	if(kind > 0) { // bar
		wipeWrap();
	} else {
		wipe();
	}
}
// set width of commentary window - default to 300 and if height goes up 2:1 then increase width up to the limit of 1200 wide because that's near the limit of my framing image and it should be plenty for any reasonable user content. 
function windowResize() {  
	var a = document.getElementById('showDiv'); 
	a.style.visibility = 'hidden';
	a.style.display = 'block'; // because if the display value is 'none', there is no width or height dimension to be measured 
	var w = defaultCommentWindowPixelWidth; // my default width number - set as a global
	a.style.width = w+"px"; // set the div to the default width so I can test the height and get the area. 
	var h = a.offsetHeight;
	if (h > 150) { //  * target 2:1
		var w = Math.round(Math.sqrt((w * 2 * h)));
	}
	// Display of the frame gets wonky after about 1200 wide, so limit the max width to 1200. 
	if (w > 1200) { 
		w = 1200;
	} 
	// Finally, limit width no more than 90% of of the user's  screen. 
	var maxWide = document.documentElement.clientWidth * 0.9;
	if (w > maxWide) {
		w = maxWide;
	}
	return w+"px";
}

function vertMiddle(height, scrollTop) {
	height = height || document.documentElement.clientHeight;
	scrollTop = scrollTop || window.pageYOffset || document.documentElement.scrollTop;
	var popupHeight = document.getElementById('showDiv').offsetHeight;
	return scrollTop + height / 2 - popupHeight /2 + "px";
}

function horzCenter() {
	var width = document.documentElement.clientWidth;
	var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
	var popupWidth = document.getElementById('showDiv').offsetWidth;
	return scrollLeft + width / 2 - popupWidth / 2 +"px";
}

function toggleLN() { /* During project development: toggle the line numbers on and off - that appear in the display */
	var x = document.querySelectorAll(".z");
			if (x[0].style.display == "none") {
			var toggled =  "inline";
		} else {
			var toggled =  "none";
		}
	var i;
	for (i = 0; i < x.length; i++) {
		x[i].style.display = toggled;
	}
}