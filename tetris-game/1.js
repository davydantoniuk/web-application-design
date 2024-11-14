function touchdetect(el, callback)
{
	var eventTouchstart, 
		eventTouchmove, 
		eventTouchend, 
		touchStartClientX,
		touchStartClientY;
	
	if (window.navigator.msPointerEnabled) {
		//Internet Explorer 10
		eventTouchstart    = "MSPointerDown";
		eventTouchmove     = "MSPointerMove";
		eventTouchend      = "MSPointerUp";
	} else {
		eventTouchstart    = "touchstart";
		eventTouchmove     = "touchmove";
		eventTouchend      = "touchend";
	}

	el.addEventListener(eventTouchstart, function (event) {
    if ((!window.navigator.msPointerEnabled && event.touches.length > 1) ||
        event.targetTouches.length > 1) {
      return; // Ignore if touching with more than 1 finger
    }

    if (window.navigator.msPointerEnabled) {
      touchStartClientX = event.pageX;
      touchStartClientY = event.pageY;
    } else {
      touchStartClientX = event.touches[0].clientX;
      touchStartClientY = event.touches[0].clientY;
    }

	var pos = getPos(el);

	var a = {};
	a.x = touchStartClientX - pos.x;
	a.y = touchStartClientY - pos.y;
    a.mode = 'touchstart';
	callback(a);
	
    event.preventDefault();
  });

  el.addEventListener(eventTouchmove, function (event) {

    var touchEndClientX, touchEndClientY;
	
	if (window.navigator.msPointerEnabled) {
      touchEndClientX = event.pageX;
      touchEndClientY = event.pageY;
    } else {
      touchEndClientX = event.changedTouches[0].clientX;
      touchEndClientY = event.changedTouches[0].clientY;
    }

    var dx = touchEndClientX - touchStartClientX;
    var dy = touchEndClientY - touchStartClientY;
	var pos = getPos(el);

    var a = {};
	a.x = touchEndClientX - pos.x;
	a.y = touchEndClientY - pos.y;
	a.dx = dx;
	a.dy = dy;
    a.mode = 'touchmove';
	callback(a);
	
	event.preventDefault();
  });

  el.addEventListener(eventTouchend, function (event) {
    if ((!window.navigator.msPointerEnabled && event.touches.length > 0) ||
        event.targetTouches.length > 0) {
      return; // Ignore if still touching with one or more fingers
    }

    var touchEndClientX, touchEndClientY;

    if (window.navigator.msPointerEnabled) {
      touchEndClientX = event.pageX;
      touchEndClientY = event.pageY;
    } else {
      touchEndClientX = event.changedTouches[0].clientX;
      touchEndClientY = event.changedTouches[0].clientY;
    }

    var dx = touchEndClientX - touchStartClientX;
    var absDx = Math.abs(dx);

    var dy = touchEndClientY - touchStartClientY;
    var absDy = Math.abs(dy);

	var pos = getPos(el);

    var a = {};
	a.x = touchEndClientX - pos.x;
	a.y = touchEndClientY - pos.y;
	a.dx = dx;
	a.dy = dy;
	a.mode = 'touchend';
	callback(a);

    event.preventDefault();	
  });
};
  
//USAGE:
/*
var el = document.getElementById('canvas')
touchdetect(el, function(a){
    // dir: "left", "right", "top", "down"
    if (a == 'touchend' && a.dx>10)
        alert('You just swiped right!')
})
*/

function getPos(el) 
{
  var xPos = 0;
  var yPos = 0;
 
  while (el) 
  {
    if (el.tagName == "BODY") 
	{
      var xScroll = el.scrollLeft || document.documentElement.scrollLeft;
      var yScroll = el.scrollTop || document.documentElement.scrollTop;
 
      xPos += (el.offsetLeft - xScroll + el.clientLeft);
      yPos += (el.offsetTop - yScroll + el.clientTop);
    } else {
      xPos += (el.offsetLeft - el.scrollLeft + el.clientLeft);
      yPos += (el.offsetTop - el.scrollTop + el.clientTop);
    }
    el = el.offsetParent;
  }
  return {
    x: xPos,
    y: yPos
  };
}